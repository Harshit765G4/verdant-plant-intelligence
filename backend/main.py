
import io
import os
from contextlib import asynccontextmanager
from pathlib import Path

import torch
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

# Reuse the existing, tested inference code.
from app.predict_pytorch import (
    DEVICE,
    build_transform,
    load_model,
    predict_image,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}

model = None
class_names = []
transform = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names, transform

    model, class_names, image_size = load_model()
    transform = build_transform(image_size)

    print(f"Verdant model loaded on {DEVICE}")
    print(f"Loaded {len(class_names)} classes")

    yield

    model = None
    transform = None

app = FastAPI(
    title="Verdant Plant Intelligence API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.56.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "device": str(DEVICE),
    }

@app.get("/api/classes")
def get_classes():
    if not class_names:
        raise HTTPException(503, "The model is not loaded.")

    return {
        "classes": [
            {
                "name": name,
                "is_background": name == "Background_without_leaves",
                "is_healthy": "healthy" in name.lower(),
            }
            for name in class_names
        ]
    }

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    if model is None or transform is None:
        raise HTTPException(503, "The model is not ready.")

    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            415, "Upload a JPG, PNG, or WebP image."
        )

    contents = await file.read(MAX_FILE_SIZE + 1)

    if not contents:
        raise HTTPException(400, "The uploaded file is empty.")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(413, "Image size must not exceed 10 MB.")

    try:
        with Image.open(io.BytesIO(contents)) as source:
            source.verify()

        with Image.open(io.BytesIO(contents)) as source:
            image = source.convert("RGB")

    except (UnidentifiedImageError, OSError, Image.DecompressionBombError):
        raise HTTPException(400, "The uploaded file is not a valid image.")

    predictions = predict_image(
        image, model, class_names, transform
    )

    if not predictions:
        raise HTTPException(500, "The model returned no predictions.")

    top_prediction = predictions[0]
    is_background = (
        top_prediction["class_name"] == "Background_without_leaves"
    )

    return {
        "prediction": top_prediction,
        "top_predictions": predictions,
        "is_background": is_background,
        "message": (
            "The model selected its broad background class. "
            "This does not reliably establish whether leaves are present."
            if is_background else None
        ),
        "device": str(DEVICE),
    }
