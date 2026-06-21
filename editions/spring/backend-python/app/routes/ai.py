import logging

import anyio
import litellm
from fastapi import APIRouter, HTTPException
from app.models import (
    AdaptiveHintRequest, AdaptiveHintResponse,
    AnalyzeSessionRequest, AnalyzeSessionResponse,
    DifficultyRequest, DifficultyResponse,
    GenerateClueRequest, GenerateClueResponse,
    PhotoVerifyRequest, PhotoVerifyResponse,
    SemanticMatchRequest, SemanticMatchResponse,
)
from app.services import (
    adaptive_hint,
    clue_generator,
    difficulty,
    photo_verifier,
    semantic_match,
    session_analyzer,
)

router = APIRouter()

logger = logging.getLogger(__name__)

_PROVIDER_ERRORS = (
    litellm.Timeout,
    litellm.RateLimitError,
    litellm.AuthenticationError,
    litellm.APIConnectionError,
    litellm.APIError,
)


def _map_error(e: Exception) -> HTTPException:
    """Log the real exception, return a generic client-facing error.

    Malformed model output → 502 (bad upstream response);
    provider auth/rate-limit/timeout/connection failures → 503;
    anything else → 500. Internal details never leak to callers.
    """
    logger.exception("AI endpoint failed")
    if isinstance(e, _PROVIDER_ERRORS):
        return HTTPException(status_code=503, detail="LLM provider unavailable — try again later.")
    if isinstance(e, (KeyError, TypeError, ValueError)):
        # includes json.JSONDecodeError and pydantic.ValidationError
        return HTTPException(status_code=502, detail="Upstream model returned an invalid response.")
    return HTTPException(status_code=500, detail="Internal error in AI service.")


@router.post("/semantic-match", response_model=SemanticMatchResponse)
async def semantic_match_route(req: SemanticMatchRequest) -> SemanticMatchResponse:
    try:
        # difflib is synchronous CPU work — keep it off the event loop
        score = await anyio.to_thread.run_sync(semantic_match.score, req.expected, req.submitted)
        return SemanticMatchResponse(score=score)
    except Exception as e:
        raise _map_error(e)


@router.post("/verify-photo", response_model=PhotoVerifyResponse)
async def verify_photo(req: PhotoVerifyRequest) -> PhotoVerifyResponse:
    try:
        confidence = await photo_verifier.verify(req.description, req.photo_b64)
        return PhotoVerifyResponse(confidence=confidence)
    except Exception as e:
        raise _map_error(e)


@router.post("/generate-clue", response_model=GenerateClueResponse)
async def generate_clue(req: GenerateClueRequest) -> GenerateClueResponse:
    try:
        return await clue_generator.generate(req)
    except Exception as e:
        raise _map_error(e)


@router.post("/estimate-difficulty", response_model=DifficultyResponse)
async def estimate_difficulty(req: DifficultyRequest) -> DifficultyResponse:
    try:
        return await difficulty.estimate(req.clue_body)
    except Exception as e:
        raise _map_error(e)


@router.post("/adaptive-hint", response_model=AdaptiveHintResponse)
async def adaptive_hint_route(req: AdaptiveHintRequest) -> AdaptiveHintResponse:
    try:
        hint = await adaptive_hint.generate(req.clue_body, req.answer, req.attempts)
        return AdaptiveHintResponse(hint=hint)
    except Exception as e:
        raise _map_error(e)


@router.post("/analyze-session", response_model=AnalyzeSessionResponse)
async def analyze_session(req: AnalyzeSessionRequest) -> AnalyzeSessionResponse:
    try:
        report = await session_analyzer.analyze(str(req.session_id), req.events)
        return AnalyzeSessionResponse(report=report)
    except Exception as e:
        raise _map_error(e)
