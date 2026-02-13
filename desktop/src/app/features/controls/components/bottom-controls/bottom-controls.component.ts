import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bottom-controls',
  standalone: true,
  templateUrl: './bottom-controls.component.html',
  host: { class: 'block w-full' },
})
export class BottomControlsComponent {
  /** true cuando está grabando/procesando (no idle) */
  @Input() isRunning = false;

  /** click al play/pause */
  @Output() togglePlay = new EventEmitter<void>();

  /** click stop */
  @Output() stop = new EventEmitter<void>();
}
