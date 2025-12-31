from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class SubscriptionStatus(str, Enum):
    TRIAL = "trial"
    ACTIVE = "active"
    CANCELLED = "cancelled"
    PAST_DUE = "past_due"

class UserRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    MANAGER = "manager"
    AGENT = "agent"

class LeadStatus(str, Enum):
    NEW = "new"
    CONTACTED = "contacted"
    QUALIFIED = "qualified"
    CONVERTED = "converted"
    LOST = "lost"

class LeadSource(str, Enum):
    META = "meta"
    GOOGLE = "google"
    MANUAL = "manual"
    WEBSITE = "website"
    REFERRAL = "referral"

# Organization Models
class OrganizationBase(BaseModel):
    name: str
    slug: str
    logo_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = {}

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    settings: Optional[Dict[str, Any]] = None

class Organization(OrganizationBase):
    id: str
    subscription_tier: SubscriptionTier
    subscription_status: SubscriptionStatus
    trial_ends_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

# Lead Models
class LeadBase(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    alternate_phone: Optional[str] = None
    whatsapp_number: Optional[str] = None
    service: str
    clinic_name: str
    city: str
    state: Optional[str] = None
    pincode: Optional[str] = None
    address: Optional[str] = None
    source: LeadSource
    status: LeadStatus = LeadStatus.NEW
    assigned_to: Optional[str] = None
    birthday: Optional[datetime] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    company_name: Optional[str] = None
    referred_by: Optional[str] = None
    language_preference: Optional[str] = None
    best_time_to_call: Optional[str] = None
    previous_clinic_visited: Optional[bool] = False
    budget: Optional[str] = None
    urgency: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None
    google_data: Optional[Dict[str, Any]] = None

class LeadCreate(LeadBase):
    organization_id: str

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    status: Optional[LeadStatus] = None
    assigned_to: Optional[str] = None
    # ... all other fields as optional

class Lead(LeadBase):
    id: str
    organization_id: str
    created_by: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Team Member Models
class TeamMemberBase(BaseModel):
    user_id: str
    role: UserRole

class TeamMemberInvite(BaseModel):
    email: EmailStr
    role: UserRole

class TeamMember(TeamMemberBase):
    id: str
    organization_id: str
    joined_at: datetime
    user_name: Optional[str] = None
    user_email: Optional[str] = None

    class Config:
        from_attributes = True

# Response Models
class LeadListResponse(BaseModel):
    leads: list[Lead]
    total: int
    page: int
    page_size: int

class UsageStats(BaseModel):
    leads_count: int
    leads_limit: int
    users_count: int
    users_limit: int
    storage_used_gb: float
    storage_limit_gb: float
