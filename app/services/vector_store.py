import faiss
import numpy as np
import os
from app.db.database import SessionLocal
from app.models.metadata import Photo

DIMENSION = 512
INDEX_DIR = "faiss_index"
INDEX_PATH = os.path.join(INDEX_DIR, "index.faiss")
os.makedirs(INDEX_DIR, exist_ok=True)

# Use inner product for cosine similarity (after normalizing embeddings)
if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
else:
    index = faiss.IndexFlatIP(DIMENSION)

def add_vector(vector: np.ndarray, image_uuid: str, image_url: str, caption: str):
    # Normalize embedding for cosine similarity
    vector = vector / np.linalg.norm(vector)
    
    # Add vector to FAISS index
    index.add(vector.reshape(1, -1))
    faiss_id = index.ntotal - 1  # index position

    # Save metadata to DB
    session = SessionLocal()
    photo = Photo(
        uuid=image_uuid,
        faiss_id=faiss_id,
        image_path=image_url,
        image_url=image_url,
        caption=caption
    )
    session.add(photo)
    session.commit()
    session.close()

    # Persist FAISS index
    faiss.write_index(index, INDEX_PATH)

def search_vector(query_vector: np.ndarray, top_k=5, similarity_threshold=0.3):
    """
    Searches for top_k images similar to query_vector.
    similarity_threshold: minimum cosine similarity to consider relevant
    """
    query_vector = query_vector / np.linalg.norm(query_vector)  # normalize

    # FAISS inner product search (cosine similarity)
    similarities, indices = index.search(query_vector.reshape(1, -1), top_k)
    results = []

    session = SessionLocal()
    for sim, faiss_id in zip(similarities[0], indices[0]):
        if sim < similarity_threshold:  # skip irrelevant results
            continue
        photo = session.query(Photo).filter(Photo.faiss_id == int(faiss_id)).first()
        if photo:
            results.append({
                "uuid": str(photo.uuid),
                "image_url": photo.image_url,
                "caption": photo.caption,
                "similarity": float(sim)  # optional, useful for debugging
            })
    session.close()
    return results
