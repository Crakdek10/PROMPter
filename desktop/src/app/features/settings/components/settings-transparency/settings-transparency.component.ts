import { Component, computed, inject } from '@angular/core';
import { SettingsStore } from '../../../../core/stores/settings.store';

@Component({
  selector: 'app-settings-transparency',
  standalone: true,
  templateUrl: './settings-transparency.component.html',
})
export class SettingsTransparencyComponent {
  private readonly settings = inject(SettingsStore);

  readonly percent = computed(() =>
    Math.round(this.settings.settings().general.windowOpacity * 100)
  );

  onChanged(value: string) {
    const pct = Number(value);
    const v01 = Math.max(0.3, Math.min(1, pct / 100));

    this.settings.updateDeep(s => {
      s.general.windowOpacity = v01;
    });

    // aplica a ventana electron
    window.prompter.setWindowOpacity(v01);
  }
}
