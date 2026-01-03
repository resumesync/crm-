import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080'],
    credentials: true
}));
app.use(express.json());

// In-memory storage for leads (replace with database in production)
let leads = [];
let leadId = 1;

// ==================== Health Check ====================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==================== Meta Lead Ads Webhook ====================

// Webhook Verification (GET) - Required by Meta
app.get('/api/webhook/meta', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'clientcare_verify_token';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook verified successfully!');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Webhook verification failed');
        res.sendStatus(403);
    }
});

// Webhook Handler (POST) - Receives lead data from Meta
app.post('/api/webhook/meta', async (req, res) => {
    const body = req.body;
    console.log('📥 Received webhook:', JSON.stringify(body, null, 2));

    try {
        if (body.object === 'page') {
            for (const entry of body.entry) {
                // Handle leadgen events
                if (entry.changes) {
                    for (const change of entry.changes) {
                        if (change.field === 'leadgen') {
                            const leadgenId = change.value.leadgen_id;
                            const formId = change.value.form_id;
                            const pageId = change.value.page_id;
                            const createdTime = change.value.created_time;

                            console.log(`🎯 New lead received! LeadGen ID: ${leadgenId}`);

                            // Fetch full lead data from Meta Graph API
                            const leadData = await fetchLeadData(leadgenId);

                            if (leadData) {
                                const newLead = {
                                    id: leadId++,
                                    leadgen_id: leadgenId,
                                    form_id: formId,
                                    page_id: pageId,
                                    created_time: new Date(createdTime * 1000).toISOString(),
                                    ...parseLeadFields(leadData.field_data),
                                    source: 'meta_lead_ads',
                                    status: 'new',
                                    received_at: new Date().toISOString()
                                };

                                leads.unshift(newLead);
                                console.log('✅ Lead saved:', newLead);
                            }
                        }
                    }
                }
            }
        }

        res.status(200).send('EVENT_RECEIVED');
    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        res.status(200).send('EVENT_RECEIVED'); // Always return 200 to Meta
    }
});

// Fetch lead data from Meta Graph API
async function fetchLeadData(leadgenId) {
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
        console.log('⚠️ META_ACCESS_TOKEN not configured, using mock data');
        return {
            field_data: [
                { name: 'full_name', values: ['Demo Lead'] },
                { name: 'email', values: ['demo@example.com'] },
                { name: 'phone_number', values: ['+91 98765 43210'] }
            ]
        };
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${accessToken}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch lead: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching lead from Meta:', error);
        return null;
    }
}

// Parse lead field data into a flat object
function parseLeadFields(fieldData) {
    const parsed = {};

    if (!fieldData) return parsed;

    for (const field of fieldData) {
        const name = field.name.toLowerCase().replace(/\s+/g, '_');
        parsed[name] = field.values?.[0] || '';
    }

    return parsed;
}

// ==================== Leads API ====================

// Get all leads
app.get('/api/leads', (req, res) => {
    const { source, status, limit = 50, offset = 0 } = req.query;

    let filteredLeads = [...leads];

    if (source) {
        filteredLeads = filteredLeads.filter(l => l.source === source);
    }
    if (status) {
        filteredLeads = filteredLeads.filter(l => l.status === status);
    }

    const paginatedLeads = filteredLeads.slice(offset, offset + parseInt(limit));

    res.json({
        leads: paginatedLeads,
        total: filteredLeads.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
});

// Get single lead
app.get('/api/leads/:id', (req, res) => {
    const lead = leads.find(l => l.id === parseInt(req.params.id));

    if (!lead) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
});

// Update lead status
app.patch('/api/leads/:id', (req, res) => {
    const leadIndex = leads.findIndex(l => l.id === parseInt(req.params.id));

    if (leadIndex === -1) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    leads[leadIndex] = { ...leads[leadIndex], ...req.body, updated_at: new Date().toISOString() };
    res.json(leads[leadIndex]);
});

// Delete lead
app.delete('/api/leads/:id', (req, res) => {
    const leadIndex = leads.findIndex(l => l.id === parseInt(req.params.id));

    if (leadIndex === -1) {
        return res.status(404).json({ error: 'Lead not found' });
    }

    leads.splice(leadIndex, 1);
    res.json({ success: true });
});

// Add test lead (for demo purposes)
app.post('/api/leads/test', (req, res) => {
    const testLead = {
        id: leadId++,
        leadgen_id: `test_${Date.now()}`,
        full_name: req.body.name || 'Test Lead',
        email: req.body.email || 'test@example.com',
        phone_number: req.body.phone || '+91 98765 43210',
        source: 'meta_lead_ads',
        status: 'new',
        created_time: new Date().toISOString(),
        received_at: new Date().toISOString()
    };

    leads.unshift(testLead);
    console.log('✅ Test lead created:', testLead);

    res.json(testLead);
});

// ==================== Meta Configuration ====================

// Test Meta connection
app.post('/api/meta/test-connection', async (req, res) => {
    const { access_token, page_id } = req.body;

    if (!access_token || !page_id) {
        return res.status(400).json({ error: 'Missing access_token or page_id' });
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${page_id}?fields=name,id&access_token=${access_token}`
        );

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ success: false, error: data.error.message });
        }

        res.json({
            success: true,
            page_name: data.name,
            page_id: data.id
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get lead forms for a page
app.get('/api/meta/forms', async (req, res) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const pageId = process.env.META_PAGE_ID;

    if (!accessToken || !pageId) {
        return res.json({ forms: [], message: 'Meta credentials not configured' });
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${pageId}/leadgen_forms?access_token=${accessToken}`
        );

        const data = await response.json();
        res.json({ forms: data.data || [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== Stats ====================

app.get('/api/stats', (req, res) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const todayLeads = leads.filter(l => l.received_at?.startsWith(today));
    const newLeads = leads.filter(l => l.status === 'new');
    const metaLeads = leads.filter(l => l.source === 'meta_lead_ads');

    res.json({
        total_leads: leads.length,
        today_leads: todayLeads.length,
        new_leads: newLeads.length,
        meta_leads: metaLeads.length,
        sources: {
            meta_lead_ads: metaLeads.length,
            manual: leads.filter(l => l.source === 'manual').length
        }
    });
});

// ==================== Server Start ====================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║        🚀 Meta Lead Ads Backend Server                ║
╠═══════════════════════════════════════════════════════╣
║  Server:    http://localhost:${PORT}                     ║
║  Webhook:   http://localhost:${PORT}/api/webhook/meta    ║
║  Leads API: http://localhost:${PORT}/api/leads           ║
╚═══════════════════════════════════════════════════════╝

📋 Endpoints:
   GET  /api/health           - Health check
   GET  /api/webhook/meta     - Webhook verification
   POST /api/webhook/meta     - Receive leads from Meta
   GET  /api/leads            - Get all leads
   POST /api/leads/test       - Create test lead
   POST /api/meta/test-connection - Test Meta connection
   GET  /api/stats            - Get lead statistics

⚡ Ready to receive Meta Lead Ads!
    `);
});
