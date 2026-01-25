from sqlalchemy import Column, Integer, String, DateTime, JSON
from app.db.database import Base
from datetime import datetime

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, nullable=False)
    faiss_id = Column(Integer, unique=True, index=True)
    image_path = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=False)
    tags = Column(JSON, nullable=True)  # ✅ NEW FIELD
    created_at = Column(DateTime, default=datetime.utcnow)
