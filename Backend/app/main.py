from fastapi import FastAPI


app = FastAPI(

    title="Trip Planner API",
    description="API for planning and managing trips.",
    version="1.0.0",
)


@app.get("/")
def home():
    return {"message": "Welcome to Trip Planner API!"}