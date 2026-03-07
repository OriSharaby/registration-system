import httpx

from core.config import AI_SERVICE_URL, DEBUG, TIMEOUT


async def get_toast_message(
    fallback: str = "You have successfully registered!",
) -> str:
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(AI_SERVICE_URL)
            resp.raise_for_status()
            data = resp.json()

        msg = data.get("message") if isinstance(data, dict) else None
        if isinstance(msg, str) and msg.strip():
            return msg.strip()

    except Exception as e:
        if DEBUG:
            print("[Python API] AI toast failed -> fallback:", repr(e))

    return fallback