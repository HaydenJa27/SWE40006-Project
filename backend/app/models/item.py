from sqlalchemy import CheckConstraint, Column, Computed, Double, Identity, Integer, String, text
from app.database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, Identity(always=False), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    price = Column(Double, nullable=False)
    quantity = Column(Integer, nullable=False, default=0, server_default=text("0"))
    status = Column(
        String(20),
        Computed(
            "CASE "
            "WHEN quantity <= 0 THEN 'Out of Stock' "
            "WHEN quantity <= 5 THEN 'Low Stock' "
            "ELSE 'In Stock' "
            "END",
            persisted=True,
        ),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint("quantity >= 0", name="ck_items_quantity_non_negative"),
    )
