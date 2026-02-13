import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class AppOpacityService {
  apply(opacity01: number): void {
    const v = Math.max(0.2, Math.min(1, opacity01));
    document.documentElement.style.setProperty("--app-opacity", String(v));
  }
}
