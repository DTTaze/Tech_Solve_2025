from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
import tensorflow as tf
import os

app = Flask(__name__)

# Load the model
model = tf.keras.models.load_model("trash-classification-aug.keras")

# Define class labels
classes = ["cardboard", "glass", "metal", "paper", "plastic", "trash"]
recyclable = set(classes) - {"trash"}

def preprocess_image(image_path):
    img = Image.open(image_path).resize((32, 32))  # Resize to 32x32 instead of 128x128
    img = img.convert("RGB")
    img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
    return img_array

@app.route('/health')
def health():
    return "OK", 200

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image_file = request.files['image']
    image_path = "temp.jpg"
    image_file.save(image_path)

    img_array = preprocess_image(image_path)
    prediction = model.predict(img_array)
    predicted_label = classes[np.argmax(prediction)]
    is_recyclable = predicted_label in recyclable

    os.remove(image_path)

    return jsonify({
        'label': predicted_label,
        'recyclable': is_recyclable
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
