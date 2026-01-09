import faiss
import numpy as np
import os
import pickle

DIMENSION = 384 
INDEX_DIR = "faiss_index"
INDEX_PATH = os.path.join(INDEX_DIR, "index.faiss")
META_PATH = os.path.join(INDEX_DIR, "metadata.pkl")
BASE_URL = "https://myserver.com/static/images/"
# Ensure the directory exists
os.makedirs(INDEX_DIR, exist_ok=True)

# Load or create FAISS index
if os.path.exists(INDEX_PATH):
    index = faiss.read_index(INDEX_PATH)
    if os.path.exists(META_PATH):
        with open(META_PATH, "rb") as f:
            metadata = pickle.load(f)
    else:
        metadata = []
else:
    index = faiss.IndexFlatL2(DIMENSION)
    metadata = []

def add_vector(vector: np.ndarray, image_path: str):
    index.add(vector.reshape(1, -1))
    metadata.append(image_path)

    # Save index and metadata
    faiss.write_index(index, INDEX_PATH)
    with open(META_PATH, "wb") as f:
        pickle.dump(metadata, f)

def search_vector(query_vector: np.ndarray, top_k=5):
    distances, indices = index.search(query_vector.reshape(1, -1), top_k)
    results = [BASE_URL + os.path.basename(metadata[i]) for i in indices[0] if i < len(metadata)]
    return results
