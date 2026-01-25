from fastapi import APIRouter, HTTPException, Query
from app.services.embedding import get_text_embedding
from app.services.vector_store import search_vector

router = APIRouter()

@router.get("/search")
def search_images(
    query: str = Query(..., min_length=1, description="Search query text"),
    tag: str = Query(None, description="Optional tag filter"),
):
    try:
        query_embedding = get_text_embedding(query)
        results = search_vector(query_embedding, top_k=20)

        # ✅ Filter by tag if provided
        if tag:
            results = [r for r in results if r.get("tags") and tag in r["tags"]]

        serializable_results = [
            {
                "uuid": str(r["uuid"]),
                "image_url": r["image_url"],
                "caption": r["caption"],
                "tags": r["tags"],
            }
            for r in results
        ]

        return {
            "query": query,
            "tag": tag,
            "results": serializable_results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching images: {str(e)}")
