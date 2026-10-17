import asyncio
import random
import httpx

BASE_URL = "http://mock-backend:8000"

ENDPOINTS = [
    "/",
    "/health",
    "/items",
    "/items/1",
    "/items/2",
    "/items/999",
    "/slow",
    "/error"
]


async def generate_request(client):

    endpoint = random.choice(ENDPOINTS)

    try:
        response = await client.get(f"{BASE_URL}{endpoint}")

        print(
            f"{endpoint} -> {response.status_code}"
        )

    except httpx.RequestError as error:
        print(f"Request failed: {error}")


async def main():

    async with httpx.AsyncClient(timeout=10) as client:

        for _ in range(100):

            await generate_request(client)

            await asyncio.sleep(0.2)


if __name__ == "__main__":
    asyncio.run(main())