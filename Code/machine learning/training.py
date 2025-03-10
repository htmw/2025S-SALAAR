import os
import time
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.optim.lr_scheduler import ReduceLROnPlateau
from tqdm import tqdm
from config import Config
from dataset import get_dataloaders
from model import get_model
from utils import AverageMeter, accuracy, save_checkpoint

def train_epoch(model, train_loader, criterion, optimizer, epoch):
    model.train()
    
    losses = AverageMeter()
    top1 = AverageMeter()
    top5 = AverageMeter()
    
    pbar = tqdm(train_loader, desc=f"Epoch {epoch}")
    
    for inputs, targets in pbar:
        inputs, targets = inputs.to(Config.DEVICE), targets.to(Config.DEVICE)
        
        optimizer.zero_grad()
        
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        
        loss.backward()
        optimizer.step()
        
        acc1, acc5 = accuracy(outputs, targets, topk=(1, 5))
        losses.update(loss.item(), inputs.size(0))
        top1.update(acc1.item(), inputs.size(0))
        top5.update(acc5.item(), inputs.size(0))
        
        pbar.set_postfix({
            'loss': f"{losses.avg:.4f}",
            'acc@1': f"{top1.avg:.2f}%",
            'acc@5': f"{top5.avg:.2f}%"
        })
    
    return losses.avg, top1.avg, top5.avg

def validate(model, val_loader, criterion):
    model.eval()
    
    losses = AverageMeter()
    top1 = AverageMeter()
    top5 = AverageMeter()
    
    with torch.no_grad():
        for inputs, targets in tqdm(val_loader, desc="Validation"):
            inputs, targets = inputs.to(Config.DEVICE), targets.to(Config.DEVICE)
            
            outputs = model(inputs)
            loss = criterion(outputs, targets)
            
            acc1, acc5 = accuracy(outputs, targets, topk=(1, 5))
            losses.update(loss.item(), inputs.size(0))
            top1.update(acc1.item(), inputs.size(0))
            top5.update(acc5.item(), inputs.size(0))
    
    print(f"Validation: Loss: {losses.avg:.4f}, Acc@1: {top1.avg:.2f}%, Acc@5: {top5.avg:.2f}%")
    
    return losses.avg, top1.avg, top5.avg

def train():
    torch.manual_seed(Config.RANDOM_SEED)
    np.random.seed(Config.RANDOM_SEED)
    
    os.makedirs(Config.MODELS_DIR, exist_ok=True)
    
    train_loader, val_loader, test_loader, num_classes, class_names = get_dataloaders()
    
    print(f"Number of classes: {num_classes}")
    print(f"Class names: {class_names}")
    
    model = get_model(num_classes)
    criterion = nn.CrossEntropyLoss()
    
    optimizer = optim.AdamW(
        model.parameters(),
        lr=Config.LEARNING_RATE,
        weight_decay=Config.WEIGHT_DECAY
    )
    
    scheduler = ReduceLROnPlateau(
        optimizer,
        mode='min',
        factor=0.5,
        patience=3,
        verbose=True
    )
    
    best_acc = 0
    
    for epoch in range(Config.NUM_EPOCHS):
        start_time = time.time()
        
        train_loss, train_acc1, train_acc5 = train_epoch(
            model, train_loader, criterion, optimizer, epoch)
        
        val_loss, val_acc1, val_acc5 = validate(model, val_loader, criterion)
        
        scheduler.step(val_loss)
        
        epoch_time = time.time() - start_time
        
        print(f"Epoch {epoch} completed in {epoch_time:.2f}s")
        print(f"Train: Loss: {train_loss:.4f}, Acc@1: {train_acc1:.2f}%, Acc@5: {train_acc5:.2f}%")
        print(f"Val: Loss: {val_loss:.4f}, Acc@1: {val_acc1:.2f}%, Acc@5: {val_acc5:.2f}%")
        
        is_best = val_acc1 > best_acc
        best_acc = max(val_acc1, best_acc)
        
        save_checkpoint({
            'epoch': epoch,
            'model_state_dict': model.state_dict(),
            'best_acc': best_acc,
            'optimizer_state_dict': optimizer.state_dict(),
            'class_names': class_names,
            'num_classes': num_classes
        }, is_best)
        
    print(f"Best validation accuracy: {best_acc:.2f}%")

if __name__ == "__main__":
    train()