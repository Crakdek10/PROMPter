export type ProviderType = "stt" | "llm";
export type ProviderStatus = "ready" | "skeleton" | "disabled" | "error";

export interface ProviderListItem {
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  description?: string;
}

export interface ProviderListResponse {
  items: ProviderListItem[];
}
