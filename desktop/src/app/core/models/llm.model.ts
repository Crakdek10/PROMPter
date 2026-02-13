export type LLMRole = "system" | "user" | "assistant" | (string & {});

export interface LLMMessageIn {
  role: LLMRole;
  content: string;
}

export interface LLMGenerateIn {
  messages: LLMMessageIn[];
  temperature?: number;
  max_tokens?: number;
  provider?: string | null;
  config?: Record<string, unknown>;
  extra?: Record<string, unknown> | null;
}

export interface LLMGenerateOut {
  text: string;
  provider: string;
  model?: string | null;
  usage?: Record<string, unknown> | null;
}
