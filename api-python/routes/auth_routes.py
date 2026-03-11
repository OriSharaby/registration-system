from datetime import datetime

from fastapi import APIRouter, HTTPException
from pymongo.errors import DuplicateKeyError

from db import users_col
from auth_utils import hash_password, verify_password
from models.auth_models import (
    RegisterRequest,
    RegisterResponse,
    UserPublic,
    LoginRequest,
    LoginResponse,
)
from services.auth_service import create_access_token
from services.ai_service import get_toast_message

router = APIRouter()


@router.post("/auth/register", response_model=RegisterResponse)
async def register(user: RegisterRequest):
    existing_user = users_col.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists")

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password),
        "createdAt": datetime.utcnow(),
    }

    try:
        users_col.insert_one(new_user)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Email already exists")

    toast_message = await get_toast_message()

    return RegisterResponse(
        ok=True,
        message="User registered successfully",
        user=UserPublic(name=user.name, email=user.email),
        toast=toast_message,
    )


@router.post("/auth/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    user = users_col.find_one({"email": body.email})

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({
        "sub": str(user["_id"]),
        "email": user["email"]
    })

    return LoginResponse(
        ok=True,
        token=token,
        user=UserPublic(name=user["name"], email=user["email"])
    )