import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import index, search, photos
import uvicorn

# --- FastAPI app ---
app = FastAPI(
    title="Semantic Photo Search API",
    version="1.0.0"
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  
        "http://localhost:5173", 
        "https://globy-ui.vercel.app"  # your deployed frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---
app.include_router(index.router, prefix="/api")
app.include_router(search.router, prefix="/api")
app.include_router(photos.router, prefix="/api")

# --- Health check ---
@app.get("/")
def health_check():
    return {"status": "running", "message": "Semantic Photo Search API is live"}

# --- Static images ---
images_dir = os.path.join("images", "uploaded")
if not os.path.exists(images_dir):
    os.makedirs(images_dir, exist_ok=True)

app.mount("/static/images", StaticFiles(directory=images_dir), name="images")

# --- Run app ---
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
