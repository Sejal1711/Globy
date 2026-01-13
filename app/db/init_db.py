from app.db.database import engine, Base
from app.models.metadata import Photo

Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
