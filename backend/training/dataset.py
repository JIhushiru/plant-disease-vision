"""
PlantVillage Dataset Loader

Download the dataset from:
    https://www.kaggle.com/datasets/emmarex/plantdisease

Expected directory structure:
    data/
    └── PlantVillage/
        ├── Apple___Apple_scab/
        │   ├── image1.jpg
        │   └── ...
        ├── Apple___Black_rot/
        └── ...

The dataset contains 38 classes of plant leaf images across 14 plant species.
"""

from pathlib import Path

from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

TRAIN_TRANSFORMS = transforms.Compose(
    [
        transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)

VAL_TRANSFORMS = transforms.Compose(
    [
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)


def get_dataloaders(
    data_dir: str = "data/PlantVillage",
    batch_size: int = 32,
    val_split: float = 0.2,
    num_workers: int = 4,
) -> tuple[DataLoader, DataLoader, list[str]]:
    data_path = Path(data_dir)
    if not data_path.exists():
        raise FileNotFoundError(
            f"Dataset not found at {data_path.resolve()}. "
            "Download from https://www.kaggle.com/datasets/emmarex/plantdisease"
        )

    full_dataset = datasets.ImageFolder(root=str(data_path))
    class_names = full_dataset.classes

    total = len(full_dataset)
    val_size = int(total * val_split)
    train_size = total - val_size

    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    train_dataset.dataset.transform = TRAIN_TRANSFORMS
    val_dataset.dataset.transform = VAL_TRANSFORMS

    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True,
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True,
    )

    print(f"Dataset loaded: {total} images, {len(class_names)} classes")
    print(f"  Train: {train_size} | Validation: {val_size}")

    return train_loader, val_loader, class_names
