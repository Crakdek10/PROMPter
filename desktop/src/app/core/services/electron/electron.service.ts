import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  isElectron = signal(false);

  constructor() {
    if (this.isElectronApp()) {
      this.isElectron.set(true);
    }
  }

  private isElectronApp(): boolean {
    return !!(window && window.prompter);
  }

  // --- MÉTODOS DE VENTANA ---
  minimize() {
    if (this.isElectron()) window.prompter.minimize();
  }

  maximize() {
    if (this.isElectron()) window.prompter.maximize();
  }

  close() {
    if (this.isElectron()) window.prompter.close();
  }
}
