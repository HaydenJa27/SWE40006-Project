from pydantic import BaseModel, ConfigDict
from typing import Optional

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None

class ItemResponse(ItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)