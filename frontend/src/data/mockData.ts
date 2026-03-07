import { Lead, User, QuickMessage, Campaign, LeadStatus, LeadSource, ServiceGroup, Activity, CallRecord, MessageRecord, FollowUp, SERVICE_CONFIG } from '@/types/crm';

export const mockUsers: User[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@abhivrudhi.com', role: 'admin', avatar: '' },
  { id: '2', name: 'Rahul Verma', email: 'rahul@abhivrudhi.com', role: 'manager', avatar: '' },
  { id: '3', name: 'Anita Patel', email: 'anita@abhivrudhi.com', role: 'agent', avatar: '' },
  { id: '4', name: 'Vikram Singh', email: 'vikram@abhivrudhi.com', role: 'agent', avatar: '' },
];

const generateLeads = (): Lead[] => {
  const names = [
    'Dr. Arun Kumar', 'Dr. Meera Reddy', 'Dr. Suresh Gupta', 'Dr. Kavitha Nair',
    'Dr. Rajesh Menon', 'Dr. Sunita Rao', 'Dr. Mohan Iyer', 'Dr. Lakshmi Pillai',
    'Dr. Venkat Krishnan', 'Dr. Deepa Sharma', 'Dr. Sanjay Patel', 'Dr. Ritu Agarwal',
    'Dr. Amit Joshi', 'Dr. Pooja Mehta', 'Dr. Kiran Desai', 'Dr. Nisha Thakur',
  ];

  const clinics = [
    'Glow Skin Clinic', 'Elite Derma Center', 'Radiance Aesthetics', 'Perfect Skin Solutions',
    'BeautyFirst Clinic', 'Skin Rejuvenation Hub', 'Derma Excellence', 'ClearSkin Medical',
  ];

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
  const statuses: LeadStatus[] = ['new', 'contacted', 'meeting_booked', 'proposal_sent', 'followup_required', 'converted', 'not_interested', 'no_response'];
  const sources: LeadSource[] = ['meta', 'google', 'manual', 'upload'];
  const services: ServiceGroup[] = ['chemical_peel', 'hair_transplant', 'acne_treatment', 'skin_brightening', 'ivf_gynecology'];

  return names.map((name, index) => ({
    id: `lead-${index + 1}`,
    name,
    phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    email: `${name.toLowerCase().replace('dr. ', '').replace(' ', '.')}@email.com`,
    service: services[index % services.length],
    clinicName: clinics[index % clinics.length],
    city: cities[index % cities.length],
    source: sources[index % sources.length],
    status: statuses[index % statuses.length],
    assignedTo: mockUsers[index % mockUsers.length].id,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    notes: index % 3 === 0 ? [
      {
        id: `note-${index}-1`,
        content: 'Initial call made. Doctor showed interest in the service package.',
        createdBy: mockUsers[0].id,
        createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      }
    ] : [],
    birthday: index % 4 === 0 ? new Date(1985, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1) : undefined,
    alternatePhone: index % 3 === 0 ? `+91 ${Math.floor(8000000000 + Math.random() * 2000000000)}` : undefined,
    whatsappNumber: index % 2 === 0 ? `+91 ${Math.floor(9000000000 + Math.random() * 1000000000)}` : undefined,
    state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'West Bengal', 'Gujarat'][index % 8],
    pincode: `4${Math.floor(10000 + Math.random() * 90000)}`,
    address: index % 2 === 0 ? `${Math.floor(Math.random() * 200) + 1}, Main Road, ${cities[index % cities.length]}` : undefined,
    age: 30 + (index % 30),
    gender: ['male', 'female', 'male', 'female'][index % 4] as 'male' | 'female',
    occupation: ['Doctor', 'Business Owner', 'IT Professional', 'Entrepreneur', 'Teacher', 'Consultant'][index % 6],
    companyName: index % 3 === 0 ? clinics[index % clinics.length] : undefined,
    referredBy: index % 4 === 0 ? ['Friend', 'Family Member', 'Existing Client', 'Online Search'][index % 4] : undefined,
    languagePreference: ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada'][index % 5],
    bestTimeToCall: ['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 5 PM)', 'Evening (5 PM - 8 PM)'][index % 3],
    previousClinicVisited: index % 2 === 0,
    budget: ['₹50,000 - ₹1,00,000', '₹1,00,000 - ₹2,00,000', '₹2,00,000 - ₹5,00,000', '₹5,00,000+'][index % 4],
    urgency: ['immediate', 'this_week', 'this_month', 'exploring'][index % 4] as 'immediate' | 'this_week' | 'this_month' | 'exploring',
    metaData: sources[index % sources.length] === 'meta' ? {
      adId: `ad-${index}`,
      adName: `Ad Variant ${['A', 'B', 'C'][index % 3]} - ${services[index % services.length]}`,
      adSetId: `adset-${index}`,
      adSetName: `Targeting: Women 25-45 - ${cities[index % cities.length]}`,
      campaignId: `camp-${index}`,
      campaignName: `Q4 Lead Gen - ${services[index % services.length]}`,
      formId: `form-${index}`,
      formName: `${services[index % services.length]} Inquiry Form`,
      platform: index % 2 === 0 ? 'fb' : 'ig',
      customFields: {
        'Budget': index % 3 === 0 ? '₹50,000 - ₹1,00,000' : index % 3 === 1 ? '₹1,00,000 - ₹2,00,000' : '₹2,00,000+',
        'Preferred Appointment Date': new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
        'Specific Concerns': index % 4 === 0 ? 'Want quick results' : index % 4 === 1 ? 'Looking for best quality' : index % 4 === 2 ? 'Price sensitive' : 'Need consultation first',
        'How did you hear about us?': index % 3 === 0 ? 'Facebook Ad' : index % 3 === 1 ? 'Instagram Ad' : 'Friend Referral',
        'Current Medication': index % 2 === 0 ? 'None' : 'Currently under treatment',
      },
    } : undefined,
    googleData: sources[index % sources.length] === 'google' ? {
      campaignId: `g-camp-${index}`,
      campaignName: `Search - ${services[index % services.length]} [Exact]`,
      adGroupId: `g-adgroup-${index}`,
      adGroupName: `Local - ${cities[index % cities.length]}`,
      adId: `g-ad-${index}`,
      adName: 'Responsive Search Ad #1',
      keyword: `${services[index % services.length]} near me`,
      matchType: 'EXACT',
      gclid: `Cj0KEQjw-${index}A_BwE`,
      customFields: {
        'Service Interest': SERVICE_CONFIG[services[index % services.length]].label,
        'Preferred Location': cities[index % cities.length],
        'Contact Time': index % 3 === 0 ? 'Morning (9 AM - 12 PM)' : index % 3 === 1 ? 'Afternoon (12 PM - 5 PM)' : 'Evening (5 PM - 8 PM)',
        'Budget Range': index % 3 === 0 ? '₹50,000 - ₹1,00,000' : index % 3 === 1 ? '₹1,00,000 - ₹2,00,000' : '₹2,00,000+',
        'Urgency': index % 4 === 0 ? 'Immediate (Within 1 week)' : index % 4 === 1 ? 'Soon (Within 1 month)' : index % 4 === 2 ? 'Planning (1-3 months)' : 'Just exploring',
        'Previous Treatment': index % 2 === 0 ? 'Yes' : 'No',
      },
    } : undefined,
  }));
};

export const mockLeads: Lead[] = generateLeads();

// Generate mock activities for leads
export const mockActivities: Activity[] = mockLeads.flatMap((lead, leadIndex) => {
  const activities: Activity[] = [];
  const numActivities = Math.floor(Math.random() * 5) + 2;

  for (let i = 0; i < numActivities; i++) {
    const types: Activity['type'][] = ['call', 'message', 'email', 'note', 'status_change', 'meeting'];
    const type = types[Math.floor(Math.random() * types.length)];
    const daysAgo = Math.floor(Math.random() * 14);

    activities.push({
      id: `activity-${lead.id}-${i}`,
      leadId: lead.id,
      type,
      title: getActivityTitle(type),
      description: getActivityDescription(type),
      createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000),
    });
  }

  return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

function getActivityTitle(type: Activity['type']): string {
  const titles: Record<Activity['type'], string[]> = {
    call: ['Outbound call', 'Follow-up call', 'Initial call', 'Callback attempt'],
    message: ['WhatsApp sent', 'SMS sent', 'Quick message sent'],
    email: ['Email sent', 'Proposal email', 'Follow-up email'],
    note: ['Note added', 'Internal note', 'Update recorded'],
    status_change: ['Status updated', 'Lead qualified', 'Moved to next stage'],
    meeting: ['Meeting scheduled', 'Demo call booked', 'Consultation set'],
    follow_up: ['Follow-up created', 'Reminder set', 'Task assigned'],
  };
  const options = titles[type];
  return options[Math.floor(Math.random() * options.length)];
}

function getActivityDescription(type: Activity['type']): string {
  const descriptions: Record<Activity['type'], string[]> = {
    call: ['Connected with lead, discussed requirements', 'Left voicemail', 'No answer, will retry', 'Discussed pricing and services'],
    message: ['Sent clinic details and pricing', 'Shared consultation link', 'Sent appointment reminder'],
    email: ['Sent detailed proposal with pricing', 'Shared brochure and testimonials', 'Follow-up on previous discussion'],
    note: ['Lead showed interest in premium package', 'Prefers communication via WhatsApp', 'Decision expected next week'],
    status_change: ['Moved from New to Contacted', 'Qualified after initial discussion', 'Meeting booked for next week'],
    meeting: ['Virtual consultation scheduled for tomorrow', 'In-person demo at clinic', 'Follow-up meeting confirmed'],
    follow_up: ['Call back requested for next week', 'Send pricing after consultation', 'Check in after trial period'],
  };
  const options = descriptions[type];
  return options[Math.floor(Math.random() * options.length)];
}

// Generate mock call records
export const mockCallRecords: CallRecord[] = mockLeads.flatMap((lead) => {
  const numCalls = Math.floor(Math.random() * 4);
  const calls: CallRecord[] = [];

  for (let i = 0; i < numCalls; i++) {
    const statuses: CallRecord['status'][] = ['completed', 'missed', 'no_answer', 'busy'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 10);

    calls.push({
      id: `call-${lead.id}-${i}`,
      leadId: lead.id,
      direction: Math.random() > 0.3 ? 'outbound' : 'inbound',
      status,
      duration: status === 'completed' ? Math.floor(Math.random() * 600) + 30 : undefined,
      notes: status === 'completed' ? 'Discussed services and pricing. Lead interested in follow-up.' : undefined,
      createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000),
    });
  }

  return calls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

// Generate mock message records
export const mockMessageRecords: MessageRecord[] = mockLeads.flatMap((lead) => {
  const numMessages = Math.floor(Math.random() * 6) + 1;
  const messages: MessageRecord[] = [];
  const messageContents = [
    `Hi ${lead.name.split(' ')[0]}, thank you for your interest in our services!`,
    'Here are the clinic details and pricing as discussed.',
    'Just following up on our previous conversation.',
    'Your appointment has been confirmed for tomorrow.',
    'Please let us know if you have any questions.',
    'Thank you for visiting! Would love to hear your feedback.',
  ];

  for (let i = 0; i < numMessages; i++) {
    const channels: MessageRecord['channel'][] = ['whatsapp', 'sms', 'email'];
    const statuses: MessageRecord['status'][] = ['sent', 'delivered', 'read'];
    const daysAgo = Math.floor(Math.random() * 12);

    messages.push({
      id: `msg-${lead.id}-${i}`,
      leadId: lead.id,
      channel: channels[Math.floor(Math.random() * channels.length)],
      content: messageContents[i % messageContents.length],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      direction: Math.random() > 0.2 ? 'outbound' : 'inbound',
      createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000),
    });
  }

  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

// Generate mock follow-ups
export const mockFollowUps: FollowUp[] = mockLeads.flatMap((lead, index) => {
  if (index % 2 !== 0) return [];

  const numFollowUps = Math.floor(Math.random() * 3) + 1;
  const followUps: FollowUp[] = [];
  const titles = ['Call back customer', 'Send proposal', 'Schedule meeting', 'Check consultation feedback', 'Share pricing details'];
  const types: FollowUp['type'][] = ['call', 'meeting', 'email', 'whatsapp', 'other'];
  const priorities: FollowUp['priority'][] = ['low', 'medium', 'high', 'urgent'];

  for (let i = 0; i < numFollowUps; i++) {
    const daysFromNow = Math.floor(Math.random() * 10) - 3; // Some past, some future
    const isPast = daysFromNow < 0;
    const isCompleted = isPast && Math.random() > 0.5;

    followUps.push({
      id: `followup-${lead.id}-${i}`,
      leadId: lead.id,
      title: titles[Math.floor(Math.random() * titles.length)],
      description: 'Follow up as per previous conversation',
      scheduledFor: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: isCompleted ? 'completed' : (isPast ? 'overdue' : 'pending'),
      type: types[Math.floor(Math.random() * types.length)],
      createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000),
      completedAt: isCompleted ? new Date(Date.now() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000) : undefined,
    });
  }

  return followUps.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
});

export const mockQuickMessages: QuickMessage[] = [
  {
    id: 'qm-1',
    title: 'Tried Calling',
    content: 'Hi {{name}}, we tried calling you regarding your inquiry about {{service}}. Please let us know a convenient time to connect. - Abhivrudhi Agency',
  },
  {
    id: 'qm-2',
    title: 'Clinic Location',
    content: 'Hi {{name}}, here are the clinic details:\n📍 {{clinic_name}}\n⏰ Timings: 10 AM - 7 PM\n📞 For appointments, call us anytime!',
  },
  {
    id: 'qm-3',
    title: 'Consultation Charges',
    content: 'Hi {{name}}, the doctor consultation charges at {{clinic_name}} are ₹500 (adjustable against treatment). Would you like to book an appointment?',
  },
  {
    id: 'qm-4',
    title: 'Follow-up Reminder',
    content: 'Hi {{name}}, just following up on our previous conversation about {{service}}. Have you had a chance to consider? Happy to answer any questions!',
  },
  {
    id: 'qm-5',
    title: 'Review Request',
    content: 'Hi {{name}}, thank you for visiting {{clinic_name}}! 🙏\n\nYour feedback helps us serve patients better. Please share your experience here:\n{{gmb_link}}',
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Winter Skin Care Promo',
    type: 'image',
    status: 'sent',
    targetFilters: { groups: ['skin_brightening', 'chemical_peel'] },
    sentCount: 245,
    failedCount: 12,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'camp-2',
    name: 'New Year Offers',
    type: 'video',
    status: 'scheduled',
    targetFilters: { statuses: ['converted', 'meeting_booked'] },
    sentCount: 0,
    failedCount: 0,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export const dashboardStats = {
  totalLeads: mockLeads.length,
  newLeads: mockLeads.filter(l => l.status === 'new').length,
  converted: mockLeads.filter(l => l.status === 'converted').length,
  followupRequired: mockLeads.filter(l => l.status === 'followup_required').length,
  conversionRate: Math.round((mockLeads.filter(l => l.status === 'converted').length / mockLeads.length) * 100),
  todayLeads: mockLeads.filter(l => {
    const today = new Date();
    return l.createdAt.toDateString() === today.toDateString();
  }).length,
};

// Helper functions to get data for a specific lead
export const getLeadActivities = (leadId: string) => mockActivities.filter(a => a.leadId === leadId);
export const getLeadCalls = (leadId: string) => mockCallRecords.filter(c => c.leadId === leadId);
export const getLeadMessages = (leadId: string) => mockMessageRecords.filter(m => m.leadId === leadId);
export const getLeadFollowUps = (leadId: string) => mockFollowUps.filter(f => f.leadId === leadId);
