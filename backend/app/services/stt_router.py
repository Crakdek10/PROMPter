from __future__ import annotations
from typing import Any, Optional
from app.services.session_store import SessionStore
from app.utils.ws_protocol import b64_to_bytes

class STTRouter:
    def __init__(self, store: SessionStore) -> None:
        self.store = store

    def handle(self, msg: dict[str, Any], current_session_id: Optional[str]) -> tuple[Optional[str], list[dict[str, Any]], bool]:
        msg_type = msg.get("type")

        if msg_type == "start":
            return self._handle_start(msg)

        if msg_type == "audio":
            return self._handle_audio(msg, current_session_id)

        if msg_type == "stop":
            return self._handle_stop(current_session_id)

        # Unknown
        sid = current_session_id or ""
        return sid, [{"type": "error", "message": "Unknown message type", "session_id": sid}], False

    def _handle_start(self, msg: dict[str, Any]) -> tuple[Optional[str], list[dict[str, Any]], bool]:
        session_id = msg.get("session_id")
        if not session_id:
            return None, [{"type": "error", "message": "Missing session_id"}], False

        config = msg.get("config")
        if config is None:
            config = {}
        if not isinstance(config, dict):
            return None, [{"type": "error", "message": "Invalid config (must be object)"}], False

        self.store.create(session_id=session_id, config=config)
        return session_id, [{"type": "ready", "session_id": session_id}], False

    def _handle_audio(self, msg: dict[str, Any], current_session_id: Optional[str]) -> tuple[Optional[str], list[dict[str, Any]], bool]:
        if not current_session_id:
            return None, [{"type": "error", "message": "Send 'start' first"}], False

        fmt = msg.get("format")
        sr = msg.get("sample_rate")
        data = msg.get("data")

        if fmt != "pcm16":
            return current_session_id, [{"type": "error", "message": "Only format=pcm16 supported", "session_id": current_session_id}], False
        if not isinstance(sr, int) or sr <= 0:
            return current_session_id, [{"type": "error", "message": "Invalid sample_rate", "session_id": current_session_id}], False
        if not isinstance(data, str) or not data:
            return current_session_id, [{"type": "error", "message": "Missing audio data", "session_id": current_session_id}], False

        try:
            _audio_bytes = b64_to_bytes(data)
        except ValueError as e:
            return current_session_id, [{"type": "error", "message": str(e), "session_id": current_session_id}], False

        chunks = self.store.inc_audio_count(current_session_id)

        out: list[dict[str, Any]] = [
            {"type": "partial", "session_id": current_session_id, "text": f"(mock) escuchando... chunk={chunks}"}
        ]

        if chunks % 3 == 0:
            out.append({"type": "final", "session_id": current_session_id, "text": f"(mock) transcripción final #{chunks//3}"})

        return current_session_id, out, False

    def _handle_stop(self, current_session_id: Optional[str]) -> tuple[Optional[str], list[dict[str, Any]], bool]:
        if current_session_id:
            out = [{"type": "final", "session_id": current_session_id, "text": "(mock) stop"}]
            self.store.close(current_session_id)
            return current_session_id, out, True

        return None, [], True