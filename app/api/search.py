from fastapi import APIRouter, HTTPException, Query
from app.services.embedding import get_text_embedding
from app.services.vector_store import search_vector

router = APIRouter()

@router.get("/search")
def search_images(query: str = Query(..., min_length=1, description="Search query text")):
    """
    Search indexed images based on a text query.
    """
    try:
        query_embedding = get_text_embedding(query)
        results = search_vector(query_embedding, top_k=5)

        print("Search results:", results)  # ✅ this will now run

        return {
            "query": query,
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching images: {str(e)}")

