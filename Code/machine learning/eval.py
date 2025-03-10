import os
import torch
import torch.nn as nn
import numpy as np
from tqdm import tqdm
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from config import Config
from model import get_model, load_checkpoint
from dataset import get_dataloaders
from utils import accuracy

def predict(model, test_loader):
    model.eval()
    
    all_preds = []
    all_targets = []
    
    with torch.no_grad():
        for inputs, targets in tqdm(test_loader, desc="Evaluating"):
            inputs, targets = inputs.to(Config.DEVICE), targets.to(Config.DEVICE)
            
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)
            
            all_preds.extend(preds.cpu().numpy())
            all_targets.extend(targets.cpu().numpy())
    
    return np.array(all_preds), np.array(all_targets)

def evaluate(model_path=None):
    if model_path is None:
        model_path = os.path.join(Config.MODELS_DIR, f"best_model_{Config.RUN_ID}.pth")
    
    _, _, test_loader, num_classes, class_names = get_dataloaders()
    
    checkpoint = torch.load(model_path)
    model = get_model(num_classes)
    model.load_state_dict(checkpoint['model_state_dict'])
    
    criterion = nn.CrossEntropyLoss()
    
    model.eval()
    
    test_loss = 0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for inputs, targets in tqdm(test_loader, desc="Testing"):
            inputs, targets = inputs.to(Config.DEVICE), targets.to(Config.DEVICE)
            
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            
            test_loss += loss.item()
            _, predicted = outputs.max(1)
            total += targets.size(0)
            correct += predicted.eq(targets).sum().item()
    
    acc = 100. * correct / total
    
    print(f"Test accuracy: {acc:.2f}%")
    print(f"Test loss: {test_loss / len(test_loader):.4f}")
    
    preds, targets = predict(model, test_loader)
    
    report = classification_report(
        targets, preds, 
        target_names=class_names,
        digits=4
    )
    
    print("Classification Report:")
    print(report)
    
    cm = confusion_matrix(targets, preds)
    plt.figure(figsize=(12, 10))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.xlabel('Predicted')
    plt.ylabel('True')
    plt.title('Confusion Matrix')
    plt.savefig(os.path.join(Config.LOGS_DIR, f"confusion_matrix_{Config.RUN_ID}.png"))
    
    return acc, test_loss / len(test_loader), report

if __name__ == "__main__":
    evaluate()