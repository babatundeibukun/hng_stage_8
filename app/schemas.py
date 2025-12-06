from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# Google Auth Schemas
class GoogleAuthURLResponse(BaseModel):
    google_auth_url: str


class GoogleCallbackResponse(BaseModel):
    user_id: str
    email: str
    name: Optional[str] = None


# Paystack Payment Schemas
class PaymentInitiateRequest(BaseModel):
    amount: int = Field(..., gt=0, description="Amount in kobo (lowest currency unit)")
    email: str = Field(..., description="Customer email address")


class PaymentInitiateResponse(BaseModel):
    reference: str
    authorization_url: str


class TransactionStatusResponse(BaseModel):
    reference: str
    status: str
    amount: int
    paid_at: Optional[datetime] = None


class WebhookResponse(BaseModel):
    status: bool
