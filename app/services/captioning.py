from app.services.embedding import get_image_embedding
from app.services.vector_store import add_vector
from app.services.tagging import generate_tags
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import requests
from io import BytesIO
import torch

# BLIP setup (for captions only)
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
device = "cuda" if torch.cuda.is_available() else "cpu"
blip_model.to(device)

def generate_caption_and_store(image_url: str, image_uuid: str) -> dict:
    """
    Generates:
    - CLIP embedding (for FAISS)
    - BLIP caption (for UI)
    - AI tags (for filtering)
    """
    # --- 1. Get CLIP embedding ---
    embedding = get_image_embedding(image_url)
    
    # --- 2. Generate BLIP caption ---
    try:
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content)).convert("RGB")
        inputs = processor(image, return_tensors="pt").to(device)
        output = blip_model.generate(**inputs, max_length=50)
        caption = processor.decode(output[0], skip_special_tokens=True)
    except Exception:
        caption = f"Image {image_uuid}"  # fallback

    # --- 3. Generate AI tags ---
    tags = generate_tags(embedding, caption)

    # --- 4. Store in FAISS + DB ---
    add_vector(embedding, image_uuid, image_url, caption, tags)

    return {
        "caption": caption,
        "tags": tags
    }
