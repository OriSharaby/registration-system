import os
import httpx

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://localhost:4001/random-toast")

async def get_toast_message(fallback: str = "You have successfully registered!") -> str:
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            resp = await client.get(AI_SERVICE_URL)
            resp.raise_for_status()
            data = resp.json()

            if isinstance(data, dict) and isinstance(data.get("message"), str):
                return data["message"]
    except Exception:
        pass

    return fallback