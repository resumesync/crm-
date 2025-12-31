from fastapi import APIRouter, Depends, HTTPException
from database import get_supabase
from auth import get_current_user, get_user_organization
from models import Organization, OrganizationUpdate, TeamMember, TeamMemberInvite, UsageStats

router = APIRouter(prefix="/organizations", tags=["organizations"])

@router.get("/current", response_model=Organization)
async def get_current_organization(
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Get current user's organization"""
    return org_context["organization"]

@router.put("/current", response_model=Organization)
async def update_organization(
    org_update: OrganizationUpdate,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Update organization (admin/owner only)"""
    if org_context["role"] not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    try:
        organization_id = org_context["organization_id"]
        update_data = org_update.model_dump(exclude_unset=True)
        
        result = supabase.table("organizations")\
            .update(update_data)\
            .eq("id", organization_id)\
            .execute()
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/members", response_model=list[TeamMember])
async def get_team_members(
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Get all team members"""
    try:
        organization_id = org_context["organization_id"]
        
        result = supabase.table("organization_members")\
            .select("*, users:user_id(email, raw_user_meta_data)")\
            .eq("organization_id", organization_id)\
            .execute()
        
        # Format response
        members = []
        for member in result.data:
            user_data = member.get("users", {})
            members.append({
                "id": member["id"],
                "user_id": member["user_id"],
                "organization_id": member["organization_id"],
                "role": member["role"],
                "joined_at": member["joined_at"],
                "user_name": user_data.get("raw_user_meta_data", {}).get("full_name"),
                "user_email": user_data.get("email")
            })
        
        return members
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/members/invite")
async def invite_team_member(
    invite: TeamMemberInvite,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Invite a new team member (admin/owner only)"""
    if org_context["role"] not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    try:
        # TODO: Send invitation email
        # For now, just return success
        return {
            "message": f"Invitation sent to {invite.email}",
            "email": invite.email,
            "role": invite.role
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/members/{member_id}")
async def remove_team_member(
    member_id: str,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Remove a team member (admin/owner only)"""
    if org_context["role"] not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    try:
        organization_id = org_context["organization_id"]
        
        result = supabase.table("organization_members")\
            .delete()\
            .eq("id", member_id)\
            .eq("organization_id", organization_id)\
            .execute()
        
        return {"message": "Team member removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/usage", response_model=UsageStats)
async def get_usage_stats(
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Get organization usage statistics"""
    try:
        organization_id = org_context["organization_id"]
        org = org_context["organization"]
        
        # Count leads this month
        from datetime import datetime, timedelta
        month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0)
        
        leads_result = supabase.table("leads")\
            .select("id", count="exact")\
            .eq("organization_id", organization_id)\
            .gte("created_at", month_start.isoformat())\
            .execute()
        
        # Count team members
        members_result = supabase.table("organization_members")\
            .select("id", count="exact")\
            .eq("organization_id", organization_id)\
            .execute()
        
        # Define limits based on tier
        tier_limits = {
            "free": {"leads": 50, "users": 1, "storage": 0.5},
            "pro": {"leads": 500, "users": 5, "storage": 10},
            "enterprise": {"leads": 999999, "users": 999, "storage": 1000}
        }
        
        tier = org.get("subscription_tier", "free")
        limits = tier_limits.get(tier, tier_limits["free"])
        
        return {
            "leads_count": leads_result.count or 0,
            "leads_limit": limits["leads"],
            "users_count": members_result.count or 0,
            "users_limit": limits["users"],
            "storage_used_gb": 0.0,  # TODO: Calculate actual storage
            "storage_limit_gb": limits["storage"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
