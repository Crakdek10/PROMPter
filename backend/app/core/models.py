from __future__ import annotations
from enum import Enum
from typing import Any, Literal, Optional
from pydantic import BaseModel, Field

class ProviderType(str, Enum):
    stt = "stt"
    llm = "llm"

class TranscriptKind(str, Enum):
    partial = "partial"
    final = "final"

class STTConfig(BaseModel):
    provider_id: str = Field(default="cloud_stub", description="ID del provider STT a usar")
    language: str = Field(default="es", description="Idioma esperado del STT (ej: es, en)")
    sample_rate: int = Field(default=16000, ge=8000, le=48000, description="Hz, típico 16000")
    format: Literal["pcm16"] = Field(default="pcm16", description="Formato de audio esperado")
    # espacio para luego:
    # endpoint_url: Optional[str] = None

class LLMConfig(BaseModel):
    provider_id: str = Field(default="openai_compat", description="ID del provider LLM a usar")
    model: str = Field(default="gpt-4o-mini", description="Nombre del modelo (según provider)")
    temperature: float = Field(default=0.2, ge=0.0, le=2.0)
    max_tokens: int = Field(default=256, ge=1, le=8192)
    system_prompt: Optional[str] = Field(default=None)

class ProviderSpec(BaseModel):
    id: str
    name: str
    type: ProviderType
    description: Optional[str] = None
    capabilities: dict[str, Any] = Field(default_factory=dict)

class TranscriptChunk(BaseModel):
    kind: TranscriptKind
    text: str
    session_id: Optional[str] = None
    is_final: bool = Field(default=False, description="Compat simple para UI")
    # para futuro:
    start_ms: Optional[int] = None
    end_ms: Optional[int] = None

    @staticmethod
    def partial(text: str, session_id: Optional[str] = None) -> "TranscriptChunk":
        return TranscriptChunk(kind=TranscriptKind.partial, text=text, session_id=session_id, is_final=False)

    @staticmethod
    def final(text: str, session_id: Optional[str] = None) -> "TranscriptChunk":
        return TranscriptChunk(kind=TranscriptKind.final, text=text, session_id=session_id, is_final=True)