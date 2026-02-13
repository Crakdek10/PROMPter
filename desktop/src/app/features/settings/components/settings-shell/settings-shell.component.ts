import { Component, signal } from '@angular/core';
import { SettingsNavComponent, SettingsTab } from '../settings-nav/settings-nav.component';
import { SettingsGeneralPanelComponent } from '../../panels/settings-general-panel/settings-general-panel.component';
import { SettingsConnectionsPanelComponent } from '../../panels/settings-connections-panel/settings-connections-panel.component';

@Component({
  selector: 'app-settings-shell',
  standalone: true,
  imports: [
    SettingsNavComponent,
    SettingsGeneralPanelComponent,
    SettingsConnectionsPanelComponent,
  ],
  templateUrl: './settings-shell.component.html',
})
export class SettingsShellComponent {
  readonly activeTab = signal<SettingsTab>('general');

  setTab(tab: SettingsTab) {
    this.activeTab.set(tab);
  }
}
