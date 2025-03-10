import os
import shutil
from PIL import Image
import numpy as np
from tqdm import tqdm
import torch
from config import Config
from torchvision import transforms

def check_and_create_dirs():
    os.makedirs(Config.PROCESSED_DATA_DIR, exist_ok=True)
    os.makedirs(Config.LOGS_DIR, exist_ok=True)
    os.makedirs(Config.MODELS_DIR, exist_ok=True)

def is_valid_image(image_path):
    try:
        img = Image.open(image_path)
        img.verify()
        
        if img.format not in ['JPEG', 'PNG']:
            return False
        
        img = Image.open(image_path)
        img_array = np.array(img)
        
        if len(img_array.shape) < 3 or img_array.shape[2] != 3:
            return False
            
        if img.width < 32 or img.height < 32:
            return False
            
        return True
    except:
        return False

def clean_images(data_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    for root, _, files in os.walk(data_dir):
        for file in tqdm(files):
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                image_path = os.path.join(root, file)
                
                if is_valid_image(image_path):
                    relative_path = os.path.relpath(root, data_dir)
                    target_dir = os.path.join(output_dir, relative_path)
                    os.makedirs(target_dir, exist_ok=True)
                    
                    try:
                        img = Image.open(image_path)
                        img = img.convert('RGB')
                        
                        target_path = os.path.join(target_dir, file)
                        img.save(target_path, format='JPEG', quality=95)
                    except:
                        print(f"Failed to process {image_path}")

def main():
    check_and_create_dirs()
    
    train_output = os.path.join(Config.PROCESSED_DATA_DIR, 'train')
    val_output = os.path.join(Config.PROCESSED_DATA_DIR, 'val')
    test_output = os.path.join(Config.PROCESSED_DATA_DIR, 'test')
    
    print("Cleaning training images...")
    clean_images(Config.TRAIN_DIR, train_output)
    
    print("Cleaning validation images...")
    clean_images(Config.VAL_DIR, val_output)
    
    print("Cleaning test images...")
    clean_images(Config.TEST_DIR, test_output)

if __name__ == "__main__":
    main()