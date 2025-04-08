import argparse
import torch
import torch.nn as nn
import torch.optim as optim
import csv
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

parser = argparse.ArgumentParser()
parser.add_argument('--epochs', type=int, default=15)
parser.add_argument('--batch_size', type=int, default=32)
args = parser.parse_args()

transform_train = transforms.Compose([
    transforms.Resize((150, 150)),
    transforms.RandomRotation(20),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor()
])
transform_val = transforms.Compose([
    transforms.Resize((150, 150)),
    transforms.ToTensor()
])

train_dataset = datasets.ImageFolder('data/train', transform=transform_train)
val_dataset = datasets.ImageFolder('data/validation', transform=transform_val)
train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False)

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * (150//8) * (150//8), 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 3)
        )
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SimpleCNN().to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)
scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', patience=2, factor=0.5, verbose=True)
epochs = args.epochs
best_acc = 0.0
patience = 5
patience_counter = 0
log_file = open('training_log.csv', 'w', newline='')
csv_writer = csv.writer(log_file)
csv_writer.writerow(["epoch", "accuracy"])

for epoch in range(epochs):
    model.train()
    for imgs, labels in train_loader:
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        outputs = model(imgs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
    model.eval()
    total, correct = 0, 0
    with torch.no_grad():
        for imgs, labels in val_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            outputs = model(imgs)
            _, preds = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (preds == labels).sum().item()
    acc = correct / total
    csv_writer.writerow([epoch+1, acc])
    log_file.flush()
    print(f"Epoch {epoch+1}: Accuracy = {acc:.4f}")
    scheduler.step(acc)
    if acc > best_acc:
        best_acc = acc
        torch.save(model.state_dict(), 'apple_leaf_disease_model_v2.pth')
        patience_counter = 0
    else:
        patience_counter += 1
    if patience_counter >= patience:
        break
log_file.close()
