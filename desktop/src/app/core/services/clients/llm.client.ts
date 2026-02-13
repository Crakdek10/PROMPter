import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {Observable, timeout} from "rxjs";
import { LLMGenerateIn, LLMGenerateOut } from "../../models/llm.model";
import { RuntimeConfigService } from "../runtime/runtime-config.service";

@Injectable({ providedIn: "root" })
export class LlmClient {
  private readonly http = inject(HttpClient);
  private readonly runtime = inject(RuntimeConfigService);

  generate(payload: LLMGenerateIn): Observable<LLMGenerateOut> {
    const safePayload: LLMGenerateIn = {
      messages: payload.messages,
      temperature: payload.temperature ?? 0.7,
      max_tokens: payload.max_tokens ?? 256,
      provider: payload.provider ?? null,
      config: payload.config ?? {},
      extra: payload.extra ?? null,
    };

    const base = (this.runtime.apiBaseUrl() || "http://127.0.0.1:8000").replace(/\/+$/, "");

    return this.http
      .post<LLMGenerateOut>(`${base}/llm/generate`, safePayload)
      .pipe(timeout(15000));

  }
}
