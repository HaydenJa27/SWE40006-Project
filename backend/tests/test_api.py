import os
os.environ["TESTING"] = "True"

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models.item import Item

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "database": "connected"}

def test_create_and_get_item():
    payload = {
        "name": "Test Laptop",
        "description": "Dev workstation unit",
        "price": 1200.5,
        "quantity": 10
    }
    res_create = client.post("/api/v1/items", json=payload)
    assert res_create.status_code == 201
    data = res_create.json()
    assert data["name"] == payload["name"]
    item_id = data["id"]

    res_get = client.get(f"/api/v1/items/{item_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == item_id

def test_get_all_items():
    client.post("/api/v1/items", json={"name": "Item A", "price": 15.0, "quantity": 5})
    client.post("/api/v1/items", json={"name": "Item B", "price": 25.0, "quantity": 8})
    res = client.get("/api/v1/items")
    assert res.status_code == 200
    assert len(res.json()) >= 2

def test_update_item():
    res_create = client.post("/api/v1/items", json={"name": "Initial Name", "price": 10.0, "quantity": 2})
    item_id = res_create.json()["id"]
    
    update_payload = {"name": "Updated Name", "price": 20.0}
    res_update = client.put(f"/api/v1/items/{item_id}", json=update_payload)
    assert res_update.status_code == 200
    assert res_update.json()["name"] == "Updated Name"
    assert res_update.json()["price"] == 20.0

def test_delete_item():
    res_create = client.post("/api/v1/items", json={"name": "Obsolete Item", "price": 5.0, "quantity": 1})
    item_id = res_create.json()["id"]
    
    res_delete = client.delete(f"/api/v1/items/{item_id}")
    assert res_delete.status_code == 204
    assert client.get(f"/api/v1/items/{item_id}").status_code == 404

def test_item_not_found():
    assert client.get("/api/v1/items/9999").status_code == 404
    assert client.put("/api/v1/items/9999", json={"name": "Nonexistent"}).status_code == 404
    assert client.delete("/api/v1/items/9999").status_code == 404