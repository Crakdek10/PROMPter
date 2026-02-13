import { Component, computed, inject } from '@angular/core';
import { SettingsStore } from '../../../../core/stores/settings.store';

@Component({
  selector: 'app-settings-extras',
  standalone: true,
  templateUrl: './settings-extras.component.html',
})
export class SettingsExtrasComponent {
  private readonly settings = inject(SettingsStore);

  readonly enabled = computed(() =>
    this.settings.settings().sttUi.detectQuestionsAutomatically
  );

  readonly minSilenceSeconds = computed(() =>
    Math.round(this.settings.settings().sttUi.minSilenceMs / 1000)
  );

  toggleDetect(value: boolean) {
    this.settings.updateDeep(s => {
      s.sttUi.detectQuestionsAutomatically = value;
    });
  }

  setMinSilenceSeconds(value: string) {
    let sec = Number(value);
    if (!Number.isFinite(sec)) sec = 1;
    sec = Math.max(1, Math.min(10, Math.floor(sec)));
    this.settings.updateDeep(s => {
      s.sttUi.minSilenceMs = sec * 1000;
    });
  }

}
