import {Component, inject} from '@angular/core';
import {ElectronService} from '../../../core/services/electron/electron.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-title-bar',
  imports: [],
  templateUrl: './title-bar.html',
  styleUrl: './title-bar.css',
})
export class TitleBar {
  private electron = inject(ElectronService);
  private location = inject(Location); // <--- Inyección

  // Navegación
  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }

  // Ventana
  minimize() { this.electron.minimize(); }
  maximize() { this.electron.maximize(); }
  close() { this.electron.close(); }
}
