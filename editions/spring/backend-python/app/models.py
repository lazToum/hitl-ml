from pydantic import BaseModel, Field
from uuid import UUID


class SemanticMatchRequest(BaseModel):
    expected:  str
    submitted: str


class SemanticMatchResponse(BaseModel):
    score: float


class PhotoVerifyRequest(BaseModel):
    description: str
    photo_b64:   str


class PhotoVerifyResponse(BaseModel):
    confidence: float


class GenerateClueRequest(BaseModel):
    description: str
    answer:      str
    difficulty:  int = Field(ge=1, le=5, default=3)
    num_hints:   int = Field(ge=1, le=5, default=3)


class GenerateClueResponse(BaseModel):
    title: str
    body:  str
    hints: list[str]


class DifficultyRequest(BaseModel):
    clue_body: str


class DifficultyResponse(BaseModel):
    score:     int  # 1–5
    reasoning: str


class AdaptiveHintRequest(BaseModel):
    clue_body: str
    answer:    str
    attempts:  list[str]


class AdaptiveHintResponse(BaseModel):
    hint: str


class AnalyzeSessionRequest(BaseModel):
    session_id: UUID
    events:     list[dict]


class AnalyzeSessionResponse(BaseModel):
    report: str
