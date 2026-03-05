from fastapi import APIRouter
from app.models.auth_models import RegisterRequest, RegisterResponse, UserPublic
from app.services.ai_service import get_toast_message

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=RegisterResponse)
async def register(user: RegisterRequest):
    toast_message = await get_toast_message()

    return RegisterResponse(
        ok=True,
        message="User registered successfully",
        user=UserPublic(name=user.name, email=user.email),
        toast=toast_message,
    )