import { AppSettings, ThemeTokens } from "./settings.model";
import { environment } from "../../../environments/environment";

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  bgApp: "#1a0f0f",
  bgSurface: "#2c1a1a",
  bgSurfaceHover: "#3d2424",

  primary: "#8caeab",
  primaryFg: "#000000",
  secondary: "#4a3b3b",
  accent: "#e09f7d",

  textMain: "#fdf8e8",
  textMuted: "#a89090",
  textInverse: "#000000",

  borderDefault: "#4a3b3b",
  borderActive: "#8caeab",

  colorError: "#ef4444",
  colorSuccess: "#22c55e",
};

export const DEFAULT_SETTINGS: AppSettings = {
  runtime: {
    apiBaseUrl: environment.apiBaseUrl,
    wsBaseUrl: environment.wsBaseUrl,
  },

  general: {
    startWithWindows: false,
    minimizeToTray: true,
    alwaysOnTop: false,
    rememberWindowPositions: true,
    openTeleprompterDockedTopCenter: false,
    windowOpacity: 1.0,
  },

  theme: {
    themeId: "default",
    customTokens: DEFAULT_THEME_TOKENS,
    uiFontFamily: "Inter",
    teleprompterFontFamily: "Inter",
  },

  selectedSttProviderId: "cloud_stub",
  selectedLlmProviderId: "gemini",

  sttUi: {
    autoScrollTranscript: true,
    detectQuestionsAutomatically: false,
    minSilenceMs: 2000,
    inputMode: "mic",
    selectedMicId: null,
    selectedSystemSourceId: null,
  },

  stt: {
    mode: "self_hosted",
    language: "auto",
    sampleRate: 16000,
    format: "pcm16",
    chunkMs: 250,
    httpBaseUrl: environment.apiBaseUrl,

    custom: {
      protocol: "prompter_ws",
      url: "wss://",
      authType: "none",
      token: "",
      headerName: "Authorization",
      timeoutMs: 15000,
    },

    cloud: {
      provider: "none",
      apiKey: "",
      timeoutMs: 15000,
    },
  },

  llm: {
    mode: "openai_compatible",
    provider: "openai_compat",

    openaiCompat: {
      baseUrl: "https://api.openai.com/v1",
      apiKey: "",
      model: "gpt-4o-mini",
      timeoutMs: 15000,
    },

    gemini: {
      apiKey: "",
      model: "gemini-2.5-flash",
      timeoutMs: 15000,
    },

    temperature: 0.2,
    maxTokens: 256,
    systemPrompt: "",
  },

  language: {
    appLanguage: "es",
    aiInputLanguage: "auto",
    aiOutputLanguage: "auto",
    sttPreferredLanguage: "auto",
  },

  hotkeys: [
    { id: "hk1", action: "stt.toggle", combo: "Ctrl+Space", enabled: true },
    { id: "hk2", action: "ai.generate", combo: "Ctrl+R", enabled: true },
    { id: "hk3", action: "overlay.toggle", combo: "Ctrl+T", enabled: true },
    { id: "hk4", action: "overlay.dockTopCenter", combo: "Ctrl+D", enabled: true },
    { id: "hk5", action: "teleprompter.wordBack", combo: "Alt+Left", enabled: true },
    { id: "hk6", action: "teleprompter.wordForward", combo: "Alt+Right", enabled: true },
  ],

  overlay: {
    fontSizePx: 34,
    speed: 1,
    dock: "free",
  },
};
