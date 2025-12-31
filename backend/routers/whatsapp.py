"""
WhatsApp API Router
Endpoints for WhatsApp messaging functionality
"""
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


class SendMessageRequest(BaseModel):
    """Request model for sending a single message"""
    phone: str  # Phone number with country code (e.g., "919876543210")
    message: str


class SendTemplateRequest(BaseModel):
    """Request model for sending a template message"""
    phone: str
    template_name: str
    language_code: str = "en"
    components: Optional[List[Dict[str, Any]]] = None


class BulkMessageRequest(BaseModel):
    """Request model for sending bulk messages"""
    recipients: List[str]  # List of phone numbers
    message: str
    delay_ms: int = 1000  # Delay between messages


class WhatsAppConfigRequest(BaseModel):
    """Request model for saving WhatsApp configuration"""
    access_token: str
    phone_number_id: str
    business_account_id: Optional[str] = None
    webhook_verify_token: Optional[str] = None


class TestConnectionRequest(BaseModel):
    """Request model for testing WhatsApp connection"""
    access_token: str
    phone_number_id: str


def get_whatsapp_service():
    """Get WhatsApp service instance"""
    from services.whatsapp_service import create_whatsapp_service
    service = create_whatsapp_service()
    if not service:
        raise HTTPException(
            status_code=503,
            detail="WhatsApp API not configured. Please add your credentials in Settings > Integrations."
        )
    return service


@router.get("/status")
async def get_whatsapp_status():
    """Get WhatsApp API configuration status"""
    access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    
    return {
        "configured": bool(access_token and phone_number_id),
        "phone_number_id": phone_number_id[:8] + "..." if phone_number_id else None,
        "has_business_account": bool(os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID"))
    }


@router.post("/test-connection")
async def test_whatsapp_connection(request: TestConnectionRequest):
    """Test WhatsApp API connection with provided credentials"""
    import httpx
    
    url = f"https://graph.facebook.com/v18.0/{request.phone_number_id}"
    headers = {
        "Authorization": f"Bearer {request.access_token}"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    "success": True,
                    "phone_number": data.get("display_phone_number"),
                    "verified_name": data.get("verified_name"),
                    "quality_rating": data.get("quality_rating")
                }
            else:
                return {
                    "success": False,
                    "error": response.json().get("error", {}).get("message", "Unknown error"),
                    "status_code": response.status_code
                }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }


@router.post("/send")
async def send_message(request: SendMessageRequest):
    """Send a single WhatsApp text message"""
    service = get_whatsapp_service()
    result = await service.send_text_message(request.phone, request.message)
    
    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Failed to send message")
        )
    
    return result


@router.post("/send-template")
async def send_template_message(request: SendTemplateRequest):
    """Send a WhatsApp template message"""
    service = get_whatsapp_service()
    result = await service.send_template_message(
        to=request.phone,
        template_name=request.template_name,
        language_code=request.language_code,
        components=request.components
    )
    
    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Failed to send template")
        )
    
    return result


@router.post("/send-bulk")
async def send_bulk_messages(request: BulkMessageRequest, background_tasks: BackgroundTasks):
    """
    Send bulk WhatsApp messages (runs in background)
    Returns immediately with a job ID
    """
    service = get_whatsapp_service()
    
    # For immediate response, we could use background tasks
    # For now, we'll process synchronously for simplicity
    result = await service.send_bulk_messages(
        recipients=request.recipients,
        message=request.message,
        delay_ms=request.delay_ms
    )
    
    return result


@router.get("/templates")
async def get_templates():
    """Get list of approved WhatsApp message templates"""
    service = get_whatsapp_service()
    result = await service.get_message_templates()
    
    if not result.get("success"):
        raise HTTPException(
            status_code=400,
            detail=result.get("error", "Failed to fetch templates")
        )
    
    return result


@router.get("/webhook")
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    """
    Webhook verification endpoint for Meta
    This is called by Meta when setting up the webhook
    """
    verify_token = os.getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN", "default_verify_token")
    
    if hub_mode == "subscribe" and hub_verify_token == verify_token:
        return int(hub_challenge)
    
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/webhook")
async def receive_webhook(payload: Dict[str, Any]):
    """
    Webhook endpoint to receive incoming WhatsApp messages and status updates
    """
    # Log the incoming webhook
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Received WhatsApp webhook: {payload}")
    
    # Process the webhook payload
    try:
        entry = payload.get("entry", [])
        for e in entry:
            changes = e.get("changes", [])
            for change in changes:
                value = change.get("value", {})
                
                # Handle incoming messages
                messages = value.get("messages", [])
                for message in messages:
                    # Process incoming message
                    logger.info(f"Incoming message: {message}")
                    # Here you would save to database, trigger notifications, etc.
                
                # Handle message status updates
                statuses = value.get("statuses", [])
                for status in statuses:
                    logger.info(f"Message status update: {status}")
                    # Update message status in database
        
        return {"status": "received"}
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return {"status": "error", "message": str(e)}
