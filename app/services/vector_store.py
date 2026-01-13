from app.db.database import SessionLocal
from app.models.metadata import Photo
import faiss
import numpy as np
import os

DIMENSION = 384
INDEX_DIR = "faiss_index"
INDEX_PATH = os.path.join(INDEX_DIR, "index.faiss")
BASE_URL = "http://127.0.0.1:8000/static/images/"

os.makedirs(INDEX_DIR, exist_ok=True)

# Load or create FAISS index
if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
else:
    index = faiss.IndexFlatL2(DIMENSION)

def add_vector(vector: np.ndarray, image_path: str, caption: str):
    index.add(vector.reshape(1, -1))
    faiss_id = index.ntotal - 1

    image_url = BASE_URL + os.path.basename(image_path)

    # SQLAlchemy session
    session = SessionLocal()
    photo = Photo(
        faiss_id=faiss_id,
        image_path=image_path,
        image_url=image_url,
        caption=caption
    )
    session.add(photo)
    session.commit()
    session.close()

    faiss.write_index(index, INDEX_PATH)

def search_vector(query_vector: np.ndarray, top_k=5):
    distances, indices = index.search(query_vector.reshape(1, -1), top_k)
    results = []

    session = SessionLocal()
    for faiss_id in indices[0]:
        photo = session.query(Photo).filter(Photo.faiss_id == int(faiss_id)).first()
        if photo:
            results.append(photo.image_url)
    session.close()
    return results
