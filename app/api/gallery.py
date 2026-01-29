from fastapi import APIRouter
from app.db.database import SessionLocal
from app.models.metadata import Photo

router = APIRouter()

@router.get("/gallery")
def get_gallery():
    session = SessionLocal()
    photos = session.query(Photo).all()
    session.close()
    return [
        {
            "uuid": str(p.uuid),
            "image_url": p.image_url,
            "caption": p.caption or "",
            "tags": p.tags or []
        }
        for p in photos
    ]
