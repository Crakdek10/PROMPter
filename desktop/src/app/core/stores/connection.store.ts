import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { ProvidersClient } from "../services/clients/providers.client";
import { ProviderListItem } from "../models/provider.model";
import { SettingsStore } from "./settings.store";

@Injectable({ providedIn: "root" })
export class ConnectionStore {
  private readonly http = inject(HttpClient);
  private readonly providersClient = inject(ProvidersClient);
  private readonly settingsStore = inject(SettingsStore);

  readonly backendOnline = signal(false);
  readonly latencyMs = signal<number | null>(null);
  readonly lastError = signal<string | null>(null);

  readonly sttProviders = signal<ProviderListItem[]>([]);
  readonly llmProviders = signal<ProviderListItem[]>([]);

  // ✅ settings paths correctos
  readonly apiBaseUrl = computed(() => this.settingsStore.settings().runtime.apiBaseUrl);
  readonly wsBaseUrl = computed(() => this.settingsStore.settings().runtime.wsBaseUrl);

  readonly selectedSttProviderId = computed(() => this.settingsStore.settings().selectedSttProviderId);
  readonly selectedLlmProviderId = computed(() => this.settingsStore.settings().selectedLlmProviderId);

  readonly isReady = computed(() =>
    this.backendOnline() &&
    this.sttProviders().length > 0 &&
    this.llmProviders().length > 0
  );

  async refreshHealth(): Promise<void> {
    const url = `${this.apiBaseUrl()}/health`;
    const t0 = performance.now();

    try {
      const res = await firstValueFrom(this.http.get<{ status: string }>(url));
      const t1 = performance.now();
      this.latencyMs.set(Math.round(t1 - t0));
      this.backendOnline.set(res.status === "ok");
      this.lastError.set(null);
    } catch (e: any) {
      this.backendOnline.set(false);
      this.latencyMs.set(null);
      this.lastError.set(e?.message ?? "Health check failed");
    }
  }

  async loadProviders(): Promise<void> {
    console.log("apiBaseUrl =", this.apiBaseUrl());
    try {
      const [stt, llm] = await Promise.all([
        firstValueFrom(this.providersClient.listSttProviders()),
        firstValueFrom(this.providersClient.listLlmProviders()),
      ]);

      const sttItems = stt.items ?? [];
      const llmItems = llm.items ?? [];

      this.sttProviders.set(sttItems);
      this.llmProviders.set(llmItems);

      const s = this.settingsStore.settings();
      const sttOk = sttItems.some(p => p.name === s.selectedSttProviderId);
      const llmOk = llmItems.some(p => p.name === s.selectedLlmProviderId);

      const nextStt = sttOk ? s.selectedSttProviderId : (sttItems[0]?.name ?? "cloud_stub");
      const nextLlm = llmOk ? s.selectedLlmProviderId : (llmItems[0]?.name ?? "openai_compat");

      this.settingsStore.updateDeep(draft => {
        draft.selectedSttProviderId = nextStt;
        draft.selectedLlmProviderId = nextLlm;
      });

      this.lastError.set(null);
    } catch (e: any) {
      this.lastError.set(e?.message ?? "Failed to load providers");
    }
  }

  setSelectedSttProviderId(name: string) {
    this.settingsStore.updateDeep(s => {
      s.selectedSttProviderId = name;
    });
  }

  setSelectedLlmProviderId(name: string) {
    this.settingsStore.updateDeep(s => {
      s.selectedLlmProviderId = name;
    });
  }
}
