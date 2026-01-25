import uuid
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.captioning import generate_caption_and_store

router = APIRouter()

class PhotoUpload(BaseModel):
    image_url: str  
@router.post("/photos/upload")
def upload_photo(data: PhotoUpload):
    image_uuid = str(uuid.uuid4())
    result = generate_caption_and_store(data.image_url, image_uuid)

    return {
        "uuid": image_uuid,
        "caption": result["caption"],
        "tags": result["tags"],
        "image_url": data.image_url
    }
