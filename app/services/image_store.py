# import os
# import uuid
# from fastapi import UploadFile
# from PIL import Image

# UPLOAD_DIR = "images/uploaded"
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# # image_store.py
# def save_image(image: UploadFile):
#     try:
#         img = Image.open(image.file).convert("RGB")
#     except Exception:
#         raise ValueError("Invalid image file")

#     image.file.seek(0)
#     image_uuid = str(uuid.uuid4())
#     ext = image.filename.split(".")[-1]
#     filename = f"{image_uuid}.{ext}"
#     file_path = os.path.join(UPLOAD_DIR, filename)

#     with open(file_path, "wb") as f:
#         f.write(image.file.read())

#     return {"uuid": image_uuid, "filename": filename, "path": file_path}
