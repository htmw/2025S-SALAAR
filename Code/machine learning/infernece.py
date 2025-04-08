import torch
import torch.nn as nn
import argparse
from torchvision import transforms
from PIL import Image

transform = transforms.Compose([
    transforms.Resize((150, 150)),
    transforms.ToTensor()
])

class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64 * (150//4) * (150//4), 128),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 3)
        )
    def forward(self, x):
        x = self.features(x)
        x = self.classifier(x)
        return x

parser = argparse.ArgumentParser()
parser.add_argument('image_path', type=str)
parser.add_argument('--model_path', type=str, default='apple_leaf_disease_model_v1.pth')
args = parser.parse_args()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SimpleCNN().to(device)
model.load_state_dict(torch.load(args.model_path, map_location=device))
model.eval()

img = Image.open(args.image_path).convert("RGB")
img_t = transform(img)
img_t = img_t.unsqueeze(0).to(device)
with torch.no_grad():
    outputs = model(img_t)
    _, pred = torch.max(outputs, 1)
class_labels = {0: "Healthy", 1: "Scab", 2: "Rust"}
result = class_labels.get(pred.item(), "Unknown")
print("Predicted Class:", result)
