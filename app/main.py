from fastapi import FastAPI
from app.api import index, search


app = FastAPI(
    title="Semantic Photo Search API",
    version="1.0.0"
)

# include routers
app.include_router(index.router, prefix="/api")
app.include_router(search.router, prefix="/api")

@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "Semantic Photo Search API is live"
    }
