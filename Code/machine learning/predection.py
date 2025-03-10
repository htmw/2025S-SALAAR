import os
import torch
import numpy as np
from PIL import Image
from torchvision import transforms
from config import Config
from model import get_model

def load_model(model_path):
    checkpoint = torch.load(model_path)
    num_classes = checkpoint['num_classes']
    class_names = checkpoint['class_names']
    
    model = get_model(num_classes)
    model.load_state_dict(checkpoint['model_state_dict'])
    model.eval()
    
    return model, class_names

def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((Config.IMAGE_SIZE[0] + 32, Config.IMAGE_SIZE[1] + 32)),
        transforms.CenterCrop(Config.IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    img = Image.open(image_path).convert('RGB')
    img_tensor = transform(img).unsqueeze(0).to(Config.DEVICE)
    
    return img_tensor

def predict_single_image(model, image_path, class_names):
    img_tensor = preprocess_image(image_path)
    
    with torch.no_grad():
        outputs = model(img_tensor)
        probs = torch.nn.functional.softmax(outputs, dim=1)[0]
        
        top5_probs, top5_indices = torch.topk(probs, 5)
        
        results = []
        for i, (idx, prob) in enumerate(zip(top5_indices, top5_probs)):
            results.append({
                'rank': i + 1,
                'class_name': class_names[idx.item()],
                'probability': prob.item()
            })
    
    return results

def predict_batch(model, image_paths, class_names):
    all_results = []
    
    for image_path in image_paths:
        try:
            result = predict_single_image(model, image_path, class_names)
            all_results.append({
                'image_path': image_path,
                'predictions': result
            })
        except Exception as e:
            all_results.append({
                'image_path': image_path,
                'error': str(e)
            })
    
    return all_results

def main():
    model_path = os.path.join(Config.MODELS_DIR, f"best_model_{Config.RUN_ID}.pth")
    
    if not os.path.exists(model_path):
        print(f"Model not found at {model_path}")
        return
    
    model, class_names = load_model(model_path)
    
    test_dir = Config.TEST_DIR
    image_paths = []
    
    for root, _, files in os.walk(test_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                image_paths.append(os.path.join(root, file))
    
    results = predict_batch(model, image_paths, class_names)
    
    for result in results:
        if 'error' in result:
            print(f"Error for {result['image_path']}: {result['error']}")
        else:
            print(f"\nPredictions for {result['image_path']}:")
            for pred in result['predictions']:
                print(f"  {pred['rank']}. {pred['class_name']}: {pred['probability']:.4f}")

if __name__ == "__main__":
    main()