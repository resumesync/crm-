/**
 * WhatsApp Service - API calls for templates, messages, and auto-responders
 */
import api from '@/lib/api';
import type {
    ApiWhatsAppTemplate,
    ApiWhatsAppTemplateCreate,
    ApiMessageHistory,
    ApiWhatsAppLink,
    ApiAutoResponder,
    ApiOptOut,
} from '@/types/api';

export const whatsappService = {
    // ==================== Templates ====================

    /**
     * Get all templates
     */
    getTemplates: (options?: {
        template_type?: string;
        group_id?: number;
        include_inactive?: boolean;
    }): Promise<ApiWhatsAppTemplate[]> => {
        return api.get<ApiWhatsAppTemplate[]>('/whatsapp/templates', options);
    },

    /**
     * Get quick message templates
     */
    getQuickTemplates: (groupId?: number): Promise<ApiWhatsAppTemplate[]> => {
        return api.get<ApiWhatsAppTemplate[]>('/whatsapp/templates/quick', { group_id: groupId });
    },

    /**
     * Get a specific template
     */
    getTemplate: (id: number): Promise<ApiWhatsAppTemplate> => {
        return api.get<ApiWhatsAppTemplate>(`/whatsapp/templates/${id}`);
    },

    /**
     * Create a new template
     */
    createTemplate: (data: ApiWhatsAppTemplateCreate, userId?: number): Promise<ApiWhatsAppTemplate> => {
        return api.post<ApiWhatsAppTemplate>('/whatsapp/templates', data, { user_id: userId });
    },

    /**
     * Update a template
     */
    updateTemplate: (
        id: number,
        data: Partial<ApiWhatsAppTemplateCreate & { is_active?: boolean }>
    ): Promise<ApiWhatsAppTemplate> => {
        return api.put<ApiWhatsAppTemplate>(`/whatsapp/templates/${id}`, data);
    },

    /**
     * Delete a template
     */
    deleteTemplate: (id: number, hardDelete?: boolean): Promise<{ status: string; template_id: number }> => {
        return api.delete(`/whatsapp/templates/${id}${hardDelete ? '?hard_delete=true' : ''}`);
    },

    // ==================== Messages ====================

    /**
     * Get WhatsApp link for a lead
     */
    getWhatsAppLink: (
        leadId: number,
        options?: { template_id?: number; message?: string }
    ): Promise<ApiWhatsAppLink> => {
        return api.get<ApiWhatsAppLink>(`/whatsapp/lead/${leadId}/link`, options);
    },

    /**
     * Log a sent message
     */
    logSentMessage: (
        leadId: number,
        data: {
            message_type: 'outgoing' | 'incoming' | 'auto';
            content: string;
            template_id?: number;
            whatsapp_link?: string;
        },
        userId?: number
    ): Promise<ApiMessageHistory> => {
        return api.post<ApiMessageHistory>(`/whatsapp/lead/${leadId}/send-message`, data, { user_id: userId });
    },

    /**
     * Get message history for a lead
     */
    getMessageHistory: (leadId: number, limit?: number): Promise<ApiMessageHistory[]> => {
        return api.get<ApiMessageHistory[]>(`/whatsapp/lead/${leadId}/messages`, { limit: limit || 50 });
    },

    // ==================== Auto-Responders ====================

    /**
     * Get auto-responder settings
     */
    getAutoResponders: (options?: {
        group_id?: number;
        trigger_type?: string;
    }): Promise<ApiAutoResponder[]> => {
        return api.get<ApiAutoResponder[]>('/whatsapp/auto-responders', options);
    },

    /**
     * Create an auto-responder
     */
    createAutoResponder: (data: {
        trigger_type: 'new_lead' | 'status_change';
        template_id: number;
        group_id?: number;
        trigger_status?: string;
    }): Promise<ApiAutoResponder> => {
        return api.post<ApiAutoResponder>('/whatsapp/auto-responders', data);
    },

    // ==================== Opt-Outs ====================

    /**
     * Get opt-out list
     */
    getOptOuts: (options?: { limit?: number; offset?: number }): Promise<ApiOptOut[]> => {
        return api.get<ApiOptOut[]>('/whatsapp/opt-outs', {
            limit: options?.limit || 100,
            offset: options?.offset || 0,
        });
    },

    /**
     * Add phone number to opt-out list
     */
    addOptOut: (
        phoneNumber: string,
        reason?: string,
        userId?: number
    ): Promise<ApiOptOut> => {
        return api.post<ApiOptOut>('/whatsapp/opt-outs', { phone_number: phoneNumber, reason }, { user_id: userId });
    },

    /**
     * Remove phone number from opt-out list
     */
    removeOptOut: (phoneNumber: string): Promise<{ status: string; phone_number: string }> => {
        return api.delete(`/whatsapp/opt-outs/${encodeURIComponent(phoneNumber)}`);
    },

    /**
     * Check if phone number is opted out
     */
    checkOptOut: (phoneNumber: string): Promise<{ phone_number: string; is_opted_out: boolean }> => {
        return api.get(`/whatsapp/opt-outs/check/${encodeURIComponent(phoneNumber)}`);
    },
};

export default whatsappService;
