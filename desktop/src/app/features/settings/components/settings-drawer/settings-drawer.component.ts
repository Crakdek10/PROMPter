import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { SettingsSectionComponent } from '../settings-section/settings-section.component';
import { SettingsSoundComponent } from '../settings-sound/settings-sound.component';
import { SettingsTransparencyComponent } from '../settings-transparency/settings-transparency.component';
import { SettingsExtrasComponent } from '../settings-extras/settings-extras.component';

@Component({
  selector: 'app-settings-drawer',
  standalone: true,
  imports: [
    SettingsSectionComponent,
    SettingsSoundComponent,
    SettingsTransparencyComponent,
    SettingsExtrasComponent,
  ],
  templateUrl: './settings-drawer.component.html',
})
export class SettingsDrawerComponent {
  @Input() collapsed = false;
  @Input() preview = false;
  @Output() toggleCollapsed = new EventEmitter<void>();

  // estado accordion
  readonly openSound = signal(true);
  readonly openTransparency = signal(true);
  readonly openExtras = signal(true);
}
