export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'meeting_booked'
  | 'proposal_sent'
  | 'followup_required'
  | 'converted'
  | 'not_interested'
  | 'no_response';

export type LeadSource = 'meta' | 'google' | 'manual' | 'upload';

export type ServiceGroup =
  | 'chemical_peel'
  | 'hair_transplant'
  | 'acne_treatment'
  | 'skin_brightening'
  | 'ivf_gynecology'
  | 'custom';

export type UserRole = 'admin' | 'manager' | 'agent';

export interface MetaData {
  adId?: string;
  adName?: string;
  adSetId?: string;
  adSetName?: string;
  campaignId?: string;
  campaignName?: string;
  formId?: string;
  formName?: string;
  platform?: 'fb' | 'ig';
  customFields?: Record<string, string>; // Custom form fields from Meta lead form
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  alternatePhone?: string; // Secondary contact number
  whatsappNumber?: string; // WhatsApp number if different
  service: ServiceGroup;
  clinicName: string;
  city: string;
  state?: string;
  pincode?: string;
  address?: string;
  source: LeadSource;
  status: LeadStatus;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
  notes: Note[];
  birthday?: Date;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  occupation?: string;
  companyName?: string;
  referredBy?: string; // Who referred this lead
  languagePreference?: string; // Preferred language for communication
  bestTimeToCall?: string; // Best time to contact
  previousClinicVisited?: boolean;
  budget?: string;
  urgency?: 'immediate' | 'this_week' | 'this_month' | 'exploring';
  metaData?: MetaData;
  googleData?: GoogleAdsData;
}

export interface GoogleAdsData {
  campaignId?: string;
  campaignName?: string;
  adGroupId?: string;
  adGroupName?: string;
  adId?: string;
  adName?: string;
  keyword?: string;
  matchType?: string;
  gclid?: string;
  customFields?: Record<string, string>; // Custom form fields from Google Ads lead form
}

export interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

// Activity tracking types
export type ActivityType = 'call' | 'message' | 'email' | 'note' | 'status_change' | 'meeting' | 'follow_up';

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}

// Call tracking
export type CallStatus = 'completed' | 'missed' | 'no_answer' | 'busy' | 'scheduled';
export type CallDirection = 'inbound' | 'outbound';

export interface CallRecord {
  id: string;
  leadId: string;
  direction: CallDirection;
  status: CallStatus;
  duration?: number; // in seconds
  notes?: string;
  createdBy: string;
  createdAt: Date;
  scheduledFor?: Date;
}

// Message tracking
export type MessageChannel = 'whatsapp' | 'sms' | 'email';
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageRecord {
  id: string;
  leadId: string;
  channel: MessageChannel;
  content: string;
  status: MessageStatus;
  direction: 'inbound' | 'outbound';
  createdBy?: string;
  createdAt: Date;
}

// Follow-up tracking
export type FollowUpPriority = 'low' | 'medium' | 'high' | 'urgent';
export type FollowUpStatus = 'pending' | 'completed' | 'cancelled' | 'overdue';

export interface FollowUp {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  scheduledFor: Date;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  type: 'call' | 'meeting' | 'email' | 'whatsapp' | 'other';
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface QuickMessage {
  id: string;
  title: string;
  content: string;
  group?: ServiceGroup;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  targetFilters: {
    groups?: ServiceGroup[];
    statuses?: LeadStatus[];
    dateRange?: { start: Date; end: Date };
  };
  sentCount: number;
  failedCount: number;
  createdAt: Date;
}

export const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New Lead', color: 'bg-status-new' },
  contacted: { label: 'Contacted', color: 'bg-status-contacted' },
  meeting_booked: { label: 'Meeting Booked', color: 'bg-status-meeting' },
  proposal_sent: { label: 'Proposal Sent', color: 'bg-status-proposal' },
  followup_required: { label: 'Follow-up Required', color: 'bg-status-followup' },
  converted: { label: 'Converted', color: 'bg-status-converted' },
  not_interested: { label: 'Not Interested', color: 'bg-status-not-interested' },
  no_response: { label: 'No Response', color: 'bg-status-no-response' },
};

export const SOURCE_CONFIG: Record<LeadSource, { label: string; color: string }> = {
  meta: { label: 'Meta Ads', color: 'bg-source-meta' },
  google: { label: 'Google Ads', color: 'bg-source-google' },
  manual: { label: 'Manual Entry', color: 'bg-source-manual' },
  upload: { label: 'CSV Upload', color: 'bg-source-upload' },
};

export const SERVICE_CONFIG: Record<ServiceGroup, { label: string; icon: string }> = {
  chemical_peel: { label: 'Chemical Peel', icon: '✨' },
  hair_transplant: { label: 'Hair Transplant', icon: '💇' },
  acne_treatment: { label: 'Acne Treatment', icon: '🧴' },
  skin_brightening: { label: 'Skin Brightening', icon: '🌟' },
  ivf_gynecology: { label: 'IVF / Gynecology', icon: '🏥' },
  custom: { label: 'Custom', icon: '📋' },
};
