import logging
from math import log

import numpy as np

from app.config import settings

logger = logging.getLogger(__name__)

REJECTION_MESSAGE = (
    "This image does not appear to contain a recognizable plant leaf. "
    "Please upload a clear photo of a plant leaf for disease diagnosis."
)


def check_plant_validity(probs: np.ndarray) -> tuple[bool, str | None]:
    """Check whether the softmax distribution looks like a real plant image.

    Uses three complementary metrics. If 2+ flag the input, reject it.
    """
    sorted_probs = np.sort(probs)[::-1]

    max_conf = float(sorted_probs[0])
    margin = float(sorted_probs[0] - sorted_probs[1])
    entropy = _normalized_entropy(probs)

    flags = 0
    if max_conf < settings.guard_confidence_threshold:
        flags += 1
    if entropy > settings.guard_entropy_threshold:
        flags += 1
    if margin < settings.guard_margin_threshold:
        flags += 1

    logger.debug(
        "Plant guard: max_conf=%.3f, entropy=%.3f, margin=%.3f, flags=%d",
        max_conf, entropy, margin, flags,
    )

    if flags >= 2:
        return False, REJECTION_MESSAGE
    return True, None


def _normalized_entropy(probs: np.ndarray) -> float:
    """Shannon entropy normalized to [0, 1] for the given number of classes."""
    probs = probs[probs > 0]
    raw = -float(np.sum(probs * np.log(probs)))
    max_entropy = log(len(probs)) if len(probs) > 1 else 1.0
    return raw / max_entropy
