import os
from datetime import datetime

class Config:
    DATA_DIR = 'data/'
    TRAIN_DIR = os.path.join(DATA_DIR, 'train')
    VAL_DIR = os.path.join(DATA_DIR, 'val')
    TEST_DIR = os.path.join(DATA_DIR, 'test')
    
    PROCESSED_DATA_DIR = os.path.join(DATA_DIR, 'processed')
    LOGS_DIR = 'logs/'
    MODELS_DIR = 'models/'
    
    IMAGE_SIZE = (224, 224)
    BATCH_SIZE = 32
    NUM_WORKERS = 4
    
    LEARNING_RATE = 1e-4
    WEIGHT_DECAY = 1e-5
    NUM_EPOCHS = 30
    
    EFFICIENTNET_VERSION = 'efficientnet-b0'
    
    RUN_ID = datetime.now().strftime('%Y%m%d_%H%M%S')
    CHECKPOINT_PATH = os.path.join(MODELS_DIR, f'efficientnet_{RUN_ID}.pth')
    
    DEVICE = 'cuda'
    
    RANDOM_SEED = 42