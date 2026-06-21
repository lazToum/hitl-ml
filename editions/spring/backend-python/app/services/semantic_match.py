from difflib import SequenceMatcher
import re


def score(expected: str, submitted: str) -> float:
    """Lightweight semantic-ish similarity for local runtime. Returns 0–1."""
    left = expected.strip().lower()
    right = submitted.strip().lower()
    if not left or not right:
        return 0.0

    left_tokens = set(re.findall(r"\w+", left))
    right_tokens = set(re.findall(r"\w+", right))
    if not left_tokens or not right_tokens:
        token_overlap = 0.0
    else:
        token_overlap = len(left_tokens & right_tokens) / len(left_tokens | right_tokens)

    text_similarity = SequenceMatcher(None, left, right).ratio()
    return round((0.6 * token_overlap) + (0.4 * text_similarity), 4)
