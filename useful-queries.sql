-- ============================================
-- USEFUL SQL QUERIES FOR CLIENTCARE CRM
-- ============================================

-- ============================================
-- 1. ANALYTICS & REPORTING QUERIES
-- ============================================

-- Get lead conversion rate by source
SELECT 
  source,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_leads,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted')::decimal / COUNT(*) * 100, 2) as conversion_rate
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
GROUP BY source
ORDER BY conversion_rate DESC;

-- Get monthly lead trends
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted,
  COUNT(*) FILTER (WHERE status = 'lost') as lost
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND created_at >= NOW() - INTERVAL '6 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Top performing team members (by conversions)
SELECT 
  u.email,
  u.raw_user_meta_data->>'full_name' as name,
  COUNT(l.id) as total_leads,
  COUNT(*) FILTER (WHERE l.status = 'converted') as conversions,
  ROUND(COUNT(*) FILTER (WHERE l.status = 'converted')::decimal / COUNT(l.id) * 100, 2) as conversion_rate
FROM leads l
JOIN auth.users u ON l.assigned_to = u.id
WHERE l.organization_id = 'YOUR_ORG_ID'
GROUP BY u.id, u.email, u.raw_user_meta_data
ORDER BY conversions DESC
LIMIT 10;

-- Leads requiring follow-up (contacted but not converted/lost)
SELECT 
  id,
  name,
  phone,
  email,
  status,
  assigned_to,
  created_at,
  updated_at,
  DATE_PART('day', NOW() - updated_at) as days_since_update
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND status IN ('contacted', 'qualified')
  AND DATE_PART('day', NOW() - updated_at) > 3
ORDER BY updated_at ASC;

-- ============================================
-- 2. DATA MANAGEMENT QUERIES
-- ============================================

-- Find duplicate leads (by phone)
SELECT 
  phone,
  COUNT(*) as duplicate_count,
  STRING_AGG(name, ', ') as names,
  STRING_AGG(id::text, ', ') as lead_ids
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
GROUP BY phone
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Bulk update lead status
UPDATE leads
SET status = 'lost', updated_at = NOW()
WHERE organization_id = 'YOUR_ORG_ID'
  AND status = 'new'
  AND created_at < NOW() - INTERVAL '30 days';

-- Reassign leads from one user to another
UPDATE leads
SET assigned_to = 'NEW_USER_ID', updated_at = NOW()
WHERE organization_id = 'YOUR_ORG_ID'
  AND assigned_to = 'OLD_USER_ID'
  AND status NOT IN ('converted', 'lost');

-- ============================================
-- 3. ORGANIZATION & TEAM QUERIES
-- ============================================

-- Get organization with all members
SELECT 
  o.*,
  json_agg(
    json_build_object(
      'user_id', om.user_id,
      'role', om.role,
      'email', u.email,
      'name', u.raw_user_meta_data->>'full_name',
      'joined_at', om.joined_at
    )
  ) as members
FROM organizations o
LEFT JOIN organization_members om ON o.id = om.organization_id
LEFT JOIN auth.users u ON om.user_id = u.id
WHERE o.id = 'YOUR_ORG_ID'
GROUP BY o.id;

-- Check subscription status and usage
SELECT 
  o.name,
  o.subscription_tier,
  o.subscription_status,
  o.trial_ends_at,
  COUNT(DISTINCT l.id) FILTER (WHERE l.created_at >= DATE_TRUNC('month', NOW())) as leads_this_month,
  COUNT(DISTINCT om.user_id) as team_members
FROM organizations o
LEFT JOIN leads l ON o.id = l.organization_id
LEFT JOIN organization_members om ON o.id = om.organization_id
WHERE o.id = 'YOUR_ORG_ID'
GROUP BY o.id, o.name, o.subscription_tier, o.subscription_status, o.trial_ends_at;

-- ============================================
-- 4. META & GOOGLE ADS ANALYTICS
-- ============================================

-- Meta Ads campaign performance
SELECT 
  meta_data->>'campaign_id' as campaign_id,
  meta_data->>'campaign_name' as campaign_name,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as conversions,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted')::decimal / COUNT(*) * 100, 2) as conversion_rate,
  AVG(EXTRACT(epoch FROM (updated_at - created_at)) / 3600)::integer as avg_hours_to_convert
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND source = 'meta'
  AND meta_data IS NOT NULL
GROUP BY meta_data->>'campaign_id', meta_data->>'campaign_name'
ORDER BY total_leads DESC;

-- Google Ads keyword performance
SELECT 
  google_data->>'keyword' as keyword,
  google_data->>'match_type' as match_type,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as conversions,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted')::decimal / COUNT(*) * 100, 2) as conversion_rate
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND source = 'google'
  AND google_data IS NOT NULL
  AND google_data->>'keyword' IS NOT NULL
GROUP BY google_data->>'keyword', google_data->>'match_type'
ORDER BY total_leads DESC;

-- ============================================
-- 5. MAINTENANCE & CLEANUP QUERIES
-- ============================================

-- Delete test leads
DELETE FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND (
    name ILIKE '%test%'
    OR email ILIKE '%test%'
    OR phone ILIKE '%1111111111%'
  );

-- Archive old converted/lost leads (move to archive table if needed)
-- First create archive table
CREATE TABLE IF NOT EXISTS leads_archive (LIKE leads INCLUDING ALL);

-- Move old leads to archive
INSERT INTO leads_archive
SELECT * FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND status IN ('converted', 'lost')
  AND updated_at < NOW() - INTERVAL '1 year';

-- Delete archived leads from main table
DELETE FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND status IN ('converted', 'lost')
  AND updated_at < NOW() - INTERVAL '1 year';

-- ============================================
-- 6. EXPORT QUERIES
-- ============================================

-- Export leads for Excel/CSV
SELECT 
  name,
  phone,
  email,
  service,
  city,
  state,
  source,
  status,
  created_at::date as created_date,
  updated_at::date as updated_date
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- Export with custom fields (Meta/Google data)
SELECT 
  name,
  phone,
  email,
  source,
  status,
  CASE 
    WHEN source = 'meta' THEN meta_data->>'campaign_name'
    WHEN source = 'google' THEN google_data->>'campaign_name'
  END as campaign_name,
  CASE 
    WHEN source = 'meta' THEN meta_data->>'ad_name'
    WHEN source = 'google' THEN google_data->>'ad_name'
  END as ad_name,
  created_at
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND source IN ('meta', 'google')
ORDER BY created_at DESC;

-- ============================================
-- 7. DASHBOARD STATISTICS
-- ============================================

-- Get all key metrics for dashboard
SELECT 
  -- Lead counts
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as leads_today,
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())) as leads_this_week,
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) as leads_this_month,
  
  -- Status breakdown
  COUNT(*) FILTER (WHERE status = 'new') as new_leads,
  COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
  COUNT(*) FILTER (WHERE status = 'qualified') as qualified_leads,
  COUNT(*) FILTER (WHERE status = 'converted') as converted_leads,
  COUNT(*) FILTER (WHERE status = 'lost') as lost_leads,
  
  -- Conversion rate
  ROUND(
    COUNT(*) FILTER (WHERE status = 'converted')::decimal / 
    NULLIF(COUNT(*), 0) * 100, 
    2
  ) as conversion_rate,
  
  -- Source breakdown
  COUNT(*) FILTER (WHERE source = 'meta') as meta_leads,
  COUNT(*) FILTER (WHERE source = 'google') as google_leads,
  COUNT(*) FILTER (WHERE source = 'manual') as manual_leads
FROM leads
WHERE organization_id = 'YOUR_ORG_ID';

-- ============================================
-- 8. ADVANCED FUNCTIONS
-- ============================================

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  lead_record RECORD;
BEGIN
  SELECT * INTO lead_record FROM leads WHERE id = lead_id;
  
  -- Source score
  CASE lead_record.source
    WHEN 'meta' THEN score := score + 20;
    WHEN 'google' THEN score := score + 20;
    WHEN 'referral' THEN score := score + 30;
    ELSE score := score + 10;
  END CASE;
  
  -- Urgency score
  CASE lead_record.urgency
    WHEN 'immediate' THEN score := score + 40;
    WHEN 'this_week' THEN score := score + 30;
    WHEN 'this_month' THEN score := score + 20;
    ELSE score := score + 10;
  END CASE;
  
  -- Email provided
  IF lead_record.email IS NOT NULL THEN
    score := score + 15;
  END IF;
  
  -- Previous clinic visited
  IF lead_record.previous_clinic_visited THEN
    score := score + 25;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Use the function
SELECT 
  id,
  name,
  phone,
  status,
  calculate_lead_score(id) as score
FROM leads
WHERE organization_id = 'YOUR_ORG_ID'
  AND status = 'new'
ORDER BY calculate_lead_score(id) DESC
LIMIT 20;
