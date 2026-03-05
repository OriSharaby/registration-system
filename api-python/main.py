from dotenv import load_dotenv
load_dotenv()

import os
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field


AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:4001/random-toast")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

TIMEOUT = httpx.Timeout(connect=2.0, read=4.0, write=2.0, pool=2.0)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserPublic(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr


class RegisterResponse(BaseModel):
    ok: bool
    message: str
    user: UserPublic
    toast: str


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

        if DEBUG:
            print("[Python API] Invalid AI response payload:", data)

    except Exception as e:
        if DEBUG:
            print("[Python API] AI toast failed -> fallback:", repr(e))

    return fallback


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/auth/register", response_model=RegisterResponse)
async def register(user: RegisterRequest):
    toast_message = await get_toast_message()

    return RegisterResponse(
        ok=True,
        message="User registered successfully",
        user=UserPublic(name=user.name, email=user.email),
        toast=toast_message,
    )