import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { SettingsStore } from "../../../../core/stores/settings.store";
import { ConnectionStore } from "../../../../core/stores/connection.store";
import { LlmClient } from "../../../../core/services/clients/llm.client";
import { firstValueFrom } from "rxjs";
import { LLMGenerateIn } from "../../../../core/models/llm.model";

type ConnStatus = "idle" | "checking" | "ok" | "bad";

@Component({
  selector: "app-settings-connections-panel",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./settings-connections-panel.component.html",
})
export class SettingsConnectionsPanelComponent {
  private readonly settings = inject(SettingsStore);
  private readonly connectionStore = inject(ConnectionStore);
  private readonly llmClient = inject(LlmClient);

  // providers (vienen del ConnectionStore)
  readonly sttProviders = this.connectionStore.sttProviders;
  readonly llmProviders = this.connectionStore.llmProviders;

  // values (runtime)
  readonly apiBaseUrl = computed(() => this.settings.settings().runtime.apiBaseUrl);
  readonly wsBaseUrl = computed(() => this.settings.settings().runtime.wsBaseUrl);

  // selected providers
  readonly selectedLlmProviderId = computed(() => this.settings.settings().selectedLlmProviderId);
  readonly selectedSttProviderId = computed(() => this.settings.settings().selectedSttProviderId);

  // stt endpoint + timeout
  readonly sttEndpointDisplay = computed(() => `${this.wsBaseUrl()}/ws/stt`);
  readonly sttTimeoutMs = computed(() => this.settings.settings().stt.custom.timeoutMs);

  readonly lastError = this.connectionStore.lastError;

  // masked key
  readonly llmKeyMasked = computed(() => {
    const s = this.settings.settings();
    const provider = s.selectedLlmProviderId;

    const key =
      provider === "gemini"
        ? (s.llm.gemini.apiKey ?? "")
        : (s.llm.openaiCompat.apiKey ?? "");

    if (!key) return "";
    if (key.length <= 10) return key;
    return key.slice(0, 6) + "…" + key.slice(-4);
  });

  // ui status
  readonly llmStatus = signal<ConnStatus>("idle");
  readonly sttStatus = signal<ConnStatus>("idle");
  readonly llmError = signal<string | null>(null);
  readonly sttError = signal<string | null>(null);
  readonly llmModelUsed = signal<string | null>(null);

  readonly llmModelValue = computed(() => {
    const s = this.settings.settings();
    return s.selectedLlmProviderId === "gemini"
      ? s.llm.gemini.model
      : s.llm.openaiCompat.model;
  });


  constructor() {
    queueMicrotask(async () => {
      await this.connectionStore.refreshHealth();
      await this.connectionStore.loadProviders();
    });

    // si cambian las URLs, resetea estado
    effect(() => {
      this.apiBaseUrl();
      this.wsBaseUrl();
      this.llmStatus.set("idle");
      this.sttStatus.set("idle");
      this.llmError.set(null);
      this.sttError.set(null);
    });
  }

  // ---- runtime ----
  onApiBaseUrlInput(v: string) {
    const raw = (v ?? "").trim();
    const normalized =
      raw && !/^https?:\/\//i.test(raw) ? `http://${raw}` : raw;

    this.settings.updateDeep(s => {
      s.runtime.apiBaseUrl = normalized.replace(/\/+$/, "");
    });
  }


  onWsBaseUrlInput(v: string) {
    const raw = (v ?? "").trim();
    const normalized =
      raw && !/^wss?:\/\//i.test(raw) ? `ws://${raw}` : raw;

    this.settings.updateDeep(s => {
      s.runtime.wsBaseUrl = normalized.replace(/\/+$/, "");
    });
  }


  // ---- providers ----
  onPickLlmProvider(id: string) {
    this.settings.updateDeep(s => { s.selectedLlmProviderId = id; });
    this.llmStatus.set("idle");
    this.llmError.set(null);
  }

  onPickSttProvider(id: string) {
    this.settings.updateDeep(s => { s.selectedSttProviderId = id; });
    this.sttStatus.set("idle");
    this.sttError.set(null);
  }

  // ---- keys/settings ----
  onLlmApiKeyInput(v: string) {
    const key = v ?? "";
    this.settings.updateDeep(s => {
      if (s.selectedLlmProviderId === "gemini") s.llm.gemini.apiKey = key;
      else s.llm.openaiCompat.apiKey = key;
    });
    this.llmStatus.set("idle");
    this.llmError.set(null);
  }

  onLlmModelInput(v: string) {
    const model = (v ?? "").trim();
    this.settings.updateDeep(s => {
      if (s.selectedLlmProviderId === "gemini") {
        s.llm.gemini.model = model;
      } else {
        s.llm.openaiCompat.model = model;
      }
    });
    this.llmStatus.set("idle");
  }

  onSttTimeoutInput(v: string) {
    const n = Math.max(1000, Math.floor(Number(v) || 0));
    this.settings.updateDeep(s => { s.stt.custom.timeoutMs = n; });
    this.sttStatus.set("idle");
    this.sttError.set(null);
  }

  // ---- tests ----
  async testLlm(): Promise<void> {
    this.llmStatus.set("checking");
    this.llmError.set(null);

    try {
      const s = this.settings.settings();

      let config: Record<string, unknown> = {};

      if (s.selectedLlmProviderId === "gemini") {
        config = {
          api_key: s.llm.gemini.apiKey,
          model: s.llm.gemini.model,
          timeout_s: Math.floor(s.llm.gemini.timeoutMs / 1000),
        };
      } else {
        config = {
          api_key: s.llm.openaiCompat.apiKey,
          model: s.llm.openaiCompat.model,
          timeout_s: Math.floor(s.llm.openaiCompat.timeoutMs / 1000),
        };
      }

      const payload: LLMGenerateIn = {
        provider: s.selectedLlmProviderId,
        messages: [{ role: "user", content: "ping" }],
        temperature: s.llm.temperature,
        max_tokens: s.llm.maxTokens,
        config,
        extra: null,
      };

      const res = await firstValueFrom(this.llmClient.generate(payload));
      this.llmModelUsed.set(res.model ?? null);
      this.llmStatus.set("ok");
    } catch (e: any) {
      this.llmStatus.set("bad");
      this.llmError.set(e?.error?.error?.message ?? e?.message ?? "No se pudo probar IA");
      this.llmModelUsed.set(null);
    }
  }


  async testSttWs(): Promise<void> {
    this.sttStatus.set("checking");
    this.sttError.set(null);

    const url = `${this.wsBaseUrl()}/ws/stt`;
    const sessionId = crypto.randomUUID();

    try {
      const ok = await this.wsProbeReady(url, sessionId, this.sttTimeoutMs());
      this.sttStatus.set(ok ? "ok" : "bad");
      if (!ok) this.sttError.set("No se recibió 'ready' a tiempo");
    } catch (e: any) {
      this.sttStatus.set("bad");
      this.sttError.set(e?.message ?? "No se pudo probar STT");
    }
  }

  private wsProbeReady(url: string, sessionId: string, timeoutMs: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let done = false;
      let ws: WebSocket | null = null;

      const finish = (val: boolean, err?: any) => {
        if (done) return;
        done = true;
        try { ws?.close(); } catch {}
        if (err) reject(err);
        else resolve(val);
      };

      const timer = setTimeout(() => finish(false), Math.max(1000, timeoutMs));

      try {
        ws = new WebSocket(url);

        ws.onopen = () => {
          ws?.send(JSON.stringify({ type: "start", session_id: sessionId, config: {} }));
        };

        ws.onmessage = (ev) => {
          try {
            const msg = JSON.parse(ev.data);
            if (msg?.type === "ready") {
              clearTimeout(timer);
              finish(true);
              return;
            }
            if (msg?.type === "error") {
              clearTimeout(timer);
              finish(false);
              return;
            }
          } catch {}
        };

        ws.onerror = () => {
          clearTimeout(timer);
          finish(false, new Error("WebSocket error"));
        };

        ws.onclose = () => {
          if (!done) {
            clearTimeout(timer);
            finish(false);
          }
        };
      } catch (err) {
        clearTimeout(timer);
        finish(false, err);
      }
    });
  }
}
