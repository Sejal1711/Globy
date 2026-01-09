from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
from app.services.embedding import get_text_embedding
from app.services.vector_store import add_vector

# Load model ONCE globally
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def generate_caption_and_store(image_path: str) -> str:
    image = Image.open(image_path).convert("RGB")
    inputs = processor(image, return_tensors="pt").to(device)
    output = model.generate(**inputs, max_length=50)
    caption = processor.decode(output[0], skip_special_tokens=True)

    # convert caption to embedding and store in FAISS
    embedding = get_text_embedding(caption)
    add_vector(embedding, image_path)

    return caption
