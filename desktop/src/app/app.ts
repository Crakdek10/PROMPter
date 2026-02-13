import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SettingsStore} from './core/stores/settings.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('prompter');

  private readonly settingsStore = inject(SettingsStore);

  constructor() {
    this.settingsStore.init();
  }
}
