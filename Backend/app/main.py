from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from . import models
from .routers import trips, destinations


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Trip Planner API",
    description="API for planning and managing trips",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(trips.router)
app.include_router(destinations.router)


@app.get("/")
def home():
    return {
        "message": "Welcome to Trip Planner API!"
    }