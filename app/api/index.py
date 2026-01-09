from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.image_store import save_image
from app.services.captioning import generate_caption_and_store

router = APIRouter()

@router.post("/index-photo")
async def index_photo(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid image type")

    try:
        data = save_image(image)
        caption = generate_caption_and_store(data["path"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "message": "Image indexed successfully",
        "filename": data["filename"],
        "caption": caption
    }
