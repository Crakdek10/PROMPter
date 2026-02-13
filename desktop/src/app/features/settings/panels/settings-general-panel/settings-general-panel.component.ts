import { Component, computed, inject } from '@angular/core';
import { SettingsStore } from '../../../../core/stores/settings.store';
import { SettingsTransparencyComponent } from '../../components/settings-transparency/settings-transparency.component';

@Component({
  selector: 'app-settings-general-panel',
  standalone: true,
  imports: [SettingsTransparencyComponent],
  templateUrl: './settings-general-panel.component.html',
})
export class SettingsGeneralPanelComponent {
  private readonly settingsStore = inject(SettingsStore);

  readonly s = computed(() => this.settingsStore.settings());

  toggleStartWithWindows(v: boolean) {
    this.settingsStore.updateDeep(s => { s.general.startWithWindows = v; });
  }

  toggleMinimizeToTray(v: boolean) {
    this.settingsStore.updateDeep(s => { s.general.minimizeToTray = v; });
  }

  toggleAlwaysOnTop(v: boolean) {
    this.settingsStore.updateDeep(s => { s.general.alwaysOnTop = v; });
  }

  toggleRememberWindows(v: boolean) {
    this.settingsStore.updateDeep(s => { s.general.rememberWindowPositions = v; });
  }

  toggleDockTopCenter(v: boolean) {
    this.settingsStore.updateDeep(s => { s.general.openTeleprompterDockedTopCenter = v; });
  }

  toggleAutoScrollTranscript(v: boolean) {
    this.settingsStore.updateDeep(s => { s.sttUi.autoScrollTranscript = v; });
  }
}
