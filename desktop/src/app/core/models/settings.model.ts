export type AudioInputMode = "mic" | "system";
export type AppLanguage = "es" | "en";
export type AutoOrLang = "auto" | "es" | "en";
export type ChatAuthor = "user" | "ai" | "system";
export type ThemeId = "default" | "custom";

export type SttMode = "local" | "self_hosted" | "cloud" | "custom_endpoint";

export type SttProtocol = "prompter_ws" | "http_upload" | "openai_compat";

export type LlmMode = "cloud" | "local" | "self_hosted" | "openai_compatible";

export type LlmProvider = "gemini" | "openai_compat";

export type HotkeyAction =
  | "stt.toggle"
  | "ai.generate"
  | "overlay.toggle"
  | "overlay.dockTopCenter"
  | "teleprompter.wordForward"
  | "teleprompter.wordBack";

export interface HotkeyBinding {
  id: string;
  action: HotkeyAction;
  combo: string;
  enabled: boolean;
}

export interface ThemeTokens {
  bgApp: string;
  bgSurface: string;
  bgSurfaceHover: string;

  primary: string;
  primaryFg: string;
  secondary: string;
  accent: string;

  textMain: string;
  textMuted: string;
  textInverse: string;

  borderDefault: string;
  borderActive: string;

  colorError: string;
  colorSuccess: string;
}

export interface ThemeSettings {
  themeId: ThemeId;
  customTokens: ThemeTokens;
  uiFontFamily: string;
  teleprompterFontFamily: string;
}

export interface GeneralSettings {
  startWithWindows: boolean;
  minimizeToTray: boolean;
  alwaysOnTop: boolean;
  rememberWindowPositions: boolean;
  openTeleprompterDockedTopCenter: boolean;

  windowOpacity: number;
}

export interface SttUiSettings {
  autoScrollTranscript: boolean;
  detectQuestionsAutomatically: boolean;
  minSilenceMs: number;
  inputMode: AudioInputMode;

  selectedMicId?: string | null;
  selectedSystemSourceId?: string | null;
}

export interface RuntimeSettings {
  apiBaseUrl: string;
  wsBaseUrl: string;
}

export interface SttSettings {
  mode: SttMode;

  language: AutoOrLang;
  sampleRate: number;
  format: "pcm16";
  chunkMs: number;

  httpBaseUrl: string;

  custom: {
    protocol: SttProtocol;
    url: string;
    authType: "none" | "bearer" | "header";
    token: string;
    headerName: string;
    timeoutMs: number;
  };

  cloud: {
    provider: "none" | "google" | "aws" | "azure" | "deepgram" | "assemblyai";
    apiKey: string;
    region?: string;
    timeoutMs: number;
  };
}

export interface LlmSettings {
  mode: LlmMode;

  provider: LlmProvider;

  openaiCompat: {
    baseUrl: string;
    apiKey: string;
    model: string;
    timeoutMs: number;
  };

  gemini: {
    apiKey: string;
    model: string;
    timeoutMs: number;
  };

  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface LanguageSettings {
  appLanguage: AppLanguage;
  aiInputLanguage: AutoOrLang;
  aiOutputLanguage: AutoOrLang;
  sttPreferredLanguage: AutoOrLang;
}

export interface OverlaySettings {
  fontSizePx: number;
  speed: number;
  dock: "free" | "top-center";
}

export interface AppSettings {
  runtime: RuntimeSettings;
  general: GeneralSettings;
  theme: ThemeSettings;

  selectedSttProviderId: string;
  selectedLlmProviderId: string;

  sttUi: SttUiSettings;
  stt: SttSettings;

  llm: LlmSettings;

  language: LanguageSettings;
  hotkeys: HotkeyBinding[];
  overlay: OverlaySettings;
}
