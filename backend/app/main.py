from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from .config import get_settings
from .database import engine, Base
from .routers import auth, items, projects, contexts, families, reviews

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description="A GTD app with family sharing capabilities",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(items.router, prefix="/items", tags=["Items"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(contexts.router, prefix="/contexts", tags=["Contexts"])
app.include_router(families.router, prefix="/families", tags=["Families"])
app.include_router(reviews.router, prefix="/reviews", tags=["Weekly Reviews"])


@app.on_event("startup")
async def startup():
    # Create tables
    Base.metadata.create_all(bind=engine)

    # Add columns that create_all won't add to existing tables
    inspector = inspect(engine)
    columns = [col["name"] for col in inspector.get_columns("users")]
    with engine.begin() as conn:
        if "google_id" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE"))
            conn.execute(text("CREATE INDEX ix_users_google_id ON users (google_id)"))
        if inspector.get_columns("users"):
            for col in inspector.get_columns("users"):
                if col["name"] == "password_hash" and not col["nullable"]:
                    conn.execute(text("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL"))


@app.get("/")
async def root():
    return {"message": "GTD Family SaaS API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
