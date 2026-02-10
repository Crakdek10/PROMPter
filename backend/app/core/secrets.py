from __future__ import annotations
import os
from typing import Optional
from app.core.errors import ConfigError

def get_secret(name: str, *, required: bool = True, default: Optional[str] = None) -> Optional[str]:
    value = os.getenv(name)

    if value is not None:
        value = value.strip()

    if value:
        return value

    if required:
        raise ConfigError(
            f"Missing required secret '{name}'. "
            f"Set it in your environment or in backend/.env (local)."
        )

    return default