from fastapi import APIRouter, HTTPException, Query
from app.services.embedding import get_text_embedding
from app.services.vector_store import search_vector

router = APIRouter()

@router.get("/search")
def search_images(query: str = Query(..., min_length=1, description="Search query text")):
    """
    Search indexed images based on a text query.

    Parameters:
    - query: text string to search for similar images
    """
    try:
        # 1. Convert the query to an embedding
        query_embedding = get_text_embedding(query)

        # 2. Search FAISS index for top results
        results = search_vector(query_embedding, top_k=5)

        if not results:
            return {
                "query": query,
                "results": [],
                "message": "No similar images found"
            }

        return {
            "query": query,
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching images: {str(e)}")
