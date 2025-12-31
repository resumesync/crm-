"""
WhatsApp Business API (Meta Cloud API) Service
Handles sending messages via WhatsApp Business Cloud API
"""
import httpx
import logging
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import os

logger = logging.getLogger(__name__)

# WhatsApp Cloud API Configuration
WHATSAPP_API_VERSION = "v18.0"
WHATSAPP_API_BASE_URL = f"https://graph.facebook.com/{WHATSAPP_API_VERSION}"


class WhatsAppConfig(BaseModel):
    """WhatsApp API Configuration"""
    access_token: str
    phone_number_id: str
    business_account_id: Optional[str] = None
    webhook_verify_token: Optional[str] = None


class WhatsAppMessage(BaseModel):
    """WhatsApp Message Model"""
    to: str  # Phone number with country code (e.g., "919876543210")
    message: str
    template_name: Optional[str] = None
    template_language: str = "en"
    template_components: Optional[List[Dict[str, Any]]] = None


class WhatsAppService:
    """Service for WhatsApp Business Cloud API"""
    
    def __init__(self, config: WhatsAppConfig):
        self.config = config
        self.base_url = f"{WHATSAPP_API_BASE_URL}/{config.phone_number_id}"
        self.headers = {
            "Authorization": f"Bearer {config.access_token}",
            "Content-Type": "application/json"
        }
    
    async def send_text_message(self, to: str, message: str) -> Dict[str, Any]:
        """
        Send a text message via WhatsApp
        
        Args:
            to: Phone number with country code (e.g., "919876543210")
            message: Text message to send
            
        Returns:
            API response with message ID
        """
        url = f"{self.base_url}/messages"
        
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to,
            "type": "text",
            "text": {
                "preview_url": False,
                "body": message
            }
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, headers=self.headers)
                response.raise_for_status()
                result = response.json()
                logger.info(f"Message sent successfully to {to}: {result}")
                return {
                    "success": True,
                    "message_id": result.get("messages", [{}])[0].get("id"),
                    "response": result
                }
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to send message to {to}: {e.response.text}")
                return {
                    "success": False,
                    "error": e.response.text,
                    "status_code": e.response.status_code
                }
            except Exception as e:
                logger.error(f"Error sending message: {str(e)}")
                return {
                    "success": False,
                    "error": str(e)
                }
    
    async def send_template_message(
        self, 
        to: str, 
        template_name: str,
        language_code: str = "en",
        components: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Send a template message via WhatsApp
        
        Args:
            to: Phone number with country code
            template_name: Name of the approved template
            language_code: Language code (e.g., "en", "hi")
            components: Template components for variables
            
        Returns:
            API response with message ID
        """
        url = f"{self.base_url}/messages"
        
        template = {
            "name": template_name,
            "language": {
                "code": language_code
            }
        }
        
        if components:
            template["components"] = components
        
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to,
            "type": "template",
            "template": template
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, headers=self.headers)
                response.raise_for_status()
                result = response.json()
                logger.info(f"Template message sent to {to}: {result}")
                return {
                    "success": True,
                    "message_id": result.get("messages", [{}])[0].get("id"),
                    "response": result
                }
            except httpx.HTTPStatusError as e:
                logger.error(f"Failed to send template to {to}: {e.response.text}")
                return {
                    "success": False,
                    "error": e.response.text,
                    "status_code": e.response.status_code
                }
            except Exception as e:
                logger.error(f"Error sending template: {str(e)}")
                return {
                    "success": False,
                    "error": str(e)
                }
    
    async def send_image_message(
        self, 
        to: str, 
        image_url: str, 
        caption: Optional[str] = None
    ) -> Dict[str, Any]:
        """Send an image message with optional caption"""
        url = f"{self.base_url}/messages"
        
        image_payload = {"link": image_url}
        if caption:
            image_payload["caption"] = caption
        
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to,
            "type": "image",
            "image": image_payload
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(url, json=payload, headers=self.headers)
                response.raise_for_status()
                result = response.json()
                return {
                    "success": True,
                    "message_id": result.get("messages", [{}])[0].get("id"),
                    "response": result
                }
            except httpx.HTTPStatusError as e:
                return {
                    "success": False,
                    "error": e.response.text,
                    "status_code": e.response.status_code
                }
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e)
                }
    
    async def send_bulk_messages(
        self, 
        recipients: List[str], 
        message: str,
        delay_ms: int = 1000
    ) -> Dict[str, Any]:
        """
        Send bulk text messages with rate limiting
        
        Args:
            recipients: List of phone numbers
            message: Message to send
            delay_ms: Delay between messages in milliseconds
            
        Returns:
            Summary of sent/failed messages
        """
        import asyncio
        
        results = {
            "total": len(recipients),
            "sent": 0,
            "failed": 0,
            "details": []
        }
        
        for phone in recipients:
            result = await self.send_text_message(phone, message)
            if result.get("success"):
                results["sent"] += 1
            else:
                results["failed"] += 1
            
            results["details"].append({
                "phone": phone,
                "success": result.get("success"),
                "message_id": result.get("message_id"),
                "error": result.get("error")
            })
            
            # Rate limiting delay
            await asyncio.sleep(delay_ms / 1000)
        
        return results
    
    async def get_message_templates(self) -> Dict[str, Any]:
        """Get list of approved message templates"""
        if not self.config.business_account_id:
            return {"success": False, "error": "Business Account ID not configured"}
        
        url = f"{WHATSAPP_API_BASE_URL}/{self.config.business_account_id}/message_templates"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                return {
                    "success": True,
                    "templates": response.json().get("data", [])
                }
            except Exception as e:
                return {
                    "success": False,
                    "error": str(e)
                }
    
    async def verify_webhook(self, mode: str, token: str, challenge: str) -> Optional[str]:
        """
        Verify webhook subscription from Meta
        
        Returns challenge if verification is successful
        """
        if mode == "subscribe" and token == self.config.webhook_verify_token:
            return challenge
        return None


# Factory function to create WhatsApp service from environment
def create_whatsapp_service() -> Optional[WhatsAppService]:
    """Create WhatsApp service from environment variables"""
    access_token = os.getenv("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
    
    if not access_token or not phone_number_id:
        logger.warning("WhatsApp API credentials not configured")
        return None
    
    config = WhatsAppConfig(
        access_token=access_token,
        phone_number_id=phone_number_id,
        business_account_id=os.getenv("WHATSAPP_BUSINESS_ACCOUNT_ID"),
        webhook_verify_token=os.getenv("WHATSAPP_WEBHOOK_VERIFY_TOKEN")
    )
    
    return WhatsAppService(config)
