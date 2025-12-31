from fastapi import APIRouter, Depends, HTTPException
from database import get_supabase
from auth import get_current_user, get_user_organization
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/notes", tags=["notes"])

# Models
class NoteCreate(BaseModel):
    lead_id: str
    content: str

class NoteUpdate(BaseModel):
    content: str

class Note(BaseModel):
    id: str
    lead_id: str
    content: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

@router.get("/lead/{lead_id}")
async def get_lead_notes(
    lead_id: str,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Get all notes for a specific lead"""
    try:
        organization_id = org_context["organization_id"]
        
        # Verify lead belongs to organization
        lead = supabase.table("leads")\
            .select("id")\
            .eq("id", lead_id)\
            .eq("organization_id", organization_id)\
            .single()\
            .execute()
        
        if not lead.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Get notes
        result = supabase.table("notes")\
            .select("*")\
            .eq("lead_id", lead_id)\
            .order("created_at", desc=True)\
            .execute()
        
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Note)
async def create_note(
    note: NoteCreate,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Create a new note for a lead"""
    try:
        organization_id = org_context["organization_id"]
        
        # Verify lead belongs to organization
        lead = supabase.table("leads")\
            .select("id")\
            .eq("id", note.lead_id)\
            .eq("organization_id", organization_id)\
            .single()\
            .execute()
        
        if not lead.data:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        # Create note
        note_data = {
            "lead_id": note.lead_id,
            "content": note.content,
            "created_by": user.id
        }
        
        result = supabase.table("notes")\
            .insert(note_data)\
            .execute()
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{note_id}", response_model=Note)
async def update_note(
    note_id: str,
    note_update: NoteUpdate,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Update an existing note"""
    try:
        # Verify note exists and belongs to user's organization
        note = supabase.table("notes")\
            .select("*, leads!inner(organization_id)")\
            .eq("id", note_id)\
            .single()\
            .execute()
        
        if not note.data:
            raise HTTPException(status_code=404, detail="Note not found")
        
        if note.data["leads"]["organization_id"] != org_context["organization_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        # Update note
        result = supabase.table("notes")\
            .update({"content": note_update.content})\
            .eq("id", note_id)\
            .execute()
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{note_id}")
async def delete_note(
    note_id: str,
    user = Depends(get_current_user),
    org_context = Depends(get_user_organization),
    supabase = Depends(get_supabase)
):
    """Delete a note"""
    try:
        # Verify note exists and belongs to user's organization
        note = supabase.table("notes")\
            .select("*, leads!inner(organization_id)")\
            .eq("id", note_id)\
            .single()\
            .execute()
        
        if not note.data:
            raise HTTPException(status_code=404, detail="Note not found")
        
        if note.data["leads"]["organization_id"] != org_context["organization_id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        # Delete note
        supabase.table("notes")\
            .delete()\
            .eq("id", note_id)\
            .execute()
        
        return {"message": "Note deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
