import { Injectable } from "@angular/core";
import { ThemeTokens } from "../../models/settings.model";

@Injectable({ providedIn: "root" })
export class ThemeService {
  applyTokens(t: ThemeTokens): void {
    const r = document.documentElement;

    r.style.setProperty("--bg-app", t.bgApp);
    r.style.setProperty("--bg-surface", t.bgSurface);
    r.style.setProperty("--bg-surface-hover", t.bgSurfaceHover);

    r.style.setProperty("--primary", t.primary);
    r.style.setProperty("--primary-fg", t.primaryFg);
    r.style.setProperty("--secondary", t.secondary);
    r.style.setProperty("--accent", t.accent);

    r.style.setProperty("--text-main", t.textMain);
    r.style.setProperty("--text-muted", t.textMuted);
    r.style.setProperty("--text-inverse", t.textInverse);

    r.style.setProperty("--border-default", t.borderDefault);
    r.style.setProperty("--border-active", t.borderActive);

    r.style.setProperty("--color-error", t.colorError);
    r.style.setProperty("--color-success", t.colorSuccess);
  }

  applyFonts(ui: string, tele: string): void {
    const r = document.documentElement;
    r.style.setProperty("--font-ui", ui);
    r.style.setProperty("--font-teleprompter", tele);
  }
}
