from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import index, search, photos

app = FastAPI(
    title="Semantic Photo Search API",
    version="1.0.0"
)

# 🔥 CORS (REQUIRED for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:5173",  # (optional) Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(index.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(photos.router, prefix="/api")
# Health check
@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "Semantic Photo Search API is live"
    }

# Static image serving
app.mount(
    "/static/images",
    StaticFiles(directory="images/uploaded"),
    name="images"
)
