from sentence_transformers import SentenceTransformer
import numpy as np
import re

clip_model = SentenceTransformer("clip-ViT-B-32")

TAG_VOCAB = [
    "person", "people", "selfie", "friends", "family",
    "dog", "cat", "animal",
    "beach", "mountain", "river", "forest", "city", "street",
    "food", "drink", "coffee", "cake",
    "car", "bike", "travel", "vacation",
    "sunset", "sunrise", "night", "sky",
    "party", "wedding", "birthday",
    "nature", "portrait", "landscape"
]

tag_embeddings = clip_model.encode(TAG_VOCAB, normalize_embeddings=True)

def extract_keywords_from_caption(caption: str):
    words = re.findall(r"\b[a-zA-Z]{4,}\b", caption.lower())
    return list(set(words))

def generate_tags(image_embedding: np.ndarray, caption: str, top_k=5):
    image_embedding = image_embedding / np.linalg.norm(image_embedding)

    # 1️⃣ CLIP similarity tags
    scores = np.dot(tag_embeddings, image_embedding)
    top_indices = scores.argsort()[-top_k:][::-1]
    clip_tags = [TAG_VOCAB[i] for i in top_indices if scores[i] > 0.25]

    # 2️⃣ Caption keywords
    caption_tags = extract_keywords_from_caption(caption)

    # 3️⃣ Merge + clean
    all_tags = list(set(clip_tags + caption_tags))
    return all_tags
