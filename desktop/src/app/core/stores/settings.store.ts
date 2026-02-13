import { Injectable, signal } from "@angular/core";
import { StorageService } from "../services/storage/storage.service";
import { AppSettings } from "../models/settings.model";
import { DEFAULT_SETTINGS } from "../models/settings.defaults";

const KEY = "prompter.settings.v1";

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 1;
  return Math.max(0, Math.min(1, v));
}
function clampInt(v: number, min: number, max: number): number {
  const n = Math.floor(Number(v));
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function normalizeHttpBaseUrl(v: unknown, fallback: string): string {
  const s = String(v ?? "").trim();
  if (!s) return fallback;

  // si el usuario pone "127.0.0.1:8000" sin http, lo arreglamos
  if (!/^https?:\/\//i.test(s)) return `http://${s}`.replace(/\/+$/, "");

  return s.replace(/\/+$/, "");
}

function normalizeWsBaseUrl(v: unknown, fallback: string): string {
  const s = String(v ?? "").trim();
  if (!s) return fallback;

  if (!/^wss?:\/\//i.test(s)) return `ws://${s}`.replace(/\/+$/, "");

  return s.replace(/\/+$/, "");
}

@Injectable({ providedIn: "root" })
export class SettingsStore {
  constructor(private readonly storage: StorageService) {}

  readonly settings = signal<AppSettings>(DEFAULT_SETTINGS);

  init(): void {
    const saved = this.storage.getJSON<Partial<AppSettings>>(KEY);
    if (!saved) return;

    const merged: AppSettings = {
      ...DEFAULT_SETTINGS,
      ...saved,

      runtime: { ...DEFAULT_SETTINGS.runtime, ...(saved.runtime ?? {}) },
      general: { ...DEFAULT_SETTINGS.general, ...(saved.general ?? {}) },
      theme: { ...DEFAULT_SETTINGS.theme, ...(saved.theme ?? {}) },

      selectedSttProviderId: saved.selectedSttProviderId ?? DEFAULT_SETTINGS.selectedSttProviderId,
      selectedLlmProviderId: saved.selectedLlmProviderId ?? DEFAULT_SETTINGS.selectedLlmProviderId,

      sttUi: { ...DEFAULT_SETTINGS.sttUi, ...(saved.sttUi ?? {}) },

      stt: {
        ...DEFAULT_SETTINGS.stt,
        ...(saved.stt ?? {}),
        custom: { ...DEFAULT_SETTINGS.stt.custom, ...(saved.stt?.custom ?? {}) },
        cloud: { ...DEFAULT_SETTINGS.stt.cloud, ...(saved.stt?.cloud ?? {}) },
      },

      llm: {
        ...DEFAULT_SETTINGS.llm,
        ...(saved.llm ?? {}),
        openaiCompat: { ...DEFAULT_SETTINGS.llm.openaiCompat, ...(saved.llm?.openaiCompat ?? {}) },
        gemini: { ...DEFAULT_SETTINGS.llm.gemini, ...(saved.llm?.gemini ?? {}) },
      },

      language: { ...DEFAULT_SETTINGS.language, ...(saved.language ?? {}) },
      hotkeys: saved.hotkeys ?? DEFAULT_SETTINGS.hotkeys,
      overlay: { ...DEFAULT_SETTINGS.overlay, ...(saved.overlay ?? {}) },
    };

    merged.general.windowOpacity = clamp01(merged.general.windowOpacity);
    merged.sttUi.minSilenceMs = clampInt(merged.sttUi.minSilenceMs, 1000, 10000);
    merged.stt.sampleRate = clampInt(merged.stt.sampleRate, 8000, 48000);
    merged.stt.chunkMs = clampInt(merged.stt.chunkMs, 50, 2000);
    merged.llm.maxTokens = clampInt(merged.llm.maxTokens, 1, 8192);

    merged.runtime.apiBaseUrl = normalizeHttpBaseUrl(
      merged.runtime.apiBaseUrl,
      DEFAULT_SETTINGS.runtime.apiBaseUrl
    );

    merged.runtime.wsBaseUrl = normalizeWsBaseUrl(
      merged.runtime.wsBaseUrl,
      DEFAULT_SETTINGS.runtime.wsBaseUrl
    );

    this.settings.set(merged);
  }

  updateDeep(mutator: (draft: AppSettings) => void): void {
    const draft: AppSettings = structuredClone(this.settings());
    mutator(draft);

    draft.general.windowOpacity = clamp01(draft.general.windowOpacity);
    draft.sttUi.minSilenceMs = clampInt(draft.sttUi.minSilenceMs, 1000, 10000);
    draft.stt.sampleRate = clampInt(draft.stt.sampleRate, 8000, 48000);
    draft.stt.chunkMs = clampInt(draft.stt.chunkMs, 50, 2000);
    draft.llm.maxTokens = clampInt(draft.llm.maxTokens, 1, 8192);

    this.settings.set(draft);
    this.storage.setJSON(KEY, draft);
  }
}
