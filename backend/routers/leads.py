from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from database import get_supabase
from auth import get_current_user, get_user_organization
from models import Lead, LeadCreate, LeadUpdate, LeadListResponse, LeadStatus

router = APIRouter(prefix="/leads", tags=["leads"])

@router.get("/", response_model=LeadListResponse)
async def get_leads(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[LeadStatus] = None,
    source: Optional[str] = None,
    search: Optional[str] = None,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Get all leads for the organization"""
    try:
        organization_id = org_context["organization_id"]
        
        # Build query
        query = supabase.table("leads")\
            .select("*", count="exact")\
            .eq("organization_id", organization_id)
        
        # Apply filters
        if status:
            query = query.eq("status", status.value)
        if source:
            query = query.eq("source", source)
        if search:
            query = query.or_(f"name.ilike.%{search}%,phone.ilike.%{search}%,email.ilike.%{search}%")
        
        # Pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)\
            .order("created_at", desc=True)
        
        result = query.execute()
        
        return {
            "leads": result.data,
            "total": result.count or 0,
            "page": page,
            "page_size": page_size
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{lead_id}", response_model=Lead)
async def get_lead(
    lead_id: str,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Get a specific lead"""
    try:
        organization_id = org_context["organization_id"]
        
        result = supabase.table("leads")\
            .select("*")\
            .eq("id", lead_id)\
            .eq("organization_id", organization_id)\
            .single()\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Lead)
async def create_lead(
    lead: LeadCreate,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Create a new lead"""
    try:
        organization_id = org_context["organization_id"]
        
        lead_data = lead.model_dump()
        lead_data["organization_id"] = organization_id
        lead_data["created _by"] = user.id
        
        result = supabase.table("leads")\
            .insert(lead_data)\
            .execute()
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{lead_id}", response_model=Lead)
async def update_lead(
    lead_id: str,
    lead_update: LeadUpdate,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Update a lead"""
    try:
        organization_id = org_context["organization_id"]
        
        # Verify lead belongs to organization
        existing = supabase.table("leads")\
            .select("id")\
            .eq("id", lead_id)\
            .eq("organization_id", organization_id)\
            .single()\
            .execute()
        
        if not existing.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Update lead
        update_data = lead_update.model_dump(exclude_unset=True)
        result = supabase.table("leads")\
            .update(update_data)\
            .eq("id", lead_id)\
            .execute()
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{lead_id}")
async def delete_lead(
    lead_id: str,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Delete a lead (admin/owner only)"""
    try:
        if org_context["role"] not in ["owner", "admin"]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        
        organization_id = org_context["organization_id"]
        
        result = supabase.table("leads")\
            .delete()\
            .eq("id", lead_id)\
            .eq("organization_id", organization_id)\
            .execute()
        
        return {"message": "Lead deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
