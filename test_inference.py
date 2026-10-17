from pathlib import Path

import pandas as pd
from PIL import Image

from app.predict_pytorch import (
    load_model,
    build_transform,
    predict_image,
)

ROOT = Path(__file__).resolve().parent

model, class_names, image_size = load_model()
transform = build_transform(image_size)

# Use one validation image for a smoke test.
val_df = pd.read_csv(ROOT / "data" / "splits" / "validation.csv")
row = val_df.iloc[0]

image_path = Path(str(row["file_path"]))

if not image_path.is_absolute():
    image_path = ROOT / image_path

if not image_path.exists():
    raise FileNotFoundError(f"Image not found: {image_path}")

with Image.open(image_path) as img:
    image = img.convert("RGB")

results = predict_image(image, model, class_names, transform)

print("Device:", next(model.parameters()).device)
print("Actual class:", row["class_name"])
print("Top predictions:")

for result in results:
    print(
        f"{result['class_name']}: "
        f"{result['confidence']:.2%}"
    )