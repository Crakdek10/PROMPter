from __future__ import annotations
from typing import Any, Optional
import httpx
from app.core.secrets import get_secret
from app.providers.llm.base import LLMGenerateRequest, LLMGenerateResponse, LLMProvider


class GeminiLLMProvider(LLMProvider):
    
    name = "gemini"

    def _pick_model(self, config: dict[str, Any]) -> str:
        model = config.get("model") or "gemini-1.5-flash"
        if not isinstance(model, str) or not model.strip():
            return "gemini-1.5-flash"
        return model.strip()

    def _pick_api_key(self, config: dict[str, Any]) -> str:
        api_key = config.get("api_key")
        if api_key is not None and not isinstance(api_key, str):
            raise ValueError("gemini config.api_key must be string")

        api_key = (api_key or "").strip()
        if api_key:
            return api_key

        return (get_secret("GEMINI_API_KEY", required=False) or "").strip()

    def _pick_timeout_s(self, config: dict[str, Any]) -> float:
        t = config.get("timeout_s", 30)
        if not isinstance(t, (int, float)) or t <= 0:
            return 30.0
        return float(t)

    def _extract_system_prompt(self, config: dict[str, Any], req: LLMGenerateRequest) -> str:
        sys = config.get("system_prompt")
        if isinstance(sys, str) and sys.strip():
            return sys.strip()

        for m in req.messages:
            if (m.role or "").lower() == "system" and (m.content or "").strip():
                return m.content.strip()

        return ""

    def _to_gemini_contents(self, req: LLMGenerateRequest) -> list[dict[str, Any]]:
        
        contents: list[dict[str, Any]] = []
        for m in req.messages:
            role = (m.role or "").lower().strip()
            if role == "system":
                continue
            gem_role = "user" if role == "user" else "model"
            text = (m.content or "").strip()
            if not text:
                continue
            contents.append({"role": gem_role, "parts": [{"text": text}]})
        return contents

    async def generate(self, req: LLMGenerateRequest, config: dict[str, Any]) -> LLMGenerateResponse:
        api_key = self._pick_api_key(config)
        if not api_key:
            raise ValueError("gemini requires config.api_key (or env GEMINI_API_KEY)")

        model = self._pick_model(config)
        timeout_s = self._pick_timeout_s(config)

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        params = {"key": api_key}

        system_prompt = self._extract_system_prompt(config, req)
        contents = self._to_gemini_contents(req)

        if not contents:
            contents = [{"role": "user", "parts": [{"text": "Hola"}]}]

        payload: dict[str, Any] = {
            "contents": contents,
            "generationConfig": {
                "temperature": req.temperature,
                "maxOutputTokens": req.max_tokens,
            },
        }

        if system_prompt:
            payload["systemInstruction"] = {"parts": [{"text": system_prompt}]}

        if req.extra and isinstance(req.extra, dict):
            payload.update(req.extra)

        async with httpx.AsyncClient(timeout=timeout_s) as client:
            r = await client.post(url, params=params, json=payload)
            if r.status_code >= 400:
                raise ValueError(f"gemini http {r.status_code}: {r.text}")
            data = r.json()

        text: Optional[str] = None
        try:
            parts = data["candidates"][0]["content"]["parts"]
            text = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
        except Exception:
            text = None

        if not text or not text.strip():
            raise ValueError("gemini: invalid response format (missing candidates[0].content.parts[].text)")

        usage = data.get("usageMetadata")
        return LLMGenerateResponse(text=text.strip(), provider=self.name, model=model, usage=usage)
