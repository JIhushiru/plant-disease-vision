from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.prediction import predict

router = APIRouter(prefix="/api", tags=["prediction"])


@router.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await file.read()
    result = predict(image_bytes)

    if not result["success"]:
        raise HTTPException(status_code=422, detail=result["error"])

    return result


@router.get("/classes")
async def get_classes():
    from app.models.classifier import CLASS_NAMES, DISEASE_INFO

    classes = []
    for name in CLASS_NAMES:
        plant, _, condition = name.partition(" — ")
        classes.append(
            {
                "class_name": name,
                "plant": plant,
                "condition": condition,
                "is_healthy": condition.lower() == "healthy",
            }
        )

    plants = sorted(set(c["plant"] for c in classes))

    return {
        "total_classes": len(CLASS_NAMES),
        "plants": plants,
        "classes": classes,
        "disease_info": DISEASE_INFO,
    }
