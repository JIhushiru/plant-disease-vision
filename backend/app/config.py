from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Plant Disease Vision API"
    app_version: str = "1.0.0"
    debug: bool = False

    model_path: str = str(
        Path(__file__).resolve().parent.parent / "models" / "saved" / "plant_disease_model.pth"
    )
    model_backbone: str = "efficientnet_b0"
    num_classes: int = 38
    image_size: int = 224

    allowed_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:80",
        "http://frontend:80",
    ]

    max_file_size: int = 10 * 1024 * 1024  # 10 MB
    allowed_extensions: set[str] = {"jpg", "jpeg", "png", "webp", "bmp"}

    class Config:
        env_file = ".env"
        env_prefix = "PDV_"


settings = Settings()
