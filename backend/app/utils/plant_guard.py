import logging
from io import BytesIO

import torch
from PIL import Image
from transformers import CLIPModel, CLIPProcessor

from app.config import settings

logger = logging.getLogger(__name__)

REJECTION_MESSAGE = (
    "This image does not appear to contain a recognizable plant leaf. "
    "Please upload a clear photo of a plant leaf for disease diagnosis."
)

# Labels for zero-shot classification.
# Plant-positive labels come first; everything else is negative.
PLANT_LABELS = [
    "a photo of a plant leaf",
    "a photo of a diseased plant leaf",
    "a photo of a healthy green leaf",
]
NON_PLANT_LABELS = [
    "a photo of a dog",
    "a photo of a cat",
    "a photo of a person",
    "a photo of a car",
    "a photo of a building",
    "a photo of food on a plate",
    "a photo of an electronic device",
    "a photo of furniture",
    "a photo of a landscape without plants",
    "a photo of text or a document",
]
ALL_LABELS = PLANT_LABELS + NON_PLANT_LABELS

_clip_model = None
_clip_processor = None


def _get_clip():
    """Load CLIP model and processor (lazy, singleton)."""
    global _clip_model, _clip_processor
    if _clip_model is None:
        logger.info("Loading CLIP model: %s", settings.guard_clip_model)
        _clip_model = CLIPModel.from_pretrained(settings.guard_clip_model)
        _clip_processor = CLIPProcessor.from_pretrained(settings.guard_clip_model)
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        _clip_model.to(device)
        _clip_model.eval()
        logger.info("CLIP guard loaded on %s", device)
    return _clip_model, _clip_processor


def check_plant_validity(image_bytes: bytes) -> tuple[bool, str | None]:
    """Use CLIP zero-shot classification to verify the image contains a plant leaf.

    Returns:
        (True, None) if a plant leaf is detected, (False, reason) otherwise.
    """
    model, processor = _get_clip()
    device = next(model.parameters()).device

    image = Image.open(BytesIO(image_bytes)).convert("RGB")

    inputs = processor(text=ALL_LABELS, images=image, return_tensors="pt", padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits_per_image.squeeze()
        probs = logits.softmax(dim=0)

    plant_prob = float(probs[: len(PLANT_LABELS)].sum())

    logger.debug(
        "CLIP guard: plant_prob=%.3f, top_label=%s (%.3f)",
        plant_prob,
        ALL_LABELS[probs.argmax().item()],
        float(probs.max()),
    )

    if plant_prob < settings.guard_plant_threshold:
        return False, REJECTION_MESSAGE

    return True, None
