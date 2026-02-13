import { Component } from '@angular/core';
import {SettingsShellComponent} from '../../components/settings-shell/settings-shell.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    SettingsShellComponent
  ],
  templateUrl: './settings-page.component.html',
})
export class SettingsPageComponent {}
