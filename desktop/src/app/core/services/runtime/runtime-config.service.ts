import { Injectable, computed, inject } from "@angular/core";
import { SettingsStore } from "../../stores/settings.store";

@Injectable({ providedIn: "root" })
export class RuntimeConfigService {
  private readonly settings = inject(SettingsStore);

  readonly apiBaseUrl = computed(() => this.settings.settings().runtime.apiBaseUrl);
  readonly wsBaseUrl = computed(() => this.settings.settings().runtime.wsBaseUrl);
}
