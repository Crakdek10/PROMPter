import { Injectable, inject } from "@angular/core";
import { SettingsStore } from "../stores/settings.store";
import { SessionStore } from "../stores/session.store";
import { ChatStore } from "../stores/chat.store";
import { pcm16ToBase64 } from "../utils/audio-b64";
import { filter, firstValueFrom } from "rxjs";
import { AudioCaptureService } from "../services/audio/audio-capture.service";
import { SttWsClient } from "../services/clients/stt.ws.client";

@Injectable({ providedIn: "root" })
export class SessionController {
  private settings = inject(SettingsStore);
  private session = inject(SessionStore);
  private chat = inject(ChatStore);
  private audio = inject(AudioCaptureService);
  private sttWs = inject(SttWsClient);

  private sessionId: string | null = null;
  private streamingMsgId: string | null = null;
  private audioRunning = false;

  constructor() {
    this.sttWs.messages$.subscribe(m => this.onSttMsg(m));
  }

  togglePlay() {
    if (this.session.status() === "recording") return this.stop();
    return this.start();
  }

  async start() {
    const s = this.settings.settings();

    this.sessionId = crypto.randomUUID?.() ?? String(Date.now());
    this.audioRunning = false;
    this.streamingMsgId = null;

    this.session.startSession();

    // 1) connect WS
    this.sttWs.connect();

    // 2) esperar connected
    await firstValueFrom(this.sttWs.status$.pipe(filter(x => x === "connected")));

    // 3) mandar start
    const sttConfig: Record<string, unknown> = {
      provider: s.selectedSttProviderId,
      sample_rate: s.stt.sampleRate,
      format: s.stt.format,
      language: s.stt.language ?? "en",
    };

    this.sttWs.start(this.sessionId, sttConfig);

  }

  stop() {
    if (this.session.status() !== "recording") return;
    this.session.setProcessing();

    try { this.audio.stop(); } catch {}
    try { this.sttWs.stop(); } catch {}
    // el server cerrará el ws por protocolo, o queda abierto
  }

  private async startAudioIfNeeded(sampleRate: number) {
    if (this.audioRunning) return;
    this.audioRunning = true;

    await this.audio.start((pcm16, sr) => {
      if (!this.sessionId) return;
      this.sttWs.audio("pcm16", sr, pcm16ToBase64(pcm16));
    }, sampleRate);
  }

  private onSttMsg(m: any) {
    // ✅ READY: recién aquí arrancamos audio
    if (m.type === "ready") {
      const s = this.settings.settings();
      this.startAudioIfNeeded(s.stt.sampleRate);
      return;
    }

    if (m.type === "partial") {
      if (!this.streamingMsgId) {
        this.streamingMsgId = this.chat.add("system", m.text); // por ahora simple
      } else {
        this.chat.updateText(this.streamingMsgId, m.text, "streaming");
      }
      return;
    }

    if (m.type === "final") {
      if (!this.streamingMsgId) {
        this.chat.add("system", m.text);
      } else {
        this.chat.updateText(this.streamingMsgId, m.text, "final");
        this.streamingMsgId = null;
      }
      this.audioRunning = false;
      this.session.stopSession();
      return;
    }

    if (m.type === "error") {
      this.chat.add("system", `❌ ${m.message ?? "STT error"}`);
      this.audioRunning = false;
      this.session.stopSession();
    }
  }
}
