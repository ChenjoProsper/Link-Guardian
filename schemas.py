
from pydantic import BaseModel,EmailStr,Field

from datetime import datetime

from typing import List

class LinkBase(BaseModel):
    url: str
    description: str | None = None

class LinkCreate(LinkBase):
    pass

class LinkSchema(LinkBase):
    id: int
    date_ajout: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(min_length=6,max_length=72,description="Password must be between 8 and 72 characters long")

class UserSchema(UserBase):
    id: int
    links: List[LinkSchema] = []

    class Config:
        from_attributes = True

