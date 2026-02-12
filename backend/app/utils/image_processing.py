from io import BytesIO

import torch
from PIL import Image
from torchvision import transforms

from app.config import settings


def get_transform() -> transforms.Compose:
    return transforms.Compose(
        [
            transforms.Resize((settings.image_size, settings.image_size)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225],
            ),
        ]
    )


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    transform = get_transform()
    tensor = transform(image).unsqueeze(0)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    return tensor.to(device)


def validate_image(image_bytes: bytes) -> tuple[bool, str]:
    if len(image_bytes) > settings.max_file_size:
        return False, f"File too large. Maximum size is {settings.max_file_size // (1024 * 1024)} MB."

    try:
        image = Image.open(BytesIO(image_bytes))
        image.verify()
    except Exception:
        return False, "Invalid image file. Please upload a valid image."

    fmt = image.format
    if fmt and fmt.lower() not in settings.allowed_extensions:
        return False, f"Unsupported format: {fmt}. Allowed: {', '.join(settings.allowed_extensions)}"

    return True, "OK"
