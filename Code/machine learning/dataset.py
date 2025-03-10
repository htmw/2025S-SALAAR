import os
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
import numpy as np
from config import Config

class ImageClassificationDataset(Dataset):
    def __init__(self, root_dir, transform=None):
        self.root_dir = root_dir
        self.transform = transform
        self.classes = sorted(os.listdir(root_dir))
        self.class_to_idx = {cls: idx for idx, cls in enumerate(self.classes)}
        
        self.samples = []
        for class_name in self.classes:
            class_dir = os.path.join(root_dir, class_name)
            if not os.path.isdir(class_dir):
                continue
                
            for img_name in os.listdir(class_dir):
                if img_name.lower().endswith(('.jpg', '.jpeg', '.png')):
                    self.samples.append((
                        os.path.join(class_dir, img_name),
                        self.class_to_idx[class_name]
                    ))
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        img_path, label = self.samples[idx]
        
        try:
            image = Image.open(img_path).convert('RGB')
            
            if self.transform:
                image = self.transform(image)
                
            return image, label
        except:
            # Fallback for corrupted images
            placeholder = torch.zeros((3, *Config.IMAGE_SIZE))
            return placeholder, label

def get_transforms():
    train_transform = transforms.Compose([
        transforms.Resize((Config.IMAGE_SIZE[0] + 32, Config.IMAGE_SIZE[1] + 32)),
        transforms.RandomResizedCrop(Config.IMAGE_SIZE),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.05),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((Config.IMAGE_SIZE[0] + 32, Config.IMAGE_SIZE[1] + 32)),
        transforms.CenterCrop(Config.IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    return train_transform, val_transform

def get_dataloaders():
    train_transform, val_transform = get_transforms()
    
    train_dataset = ImageClassificationDataset(
        os.path.join(Config.PROCESSED_DATA_DIR, 'train'),
        transform=train_transform
    )
    
    val_dataset = ImageClassificationDataset(
        os.path.join(Config.PROCESSED_DATA_DIR, 'val'),
        transform=val_transform
    )
    
    test_dataset = ImageClassificationDataset(
        os.path.join(Config.PROCESSED_DATA_DIR, 'test'),
        transform=val_transform
    )
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=Config.BATCH_SIZE,
        shuffle=True,
        num_workers=Config.NUM_WORKERS,
        pin_memory=True,
        drop_last=True
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=Config.BATCH_SIZE,
        shuffle=False,
        num_workers=Config.NUM_WORKERS,
        pin_memory=True
    )
    
    test_loader = DataLoader(
        test_dataset,
        batch_size=Config.BATCH_SIZE,
        shuffle=False,
        num_workers=Config.NUM_WORKERS,
        pin_memory=True
    )
    
    num_classes = len(train_dataset.classes)
    class_names = train_dataset.classes
    
    return train_loader, val_loader, test_loader, num_classes, class_names