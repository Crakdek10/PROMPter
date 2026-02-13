import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ProviderListResponse } from "../../models/provider.model";
import { RuntimeConfigService } from "../runtime/runtime-config.service";
import { timeout } from "rxjs/operators";


@Injectable({ providedIn: "root" })
export class ProvidersClient {
  private readonly http = inject(HttpClient);
  private readonly runtime = inject(RuntimeConfigService);

  listSttProviders(): Observable<ProviderListResponse> {
    const base = (this.runtime.apiBaseUrl() || "http://127.0.0.1:8000").replace(/\/+$/, "");
    return this.http
      .get<ProviderListResponse>(`${base}/providers/stt`)
      .pipe(timeout(8000));
  }

  listLlmProviders(): Observable<ProviderListResponse> {
    const base = (this.runtime.apiBaseUrl() || "http://127.0.0.1:8000").replace(/\/+$/, "");
    return this.http
      .get<ProviderListResponse>(`${base}/providers/llm`)
      .pipe(timeout(8000));
  }

}
