from pydantic import BaseModel, Field
from uuid import UUID


class SemanticMatchRequest(BaseModel):
    expected:  str = Field(max_length=1024)
    submitted: str = Field(max_length=1024)


class SemanticMatchResponse(BaseModel):
    score: float


class PhotoVerifyRequest(BaseModel):
    description: str = Field(max_length=1024)
    # base64 inflates ~4/3×, so 7 MB base64 ≈ a 5 MB photo
    photo_b64:   str = Field(max_length=7_000_000)


class PhotoVerifyResponse(BaseModel):
    confidence: float = Field(ge=0, le=1)


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
    score:     int = Field(ge=1, le=5)
    reasoning: str


class AdaptiveHintRequest(BaseModel):
    clue_body: str
    answer:    str
    attempts:  list[str]


class AdaptiveHintResponse(BaseModel):
    hint: str


class AnalyzeSessionRequest(BaseModel):
    session_id: UUID
    events:     list[dict] = Field(max_length=10000)


class AnalyzeSessionResponse(BaseModel):
    report: str
