from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.captioning import generate_caption_and_store

router = APIRouter()

# route
@router.post("/index-photo")
async def index_photo(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    try:
        data = save_image(image)
        caption = generate_caption_and_store(data["path"], data["uuid"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Image indexed successfully",
        "uuid": data["uuid"],
        "filename": data["filename"],
        "caption": caption,
        "image_url": f"http://127.0.0.1:8000/static/images/{data['filename']}"
    }

