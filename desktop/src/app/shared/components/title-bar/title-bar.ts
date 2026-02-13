import { Component, ElementRef, HostListener, ViewChild, inject, signal } from '@angular/core';
import { ElectronService } from '../../../core/services/electron/electron.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-title-bar',
  standalone: true,
  imports: [],
  templateUrl: './title-bar.html',
  styleUrl: './title-bar.css',
})
export class TitleBar {
  private electron = inject(ElectronService);
  private location = inject(Location);
  private router = inject(Router);

  @ViewChild('profileWrap', { static: true })
  profileWrap!: ElementRef<HTMLElement>;

  readonly profileOpen = signal(false);

  goBack() {
    this.location.back();
  }

  goForward() {
    this.location.forward();
  }

  openGithub() {
    window.open('https://github.com/Crakdek10/PROMPTer', '_blank');
  }

  openNewWindow() {
    console.log('Abrir popup...');
  }

  toggleProfileMenu(ev: MouseEvent) {
    ev.stopPropagation();
    this.profileOpen.set(!this.profileOpen());
  }

  closeProfileMenu() {
    this.profileOpen.set(false);
  }

  goToSettings() {
    this.closeProfileMenu();
    this.router.navigateByUrl('/settings');
  }

  // click afuera -> cerrar
  @HostListener('document:mousedown', ['$event'])
  onDocMouseDown(ev: MouseEvent) {
    if (!this.profileOpen()) return;

    const wrap = this.profileWrap?.nativeElement;
    const target = ev.target as Node | null;

    if (wrap && target && !wrap.contains(target)) {
      this.closeProfileMenu();
    }
  }

  // ESC -> cerrar
  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && this.profileOpen()) {
      this.closeProfileMenu();
    }
  }

  minimize() { this.electron.minimize(); }
  maximize() { this.electron.maximize(); }
  close() { this.electron.close(); }
}
