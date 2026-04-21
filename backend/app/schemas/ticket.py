from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from uuid import UUID


class TicketCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, example="Rahul Sharma")
    email: EmailStr = Field(..., example="rahul@example.com")
    subject: str = Field(..., min_length=5, max_length=300, example="Payment not processed")
    message: str = Field(..., min_length=10, max_length=5000, example="My payment was deducted but account not updated.")


class TicketResponse(BaseModel):
    id: UUID
    name: str
    email: str
    subject: str
    message: str
    category: Optional[str] = None
    ai_reply: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TicketUpdate(BaseModel):
    category: Optional[str] = Field(None, example="billing")
    ai_reply: Optional[str] = Field(None, example="Dear Rahul, we have processed your request...")
    status: Optional[str] = Field(None, example="resolved")


class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[TicketResponse] = None