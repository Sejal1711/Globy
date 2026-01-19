from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
from app.services.embedding import get_text_embedding
from app.services.vector_store import add_vector
from app.db.database import SessionLocal
from app.models.metadata import Photo

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

# captioning.py
def generate_caption_and_store(image_path: str, image_uuid: str) -> str:
    image = Image.open(image_path).convert("RGB")
    inputs = processor(image, return_tensors="pt").to(device)
    output = model.generate(**inputs, max_length=50)
    caption = processor.decode(output[0], skip_special_tokens=True)

    # This is where the DB insertion happens
    embedding = get_text_embedding(caption)
    add_vector(embedding, image_uuid, image_path, caption)

    return caption

