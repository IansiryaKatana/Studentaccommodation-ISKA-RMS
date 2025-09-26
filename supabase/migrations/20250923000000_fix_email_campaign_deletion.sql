-- Fix email campaign deletion by adding CASCADE delete behavior
-- This migration fixes the foreign key constraint issue

-- Drop the existing foreign key constraint
ALTER TABLE email_deliveries 
DROP CONSTRAINT IF EXISTS email_deliveries_campaign_id_fkey;

-- Recreate the foreign key constraint with CASCADE delete
ALTER TABLE email_deliveries 
ADD CONSTRAINT email_deliveries_campaign_id_fkey 
FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE;

-- Also fix the template_id foreign key for consistency
ALTER TABLE email_deliveries 
DROP CONSTRAINT IF EXISTS email_deliveries_template_id_fkey;

ALTER TABLE email_deliveries 
ADD CONSTRAINT email_deliveries_template_id_fkey 
FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

-- Fix student_id foreign key as well
ALTER TABLE email_deliveries 
DROP CONSTRAINT IF EXISTS email_deliveries_student_id_fkey;

ALTER TABLE email_deliveries 
ADD CONSTRAINT email_deliveries_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL;

-- Fix email_campaigns template_id foreign key
ALTER TABLE email_campaigns 
DROP CONSTRAINT IF EXISTS email_campaigns_template_id_fkey;

ALTER TABLE email_campaigns 
ADD CONSTRAINT email_campaigns_template_id_fkey 
FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

-- Fix email_campaigns created_by foreign key
ALTER TABLE email_campaigns 
DROP CONSTRAINT IF EXISTS email_campaigns_created_by_fkey;

ALTER TABLE email_campaigns 
ADD CONSTRAINT email_campaigns_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Fix email_templates created_by foreign key
ALTER TABLE email_templates 
DROP CONSTRAINT IF EXISTS email_templates_created_by_fkey;

ALTER TABLE email_templates 
ADD CONSTRAINT email_templates_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Fix automated_email_rules foreign keys
ALTER TABLE automated_email_rules 
DROP CONSTRAINT IF EXISTS automated_email_rules_template_id_fkey;

ALTER TABLE automated_email_rules 
ADD CONSTRAINT automated_email_rules_template_id_fkey 
FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL;

ALTER TABLE automated_email_rules 
DROP CONSTRAINT IF EXISTS automated_email_rules_created_by_fkey;

ALTER TABLE automated_email_rules 
ADD CONSTRAINT automated_email_rules_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL;

-- Fix email_analytics_summary foreign key
ALTER TABLE email_analytics_summary 
DROP CONSTRAINT IF EXISTS email_analytics_summary_campaign_id_fkey;

ALTER TABLE email_analytics_summary 
ADD CONSTRAINT email_analytics_summary_campaign_id_fkey 
FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE;

-- Fix student_email_preferences foreign key
ALTER TABLE student_email_preferences 
DROP CONSTRAINT IF EXISTS student_email_preferences_student_id_fkey;

ALTER TABLE student_email_preferences 
ADD CONSTRAINT student_email_preferences_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

