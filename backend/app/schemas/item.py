from pydantic import BaseModel, ConfigDict
from typing import Optional

class ItemCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    price: float
    quantity: int

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class ItemResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    price: float
    quantity: int
    status: str

    model_config = ConfigDict(from_attributes=True)
