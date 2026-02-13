import { Injectable, computed, inject } from "@angular/core";
import { SettingsStore } from "./settings.store";
import { ChatAuthor, AudioInputMode } from "../models/settings.model";

@Injectable({ providedIn: "root" })
export class AppStore {
  private readonly settingsStore = inject(SettingsStore);

  readonly settings = this.settingsStore.settings;

  readonly inputAuthor = computed<ChatAuthor>(() => {
    const mode = this.settings().sttUi.inputMode;
    return mode === "mic" ? "user" : "system";
  });

  setDetectQuestions(v: boolean) {
    this.settingsStore.updateDeep((s) => {
      s.sttUi.detectQuestionsAutomatically = v;
    });
  }

  setMinSilenceSeconds(vSeconds: number) {
    this.settingsStore.updateDeep((s) => {
      s.sttUi.minSilenceMs = Math.max(0, Math.floor(vSeconds * 1000));
    });
  }

  setInputMode(mode: AudioInputMode) {
    this.settingsStore.updateDeep((s) => {
      s.sttUi.inputMode = mode;
    });
  }
}
