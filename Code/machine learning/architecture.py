import torch
import torch.nn as nn
import torch.nn.functional as F
from efficientnet_pytorch import EfficientNet
from config import Config

class EfficientNetClassifier(nn.Module):
    def __init__(self, num_classes, dropout_rate=0.2, pretrained=True):
        super(EfficientNetClassifier, self).__init__()
        
        if pretrained:
            self.efficientnet = EfficientNet.from_pretrained(Config.EFFICIENTNET_VERSION)
        else:
            self.efficientnet = EfficientNet.from_name(Config.EFFICIENTNET_VERSION)
        
        self.feature_size = self.efficientnet._fc.in_features
        self.efficientnet._fc = nn.Identity()
        
        self.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(self.feature_size, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(512, num_classes)
        )
        
    def forward(self, x):
        features = self.efficientnet(x)
        output = self.classifier(features)
        return output
    
    def extract_features(self, x):
        return self.efficientnet(x)
    
def get_model(num_classes):
    model = EfficientNetClassifier(num_classes)
    return model.to(Config.DEVICE)

def load_checkpoint(model, checkpoint_path):
    model.load_state_dict(torch.load(checkpoint_path))
    return model