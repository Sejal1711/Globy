from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import Base
from datetime import datetime

class Photo(Base):
    __tablename__ = "photos"

    id = Column(Integer, primary_key=True, index=True)
    faiss_id = Column(Integer, unique=True, index=True)
    image_path = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    caption = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
