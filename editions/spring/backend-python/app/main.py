import secrets

from fastapi import Depends, FastAPI, Header, HTTPException

from app.config import settings
from app.routes.ai import router as ai_router

app = FastAPI(
    title="Treasure Hunt — AI Service",
    description="LLM and ML utilities called by the Rust game API.",
    version="0.1.0",
)

# No CORS middleware: browsers should never talk to this service directly —
# only the Rust game API calls it, server to server.


async def require_sidecar_token(x_sidecar_token: str | None = Header(default=None)) -> None:
    """Shared-secret guard for the sidecar endpoints.

    Fails closed: until SIDECAR_TOKEN is configured, every call is rejected.
    The Rust API sends the same value as X-Sidecar-Token.
    """
    expected = settings.sidecar_token
    if not expected or not x_sidecar_token or not secrets.compare_digest(x_sidecar_token, expected):
        raise HTTPException(status_code=401, detail="Unauthorized")


app.include_router(ai_router, dependencies=[Depends(require_sidecar_token)])


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
