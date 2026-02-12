"""
Evaluation script for the trained Plant Disease model.

Usage:
    python -m training.evaluate --model-path models/saved/plant_disease_model.pth --data-dir data/PlantVillage
"""

import argparse
import json
from collections import defaultdict
from pathlib import Path

import torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

from app.models.classifier import build_model


def evaluate(model_path: str, data_dir: str, batch_size: int = 32, num_workers: int = 4):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    checkpoint = torch.load(model_path, map_location=device, weights_only=True)
    num_classes = checkpoint["num_classes"]
    backbone = checkpoint["backbone"]
    class_names = checkpoint["class_names"]

    model = build_model(num_classes, backbone)
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    val_transforms = transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    dataset = datasets.ImageFolder(root=data_dir, transform=val_transforms)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=False, num_workers=num_workers)

    class_correct = defaultdict(int)
    class_total = defaultdict(int)
    total_correct = 0
    total_samples = 0

    with torch.no_grad():
        for images, labels in loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = outputs.max(1)

            for label, pred in zip(labels, predicted):
                cls = class_names[label.item()]
                class_total[cls] += 1
                if label == pred:
                    class_correct[cls] += 1
                    total_correct += 1
                total_samples += 1

    overall_acc = total_correct / total_samples

    print(f"\nOverall Accuracy: {overall_acc:.4f} ({total_correct}/{total_samples})")
    print(f"\n{'Class':<55} {'Accuracy':>10} {'Correct':>10} {'Total':>8}")
    print("-" * 85)

    per_class = {}
    for cls in class_names:
        correct = class_correct[cls]
        total = class_total[cls]
        acc = correct / total if total > 0 else 0
        per_class[cls] = {"accuracy": acc, "correct": correct, "total": total}
        print(f"{cls:<55} {acc:>10.4f} {correct:>10} {total:>8}")

    results = {
        "overall_accuracy": overall_acc,
        "total_correct": total_correct,
        "total_samples": total_samples,
        "per_class": per_class,
    }

    output_path = Path(model_path).parent / "evaluation_results.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nResults saved to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Evaluate Plant Disease Model")
    parser.add_argument("--model-path", type=str, required=True)
    parser.add_argument("--data-dir", type=str, required=True)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--num-workers", type=int, default=4)
    args = parser.parse_args()

    evaluate(args.model_path, args.data_dir, args.batch_size, args.num_workers)


if __name__ == "__main__":
    main()
