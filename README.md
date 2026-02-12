---
title: Plant Disease Vision
emoji: "\U0001F33F"
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
---

# Plant Disease Vision

![Stack](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

A computer vision system that identifies plant diseases from leaf photographs. The idea comes from a straightforward observation: smallholder farmers lose roughly 20–40 % of their crop yield to pests and disease every year, and most of that loss is preventable if the problem is caught early. This project explores whether a lightweight deep learning pipeline, accessible through a browser, can make that kind of early detection practical.

---

## Motivation

Most existing plant pathology tools are either locked behind expensive lab equipment or require domain expertise to interpret results. I wanted to build something that sits at the intersection of computer vision and agricultural science — a system where a farmer, agronomist, or student can photograph a leaf and immediately get a structured diagnosis: what the disease is, what causes it, and what to do about it.

The choice of the PlantVillage dataset (54,000+ labeled images across 14 species and 38 disease classes) was deliberate. It's the most widely benchmarked dataset in this domain, which makes it easy to compare results against published work while still being large enough to train a production-quality classifier.

## How It Works

The pipeline has three stages:

**1. Image preprocessing** — The uploaded leaf image is resized to 224x224, normalized against ImageNet statistics, and converted to a tensor. During training, augmentation (random crops, flips, rotations, color jitter) is applied to improve generalization across different lighting conditions and camera angles.

**2. Classification** — An EfficientNet-B0 backbone, pretrained on ImageNet, is fine-tuned on the PlantVillage dataset. EfficientNet was chosen over ResNet for its better accuracy-to-parameter ratio — it achieves competitive performance with ~5.3M parameters compared to ResNet-50's ~25.6M, which matters for inference speed and deployment on resource-constrained hardware. The model outputs a softmax probability distribution over all 38 classes.

**3. Diagnosis generation** — The top-5 predictions with confidence scores are returned alongside a structured report for the primary diagnosis. Each of the 38 disease classes is mapped to curated information: the causal pathogen, visible symptom descriptions, and evidence-based treatment recommendations sourced from agricultural extension literature.

```
Image → Preprocessing → EfficientNet-B0 → Softmax → Top-K Predictions
                                                          ↓
                                                  Disease Info Lookup
                                                  (cause, symptoms, treatment)
```

## Architecture Decisions

**Why FastAPI over Flask/Django?** Async request handling matters when the bottleneck is model inference. FastAPI's native async support lets the server handle file uploads and I/O without blocking, and Pydantic integration gives automatic request validation and OpenAPI docs for free.

**Why a separate training pipeline?** The training code (`training/train.py`, `dataset.py`, `evaluate.py`) is deliberately decoupled from the inference server. In practice, model training happens offline — often on a different machine with GPU access — and only the serialized weights (`.pth`) are deployed to the API server. This separation keeps the production image lean and the training workflow reproducible.

**Why not a pre-hosted model API?** The goal was end-to-end ownership of the ML pipeline. Using a third-party vision API would abstract away the parts that matter most: data augmentation strategy, backbone selection, transfer learning approach, and the ability to retrain on new disease classes as they emerge.

## Supported Crops

Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

Each species includes both healthy and diseased classes, so the model learns to distinguish healthy tissue from pathological symptoms — not just classify between diseases.

## Running the Project

### Docker

```bash
docker compose up --build
```

Open `http://localhost` in a browser.

### Local Development

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `localhost:8000`.

## Training

1. Download the [PlantVillage dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) → extract to `backend/data/PlantVillage/`

2. Train:

```bash
cd backend
python -m training.train \
  --data-dir data/PlantVillage \
  --backbone efficientnet_b0 \
  --epochs 20 \
  --batch-size 32 \
  --lr 0.001
```

The training loop uses AdamW with cosine annealing and saves the best checkpoint by validation accuracy. On a single GPU, expect ~95%+ validation accuracy within 15–20 epochs.

3. Evaluate:

```bash
python -m training.evaluate \
  --model-path models/saved/plant_disease_model.pth \
  --data-dir data/PlantVillage
```

## Project Structure

```
backend/
├── app/
│   ├── main.py                # FastAPI app, CORS, lifespan
│   ├── config.py              # Pydantic settings (env-configurable)
│   ├── models/classifier.py   # Model architecture, class names, disease DB
│   ├── routes/predict.py      # /api/predict, /api/classes endpoints
│   ├── services/prediction.py # Inference orchestration
│   └── utils/image_processing.py
├── training/
│   ├── train.py               # Training loop w/ checkpointing
│   ├── dataset.py             # PlantVillage loader + augmentation
│   └── evaluate.py            # Per-class accuracy evaluation
└── Dockerfile

frontend/
├── src/
│   ├── App.jsx                # Layout, state management, history
│   ├── components/            # UI (dropzone, results, confidence bars, etc.)
│   ├── hooks/usePrediction.js # Async prediction state machine
│   └── services/api.js        # Axios client w/ error interceptors
├── nginx.conf                 # Production reverse proxy
└── Dockerfile                 # Multi-stage Node → Nginx build
```

## Tech Stack

| Layer      | Technology                              | Rationale                                            |
|------------|-----------------------------------------|------------------------------------------------------|
| Model      | PyTorch, torchvision, EfficientNet-B0   | Best accuracy-per-FLOP; strong transfer learning     |
| API        | FastAPI, Python 3.12                    | Async I/O, auto validation, OpenAPI docs             |
| Frontend   | React 19, Vite, Tailwind CSS            | Fast dev loop, utility-first styling, small bundle   |
| Animation  | Framer Motion                           | Physics-based transitions for result reveals         |
| Deployment | Docker Compose, Nginx                   | One-command orchestration, static asset caching      |
