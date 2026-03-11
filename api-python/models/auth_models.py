from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserPublic(BaseModel):
    name: str
    email: EmailStr


class RegisterResponse(BaseModel):
    ok: bool
    message: str
    user: UserPublic
    toast: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    ok: bool
    token: str
    user: UserPublic