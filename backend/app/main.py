from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes.predict import router as predict_router
from app.services.prediction import get_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    model = get_model()
    if model is not None:
        print(f"Model loaded successfully ({settings.model_backbone})")
    else:
        print(
            "WARNING: No trained model found. The API will return errors for "
            "predictions until a model is trained and placed at: "
            f"{settings.model_path}"
        )
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)


@app.get("/api/health")
async def health_check():
    model = get_model()
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "model_backbone": settings.model_backbone,
        "num_classes": settings.num_classes,
    }
