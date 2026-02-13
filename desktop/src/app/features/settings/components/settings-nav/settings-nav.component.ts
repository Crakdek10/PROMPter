import { Component, EventEmitter, Input, Output } from '@angular/core';

export type SettingsTab =
  | 'general'
  | 'connections'
  | 'themes'
  | 'hotkeys'
  | 'language'
  | 'advanced';

@Component({
  selector: 'app-settings-nav',
  standalone: true,
  templateUrl: './settings-nav.component.html',
})
export class SettingsNavComponent {
  @Input({ required: true }) active!: SettingsTab;
  @Output() selectTab = new EventEmitter<SettingsTab>();

  pick(tab: SettingsTab) {
    this.selectTab.emit(tab);
  }
}
