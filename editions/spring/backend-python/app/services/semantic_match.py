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
    token_overlap = _fuzzy_jaccard(left_tokens, right_tokens)

    text_similarity = SequenceMatcher(None, left, right).ratio()
    return round((0.6 * token_overlap) + (0.4 * text_similarity), 4)


def _fuzzy_jaccard(left_tokens: set[str], right_tokens: set[str]) -> float:
    """Jaccard index where a near-identical token pair (ratio ≥ 0.85) counts as
    a match, so a single typo doesn't destroy a token's contribution."""
    if not left_tokens or not right_tokens:
        return 0.0
    matched_right: set[str] = set()
    matches = 0
    for lt in left_tokens:
        best_ratio, best_token = 0.0, None
        for rt in right_tokens - matched_right:
            r = SequenceMatcher(None, lt, rt).ratio()
            if r > best_ratio:
                best_ratio, best_token = r, rt
        if best_token is not None and best_ratio >= 0.85:
            matched_right.add(best_token)
            matches += 1
    # fuzzy matches collapse the union, just as exact |A ∩ B| would
    union = len(left_tokens) + len(right_tokens) - matches
    return matches / union
