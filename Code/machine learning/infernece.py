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

parser = argparse.ArgumentParser()
parser.add_argument('image_path', type=str)
parser.add_argument('--model_path', type=str, default='apple_leaf_disease_model_v2.pth')
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
    softmax = torch.softmax(outputs, dim=1)
    confidence, pred = torch.max(softmax, 1)
class_labels = {0: "Healthy", 1: "Scab", 2: "Rust"}
advice_mapping = {"Healthy": "No action needed.", "Scab": "Apply appropriate fungicide.", "Rust": "Ensure proper air circulation and consider fungicide."}
pred_label = class_labels.get(pred.item(), "Unknown")
print("Predicted Class:", pred_label)
print("Confidence Score:", confidence.item() * 100)
if pred_label != "Healthy":
    print("Recommended Action:", advice_mapping.get(pred_label, "No advice available."))
else:
    print("Leaf appears healthy.")
