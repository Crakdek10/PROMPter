import { Component, effect, inject } from "@angular/core";
import { SettingsStore } from "../../core/stores/settings.store";
import { ThemeService } from "../../core/services/theme/theme.service";
import {RouterOutlet} from '@angular/router';
import {TitleBar} from '../../shared/components/title-bar/title-bar';

@Component({
  selector: "app-main-layout",
  imports: [RouterOutlet, TitleBar],
  templateUrl: "./main-layout.component.html",
})
export class MainLayoutComponent {
  private readonly settings = inject(SettingsStore);
  private readonly theme = inject(ThemeService);

  constructor() {
    this.settings.init();

    effect(() => {
      const s = this.settings.settings();
      this.theme.applyTokens(s.theme.customTokens);
      this.theme.applyFonts(s.theme.uiFontFamily, s.theme.teleprompterFontFamily);
    });
  }
}
