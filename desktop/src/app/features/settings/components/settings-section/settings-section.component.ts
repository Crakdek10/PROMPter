import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-settings-section',
  standalone: true,
  templateUrl: './settings-section.component.html',
})
export class SettingsSectionComponent {
  @Input({ required: true }) title!: string;
  @Input() open = true;
  @Input() disabled = false;

  @Output() toggle = new EventEmitter<void>();

  onToggle() {
    if (!this.disabled) this.toggle.emit();
  }
}
