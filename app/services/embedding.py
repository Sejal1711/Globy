from sentence_transformers import SentenceTransformer
from functools import lru_cache
import numpy as np
from PIL import Image
import requests
from io import BytesIO
import torch

# 🚀 Load ONCE at startup
clip_model = SentenceTransformer("clip-ViT-B-32")
clip_model.eval()

# -------------------------
# IMAGE EMBEDDING (UPLOAD)
# -------------------------
def get_image_embedding(image_url: str) -> np.ndarray:
    response = requests.get(image_url, timeout=5)
    image = Image.open(BytesIO(response.content)).convert("RGB")

    with torch.no_grad():
        embedding = clip_model.encode(
            image,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

    return embedding


# -------------------------
# TEXT EMBEDDING (SEARCH)
# -------------------------
@lru_cache(maxsize=2048)
def get_text_embedding(text: str) -> np.ndarray:
    """
    Cached text embedding for fast search.
    """
    if len(text.strip()) < 2:
        # 🚫 Skip useless queries
        return np.zeros(512, dtype=np.float32)

    with torch.no_grad():
        embedding = clip_model.encode(
            text,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

    return embedding
