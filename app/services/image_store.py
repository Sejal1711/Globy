import os
import uuid
from fastapi import UploadFile
from PIL import Image

UPLOAD_DIR = "images/uploaded"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_image(image: UploadFile):
    try:
        # Open image (this validates it)
        img = Image.open(image.file)
        img.convert("RGB")  # ensures image is readable
    except Exception:
        raise ValueError("Invalid image file")

    # Reset file pointer
    image.file.seek(0)

    # Generate unique filename
    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Save image
    with open(file_path, "wb") as f:
        f.write(image.file.read())

    return {
        "filename": filename,
        "path": file_path
    }
