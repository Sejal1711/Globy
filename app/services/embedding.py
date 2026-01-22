from sentence_transformers import SentenceTransformer
import numpy as np
from PIL import Image
import requests
from io import BytesIO

# CLIP model for multimodal embeddings
clip_model = SentenceTransformer("clip-ViT-B-32")

def get_image_embedding(image_url: str) -> np.ndarray:
    response = requests.get(image_url)
    image = Image.open(BytesIO(response.content)).convert("RGB")
    embedding = clip_model.encode(image, convert_to_numpy=True, normalize_embeddings=True)
    return embedding

def get_text_embedding(text: str) -> np.ndarray:
    embedding = clip_model.encode(text, convert_to_numpy=True, normalize_embeddings=True)
    return embedding
