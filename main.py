import streamlit as st
import tensorflow as tf
import numpy as np

#Tensorflow Model Prediction
def model_prediction(test_image) : 
    model = tf.keras.models.load_model('trained_model.keras')
    image = tf.keras.preprocessing.image.load_img(test_image, target_size = (128, 128))
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    