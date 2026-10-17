# Verdant — Plant Intelligence 🌿

**An AI-powered plant disease classification platform built with PyTorch, FastAPI, Next.js, and React.**

Verdant is a machine-learning project that classifies plant leaf images into supported disease and healthy-leaf categories. It combines a fine-tuned MobileNetV2 model with a web application for image uploads, prediction results, scan history, and model evaluation insights.

> **Research preview:** Predictions are experimental and may be incorrect, especially for images that differ from the training dataset. Verdant is an educational machine-learning project, not a substitute for expert agricultural diagnosis.

## Overview

Verdant brings computer vision and full-stack development together in an interactive plant disease classification application.

Users can upload a leaf image, view the model's predicted class and top predictions, explore supported classes, and review model evaluation metrics.

## Features

- **Image classification:** Predicts a plant disease or healthy-leaf category from an uploaded image.
- **Transfer learning:** Uses a fine-tuned MobileNetV2 architecture.
- **Prediction API:** Serves model inference through a FastAPI backend.
- **Interactive web application:** Built with Next.js, React, TypeScript, and Tailwind CSS.
- **Top predictions:** Displays multiple candidate classes and their model confidence scores.
- **Scan history:** Keeps local browser history of scan metadata.
- **Disease library:** Displays supported classification categories.
- **Model insights:** Presents evaluation metrics and selected class-level results.
- **GPU inference:** Supports CUDA when the environment and compatible hardware are available.

## Tech Stack

| Component | Technology |
|---|---|
| Machine learning | Python, PyTorch, Torchvision |
| Model architecture | MobileNetV2, transfer learning |
| Image processing | Pillow |
| Backend API | FastAPI, Uvicorn |
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS, custom CSS |
| Data analysis | Jupyter, Pandas, NumPy, Matplotlib |
| Version control | Git, GitHub |

## Model Evaluation

The fine-tuned MobileNetV2 model was evaluated on a held-out test split.

| Metric | Result |
|---|---:|
| Test accuracy | 98.42% |
| Macro F1-score | 97.84% |
| Weighted F1-score | 98.42% |
| Supported classes | 39 |
| Held-out test images | 8,314 |

The dataset was split into training, validation, and test sets using stratification with random seed 42.

| Split | Images | Proportion |
|---|---:|---:|
| Training | 38,797 | 70% |
| Validation | 8,314 | 15% |
| Test | 8,314 | 15% |
| **Total** | **55,425** | **100%** |

These results describe performance on the held-out dataset. They do not establish equivalent accuracy on photographs taken in real-world conditions.

## Architecture

```text
                   User
                    |
                    v
          Next.js / React Frontend
                    |
                    | Image upload
                    v
             FastAPI Backend
                    |
                    v
          Image Preprocessing
                    |
                    v
         Fine-tuned MobileNetV2
                    |
                    v
         Predicted Class + Scores
                    |
                    v
           Results in Frontend
```

The frontend and backend are separate components. The backend loads the trained model and exposes endpoints for health checks, supported classes, and image prediction.

## Project Structure

```text
plant-disease-classifier/
├── app/
│   ├── predict_pytorch.py
│   ├── streamlit_app.py
│   └── disease_info.json
├── backend/
│   └── main.py
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_cnn_baseline.ipynb
│   ├── 03_mobilenet_transfer_learning.ipynb
│   └── 04_model_evaluation.ipynb
├── data/                  # Local datasets; not committed
├── models/                # Local model artifacts; not committed
├── reports/               # Local experiment artifacts
├── requirements.txt
├── test_inference.py
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python with the required project dependencies
- Node.js and npm
- Git
- The trained model checkpoint and class-name file
- A compatible CUDA environment for GPU acceleration, if desired

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd plant-disease-classifier
```

### 2. Set up the Python environment

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Ensure the backend's required packages are installed and the model checkpoint is available locally before starting the API.

### 3. Start the backend

From the project root:

```powershell
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Check the API health endpoint:

```text
http://127.0.0.1:8000/health
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 4. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

For production frontend builds:

```powershell
npm run build
```

**Setup note:** A fresh installation also requires the appropriate trained checkpoint and any local dataset files needed for training. These files are not included in the public repository by default.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Check API and model status |
| GET | `/api/classes` | Retrieve supported classification classes |
| POST | `/api/predict` | Classify an uploaded image |

The prediction endpoint accepts supported image uploads and returns the predicted class, top predictions, background indicator, and inference device when available.

## Limitations and Responsible Use

- The model may perform differently on images captured outside its training dataset.
- A high confidence score is not a calibrated probability that a diagnosis is correct.
- The background class may include images that do not contain a plant leaf, so it should not be treated as a reliable leaf detector.
- Visually similar diseases can be confused by the model.
- Predictions should be reviewed by a qualified agricultural expert before treatment decisions are made.
- Test-set metrics alone do not demonstrate generalization to different cameras, lighting, environments, or crop varieties.

## Future Improvements

- Evaluate the model on independently collected real-world images.
- Improve background detection and out-of-distribution handling.
- Investigate confidence calibration and uncertainty estimation.
- Add automated backend tests and continuous integration.
- Improve class-level error analysis and explainability.
- Deploy the frontend and inference API with appropriate resource limits and monitoring.

## Contributing

Contributions involving testing, documentation, model evaluation, usability, and responsible AI are welcome. Please open an issue to discuss substantial changes before submitting a pull request.

## License and Dataset Attribution

The repository license, dataset attribution, and model-weight distribution terms must be confirmed before publication. Check the original dataset license and the applicable pretrained-model terms before distributing datasets or trained checkpoints.

## Author

**Harshit Garg**

AI/ML Engineering · Computer Vision · Full-Stack Development

- GitHub: [Harshit765G4](https://github.com/Harshit765G4)
- LinkedIn: [Harshit Garg](https://www.linkedin.com/in/harshit-garg-76194b252/)
- LeetCode: [harshit765](https://leetcode.com/u/harshit765/)
