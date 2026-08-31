from typing import Optional
from pydantic import BaseModel
from app.models.user import UserRole
from app.schemas.user import UserResponse


class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: UserRole = UserRole.PRODUCT_USER
    product_code: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user: UserResponse
