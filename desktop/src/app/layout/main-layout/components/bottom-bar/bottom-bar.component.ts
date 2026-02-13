import { Component, inject } from '@angular/core';
import { SessionStore } from '../../../../core/stores/session.store';
// import { AudioStore } from ... (Cuando lo tengas)

@Component({
  selector: 'app-bottom-bar',
  standalone: true,
  imports: [],
  templateUrl: './bottom-bar.component.html'
})
export class BottomBarComponent {
  readonly sessionStore = inject(SessionStore);
  // readonly audioStore = inject(AudioStore);

  toggleRecording() {
    console.log('Botón presionado. Estado actual:', this.sessionStore.status());

    if (this.sessionStore.status() === 'idle') {
      // 1. Aquí iniciarías el audio: this.audioStore.startCapture();

      // 2. Cambiamos estado a 'recording' -> Esto quita el Ojo y pone el Chat
      this.sessionStore.startSession();
    } else {
      // Detener
      // this.audioStore.stopCapture();
      this.sessionStore.stopSession(); // Vuelve al Ojo
    }
  }
}
