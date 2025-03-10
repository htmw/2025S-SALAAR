import os
import io
import time
import torch
import torchvision.transforms as transforms
import numpy as np
from PIL import Image
from config import Config
from model import get_model
import json
from flask import Flask, request, jsonify

class ImageClassifier:
    def __init__(self, model_path):
        self.device = torch.device(Config.DEVICE)
        
        checkpoint = torch.load(model_path, map_location=self.device)
        self.num_classes = checkpoint['num_classes']
        self.class_names = checkpoint['class_names']
        
        self.model = get_model(self.num_classes)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model.eval()
        
        self.transform = transforms.Compose([
            transforms.Resize((Config.IMAGE_SIZE[0] + 32, Config.IMAGE_SIZE[1] + 32)),
            transforms.CenterCrop(Config.IMAGE_SIZE),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def preprocess(self, image_bytes=None, image_path=None):
        if image_bytes:
            img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        elif image_path:
            img = Image.open(image_path).convert('RGB')
        else:
            raise ValueError("Either image_bytes or image_path must be provided")
        
        return self.transform(img).unsqueeze(0).to(self.device)
    
    def predict(self, image_tensor, top_k=5):
        with torch.no_grad():
            outputs = self.model(image_tensor)
            probs = torch.nn.functional.softmax(outputs, dim=1)[0]
            
            top_probs, top_indices = torch.topk(probs, top_k)
            
            predictions = []
            for prob, idx in zip(top_probs, top_indices):
                predictions.append({
                    'class_name': self.class_names[idx.item()],
                    'probability': float(prob)
                })
        
        return predictions
    
    def batch_predict(self, image_paths, top_k=5):
        results = []
        
        for path in image_paths:
            try:
                img_tensor = self.preprocess(image_path=path)
                predictions = self.predict(img_tensor, top_k)
                
                results.append({
                    'image_path': path,
                    'predictions': predictions
                })
            except Exception as e:
                results.append({
                    'image_path': path,
                    'error': str(e)
                })
        
        return results
        
    def extract_features(self, image_tensor):
        with torch.no_grad():
            features = self.model.extract_features(image_tensor)
        return features.cpu().numpy()


# Flask API for inference
app = Flask(__name__)

classifier = None

@app.before_first_request
def load_model_api():
    global classifier
    model_path = os.path.join(Config.MODELS_DIR, f"best_model_{Config.RUN_ID}.pth")
    classifier = ImageClassifier(model_path)
    print(f"Model loaded from {model_path}")

@app.route('/predict', methods=['POST'])
def predict_api():
    if request.method == 'POST':
        start_time = time.time()
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
            
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
            
        try:
            # Read image file
            img_bytes = file.read()
            
            # Preprocess and predict
            image_tensor = classifier.preprocess(image_bytes=img_bytes)
            predictions = classifier.predict(image_tensor)
            
            process_time = time.time() - start_time
            
            return jsonify({
                'predictions': predictions,
                'processing_time': process_time
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict_api():
    if request.method == 'POST':
        if not request.json or 'image_paths' not in request.json:
            return jsonify({'error': 'No image paths provided'}), 400
            
        image_paths = request.json['image_paths']
        top_k = request.json.get('top_k', 5)
        
        try:
            results = classifier.batch_predict(image_paths, top_k)
            return jsonify({'results': results})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': classifier is not None})


def start_service(host='0.0.0.0', port=5000):
    app.run(host=host, port=port)


if __name__ == "__main__":
    start_service()