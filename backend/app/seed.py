from sqlalchemy import text

from app.database import SessionLocal
from app.models.item import Item

# Same catalog as frontend/src/services/api.js. description is left NULL.
SEED_ITEMS = [
    {"id": 101, "name": 'Dell Latitude 5540 15.6" Laptop', "category": "Laptops", "quantity": 4, "price": 1499},
    {"id": 102, "name": 'Apple MacBook Pro 14" M3', "category": "Laptops", "quantity": 2, "price": 2499},
    {"id": 103, "name": "Dell OptiPlex 7010 Micro Desktop", "category": "Desktops", "quantity": 18, "price": 1150},
    {"id": 104, "name": 'Dell UltraSharp 27" 4K Monitor', "category": "Monitors", "quantity": 14, "price": 650},
    {"id": 105, "name": "Keychron K2 Mechanical Keyboard", "category": "Peripherals", "quantity": 25, "price": 149},
    {"id": 106, "name": "Logitech MX Master 3S Wireless Mouse", "category": "Peripherals", "quantity": 30, "price": 169},
    {"id": 107, "name": "Anker USB-C 8-in-1 Hub Adapter", "category": "Accessories", "quantity": 3, "price": 89},
    {"id": 108, "name": "Raspberry Pi 4 Model B (8GB Kit)", "category": "Lab Kits", "quantity": 0, "price": 135},
    {"id": 109, "name": "Cisco Catalyst 1000 24-Port Switch", "category": "Networking", "quantity": 6, "price": 750},
    {"id": 110, "name": "Sony WH-1000XM5 Headset", "category": "Audio / Video", "quantity": 12, "price": 499},
]


def seed_items():
    db = SessionLocal()
    try:
        seed_ids = [item["id"] for item in SEED_ITEMS]
        existing_ids = {
            item_id
            for (item_id,) in db.query(Item.id).filter(Item.id.in_(seed_ids)).all()
        }
        for item in SEED_ITEMS:
            if item["id"] in existing_ids:
                continue
            db.add(
                Item(
                    id=item["id"],
                    name=item["name"],
                    category=item["category"],
                    description=None,
                    price=item["price"],
                    quantity=item["quantity"],
                )
            )
        db.commit()
        _sync_identity_sequence(db)
    finally:
        db.close()


def _sync_identity_sequence(db):
    """Keep the next generated id at 111 or above the current max, whichever is higher."""
    if db.get_bind().dialect.name != "postgresql":
        return
    db.execute(
        text(
            "SELECT setval("
            "pg_get_serial_sequence('items', 'id')::regclass, "
            "(SELECT GREATEST(COALESCE(MAX(id), 1), 110) FROM items)"
            ")"
        )
    )
    db.commit()
