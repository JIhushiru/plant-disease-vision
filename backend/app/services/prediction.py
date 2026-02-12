import torch
import torch.nn.functional as F

from app.models.classifier import CLASS_NAMES, DISEASE_INFO, load_model
from app.utils.image_processing import preprocess_image, validate_image

_model = None


def get_model():
    global _model
    if _model is None:
        _model = load_model()
    return _model


def predict(image_bytes: bytes) -> dict:
    valid, message = validate_image(image_bytes)
    if not valid:
        return {"success": False, "error": message}

    model = get_model()
    if model is None:
        return {
            "success": False,
            "error": (
                "Model not loaded. Please train a model first or place a "
                "trained model file at the configured model path."
            ),
        }

    tensor = preprocess_image(image_bytes)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = F.softmax(outputs, dim=1)

    probs = probabilities.squeeze().cpu().numpy()

    top_k = 5
    top_indices = probs.argsort()[::-1][:top_k]

    predictions = []
    for idx in top_indices:
        class_name = CLASS_NAMES[idx]
        confidence = float(probs[idx])
        plant, _, condition = class_name.partition(" — ")
        is_healthy = condition.lower() == "healthy"
        info = DISEASE_INFO.get(class_name, {})

        predictions.append(
            {
                "class_name": class_name,
                "plant": plant,
                "condition": condition,
                "confidence": round(confidence * 100, 2),
                "is_healthy": is_healthy,
                "info": {
                    "cause": info.get("cause", "Unknown"),
                    "symptoms": info.get("symptoms", "No information available."),
                    "treatment": info.get("treatment", "No information available."),
                },
            }
        )

    top = predictions[0]
    return {
        "success": True,
        "prediction": top,
        "alternatives": predictions[1:],
    }
