
from pathlib import Path

import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
from torchvision.models import mobilenet_v2


# --------------------------------------------------
# 1. Project configuration
# --------------------------------------------------

PROJECT_ROOT = Path(__file__).resolve().parents[1]

MODEL_PATH = (
    PROJECT_ROOT
    / "models"
    / "plant_disease_mobilenetv2_finetuned_best.pth"
)

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# --------------------------------------------------
# 2. Load the trained model
# --------------------------------------------------

def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model checkpoint not found: {MODEL_PATH}"
        )

    # This checkpoint was created by your own training code.
    checkpoint = torch.load(
        MODEL_PATH,
        map_location=DEVICE,
        weights_only=False,
    )

    class_names = checkpoint["class_names"]
    num_classes = checkpoint["num_classes"]
    image_size = checkpoint["img_size"]

    model = mobilenet_v2(weights=None)

    in_features = model.classifier[1].in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, num_classes),
    )

    model.load_state_dict(checkpoint["model_state_dict"])
    model = model.to(DEVICE)
    model.eval()

    return model, class_names, image_size


# --------------------------------------------------
# 3. Match the training-time preprocessing
# --------------------------------------------------

def build_transform(image_size):
    return transforms.Compose([
        transforms.Resize((image_size, image_size)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ])


# --------------------------------------------------
# 4. Predict the disease from a leaf image
# --------------------------------------------------

def predict_image(image, model, class_names, transform):
    """
    Accepts a PIL image and returns the top predictions.

    Confidence is the model's softmax probability,
    not a guarantee of diagnostic correctness.
    """

    if not isinstance(image, Image.Image):
        raise TypeError("Expected a PIL Image.")

    image = image.convert("RGB")
    tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.inference_mode():
        logits = model(tensor)
        probabilities = torch.softmax(logits, dim=1)[0]

    top_k = min(3, len(class_names))
    scores, indices = torch.topk(probabilities, k=top_k)

    results = []

    for score, index in zip(scores.cpu(), indices.cpu()):
        results.append({
            "class_name": class_names[index.item()],
            "confidence": float(score.item()),
        })

    return results
