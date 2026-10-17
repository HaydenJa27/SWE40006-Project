from fastapi import FastAPI, HTTPException
from prometheus_fastapi_instrumentator import Instrumentator
import asyncio

app = FastAPI(title="Mock Inventory Tracker")

# Enable Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Temporary inventory data
inventory = [
    {"id": 1, "name": "Laptop", "quantity": 10},
    {"id": 2, "name": "Mouse", "quantity": 25},
    {"id": 3, "name": "Keyboard", "quantity": 15}
]


@app.get("/")
def root():
    return {"message": "Mock Inventory Tracker Running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.get("/items")
def get_items():
    return inventory


@app.get("/items/{item_id}")
def get_item(item_id: int):

    for item in inventory:
        if item["id"] == item_id:
            return item

    raise HTTPException(
        status_code=404,
        detail="Item not found"
    )


@app.get("/slow")
async def slow_request():

    # Simulate a slow API response
    await asyncio.sleep(2)

    return {"message": "Slow request completed"}


@app.get("/error")
def simulate_error():

    # Simulate an internal server error
    raise HTTPException(
        status_code=500,
        detail="Simulated server error"
    )