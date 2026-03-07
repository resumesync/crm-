/**
 * API Response Types - matching backend FastAPI schemas
 */

// ==================== Lead Types ====================

export interface ApiLeadField {
    id: number;
    field_name: string;
    field_value: string | null;
    created_at: string;
}

export interface ApiLead {
    id: number;
    lead_id: string;
    form_id: string;
    page_id: string;
    ad_id: string | null;
    adgroup_id: string | null;
    campaign_id: string | null;
    full_name: string | null;
    phone_number: string | null;
    email: string | null;
    custom_questions: Record<string, string> | null;
    service_interested: string | null;
    clinic_name: string | null;
    city: string | null;
    lead_source: 'meta' | 'google' | 'manual' | 'upload';
    assigned_owner_id: number | null;
    group_id: number | null;
    clinic_id: number | null;
    birthday: string | null;
    is_opted_out: boolean;
    created_time: string | null;
    platform: string;
    status: string;
    is_organic: boolean;
    created_at: string;
    updated_at: string;
    fields?: ApiLeadField[];
}

export interface ApiLeadListResponse {
    total: number;
    page: number;
    per_page: number;
    leads: ApiLead[];
}

export interface ApiLeadStatusUpdate {
    status: string;
}

export interface ApiLeadAssignment {
    owner_id: number;
    notes?: string;
}

export interface ApiStatusHistoryEntry {
    id: number;
    old_status: string | null;
    new_status: string;
    changed_by: number | null;
    changed_at: string;
    notes: string | null;
}

// ==================== Group Types ====================

export interface ApiLeadGroup {
    id: number;
    name: string;
    description: string | null;
    is_custom: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ==================== Status Types ====================

export interface ApiLeadStatus {
    id: number;
    name: string;
    display_order: number;
    color: string | null;
    is_default: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ==================== Campaign Types ====================

export interface ApiCampaign {
    id: number;
    name: string;
    content: string;
    media_url: string | null;
    media_type: 'image' | 'video' | 'document' | 'none' | null;
    filter_group_id: number | null;
    filter_status: string | null;
    filter_date_from: string | null;
    filter_date_to: string | null;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    scheduled_at: string | null;
    started_at: string | null;
    completed_at: string | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface ApiCampaignListResponse {
    total: number;
    campaigns: ApiCampaign[];
}

export interface ApiCampaignCreate {
    name: string;
    content: string;
    media_url?: string;
    media_type?: string;
    filter_group_id?: number;
    filter_status?: string;
    filter_date_from?: string;
    filter_date_to?: string;
    scheduled_at?: string;
}

export interface ApiCampaignStats {
    campaign_id: number;
    total_recipients: number;
    sent_count: number;
    failed_count: number;
    pending_count: number;
    opted_out_count: number;
}

export interface ApiCampaignLog {
    id: number;
    campaign_id: number;
    lead_id: number | null;
    phone_number: string;
    status: 'sent' | 'failed' | 'opted_out' | 'pending';
    error_message: string | null;
    sent_at: string;
}

export interface ApiDailyLimit {
    daily_limit: number;
    sent_today: number;
    remaining: number;
}

// ==================== WhatsApp Types ====================

export interface ApiWhatsAppTemplate {
    id: number;
    name: string;
    template_type: 'auto_new_lead' | 'auto_status_change' | 'quick' | 'review_request' | 'birthday' | 'custom';
    content: string;
    group_id: number | null;
    trigger_status: string | null;
    is_active: boolean;
    variables_used: string[] | null;
    created_by: number | null;
    created_at: string;
    updated_at: string;
}

export interface ApiWhatsAppTemplateCreate {
    name: string;
    template_type: string;
    content: string;
    group_id?: number;
    trigger_status?: string;
    variables_used?: string[];
}

export interface ApiMessageHistory {
    id: number;
    lead_id: number;
    message_type: 'outgoing' | 'incoming' | 'auto';
    content: string;
    template_id: number | null;
    whatsapp_link: string | null;
    sent_by: number | null;
    sent_at: string;
}

export interface ApiWhatsAppLink {
    phone_number: string;
    message: string;
    whatsapp_link: string;
    template_name?: string;
}

export interface ApiAutoResponder {
    id: number;
    group_id: number | null;
    trigger_type: 'new_lead' | 'status_change';
    trigger_status: string | null;
    template_id: number;
    is_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApiOptOut {
    id: number;
    phone_number: string;
    opted_out_at: string;
    reason: string | null;
    marked_by: number | null;
}

// ==================== Note Types ====================

export interface ApiNote {
    id: number;
    lead_id: number;
    content: string;
    created_by: number | null;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface ApiNoteCreate {
    content: string;
}

// ==================== Clinic Types ====================

export interface ApiClinic {
    id: number;
    name: string;
    branch_name: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
    phone: string | null;
    email: string | null;
    google_maps_link: string | null;
    gmb_review_link: string | null;
    timing: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// ==================== Auth Types ====================

export interface ApiUser {
    id: number;
    email: string;
    username: string;
    full_name: string | null;
    role_id: number | null;
    role_name: string | null;
    sub_team_id: number | null;
    sub_team_name: string | null;
    is_active: boolean;
    is_superuser: boolean;
    phone_mask_enabled?: boolean;
    created_at: string;
    updated_at?: string;
    last_login?: string | null;
}

export interface ApiLoginRequest {
    username: string;
    password: string;
}

export interface ApiLoginResponse {
    access_token: string;
    token_type: string;
    user: ApiUser;
}

export interface ApiRegisterRequest {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

// ==================== Birthday Types ====================

export interface ApiBirthdayLead {
    lead_id: number;
    name: string;
    phone_number: string;
    birthday: string;
    days_until: number;
}

// ==================== Webhook Types ====================

export interface ApiWebhookEvent {
    id: number;
    event_type: string;
    object_type: string;
    page_id: string | null;
    lead_id: string | null;
    form_id: string | null;
    status: string;
    error_message: string | null;
    received_at: string;
    processed_at: string | null;
}
