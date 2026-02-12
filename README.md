# Plant Disease Vision

A full-stack computer vision application that detects plant diseases from leaf images using deep learning. Upload a photo of a plant leaf, and the model classifies it across **38 disease categories** spanning **14 crop species**, returning a diagnosis with confidence scores, causes, symptoms, and treatment recommendations.

![Stack](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat&logo=pytorch&logoColor=white)
![Stack](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Stack](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## Features

- **Real-time classification** — upload a leaf image and get results in seconds
- **38 disease classes** across 14 plant species (PlantVillage dataset)
- **EfficientNet-B0 backbone** with ImageNet transfer learning
- **Detailed disease reports** — cause, symptoms, and treatment for each diagnosis
- **Top-5 predictions** with confidence scores
- **Responsive UI** — works on desktop and mobile
- **Dockerized** — single command to spin up the full stack

## Supported Plants

Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato

## Architecture

```
┌──────────────────┐       ┌──────────────────────────┐
│                  │  API  │                          │
│   React + Vite   │──────▶│  FastAPI + PyTorch       │
│   Tailwind CSS   │◀──────│  EfficientNet-B0 Model   │
│                  │       │                          │
└──────────────────┘       └──────────────────────────┘
       :80                          :8000
```

## Quick Start

### With Docker (recommended)

```bash
docker compose up --build
```

Open [http://localhost](http://localhost) in your browser.

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

The frontend dev server proxies `/api` requests to the backend at `localhost:8000`.

## Training the Model

1. Download the [PlantVillage dataset](https://www.kaggle.com/datasets/emmarex/plantdisease) and extract it to `backend/data/PlantVillage/`

2. Run the training script:

```bash
cd backend
python -m training.train \
  --data-dir data/PlantVillage \
  --backbone efficientnet_b0 \
  --epochs 20 \
  --batch-size 32 \
  --lr 0.001
```

3. The trained model is saved to `backend/models/saved/plant_disease_model.pth`

4. Evaluate performance:

```bash
python -m training.evaluate \
  --model-path models/saved/plant_disease_model.pth \
  --data-dir data/PlantVillage
```

## API Endpoints

| Method | Endpoint       | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/api/predict` | Upload an image for disease diagnosis |
| GET    | `/api/classes` | List all supported disease classes    |
| GET    | `/api/health`  | Health check and model status         |

## Project Structure

```
plant-disease-vision/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── config.py            # Settings and configuration
│   │   ├── models/classifier.py # Model architecture + class labels
│   │   ├── routes/predict.py    # API endpoints
│   │   ├── services/prediction.py # Inference pipeline
│   │   └── utils/image_processing.py
│   ├── training/
│   │   ├── train.py             # Training loop
│   │   ├── dataset.py           # Data loading + augmentation
│   │   └── evaluate.py          # Model evaluation
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application
│   │   ├── components/          # UI components
│   │   ├── hooks/               # Custom React hooks
│   │   └── services/api.js      # API client
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Tech Stack

- **Model:** PyTorch + torchvision (EfficientNet-B0 / ResNet-50)
- **Backend:** FastAPI, Python 3.12
- **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
- **Deployment:** Docker, Nginx
