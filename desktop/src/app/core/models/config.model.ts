export interface STTConfig {
  provider_id: string;
  language: string;
  sample_rate: number;
  format: "pcm16";
  // futuro: endpoint_url?: string;
}

export interface LLMConfig {
  provider_id: string;
  model: string;
  temperature: number;
  max_tokens: number;
  system_prompt?: string | null;
}
