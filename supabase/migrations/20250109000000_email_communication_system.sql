-- Email Communication System Migration
-- This migration creates the necessary tables for the email communication system

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'payment_reminder', 'overdue_notice', 'general_announcement', etc.
    subject VARCHAR(500) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    variables JSONB DEFAULT '[]'::jsonb, -- Available template variables
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Campaigns Table
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_id UUID REFERENCES email_templates(id),
    target_criteria JSONB DEFAULT '{}'::jsonb, -- Student selection criteria
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Deliveries Table (Individual email tracking)
CREATE TABLE IF NOT EXISTS email_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id),
    student_id UUID REFERENCES students(id),
    template_id UUID REFERENCES email_templates(id),
    email_address VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated Email Rules Table
CREATE TABLE IF NOT EXISTS automated_email_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(100) NOT NULL, -- 'payment_reminder', 'overdue_notice', 'welcome', etc.
    trigger_conditions JSONB NOT NULL, -- When to trigger (e.g., days before/after due date)
    template_id UUID REFERENCES email_templates(id),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Preferences Table (Student communication preferences)
CREATE TABLE IF NOT EXISTS student_email_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) UNIQUE,
    payment_reminders BOOLEAN DEFAULT true,
    overdue_notices BOOLEAN DEFAULT true,
    general_announcements BOOLEAN DEFAULT true,
    maintenance_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Europe/London',
    quiet_hours_start TIME DEFAULT '22:00',
    quiet_hours_end TIME DEFAULT '08:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email Analytics Summary Table (for performance)
CREATE TABLE IF NOT EXISTS email_analytics_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES email_campaigns(id),
    date DATE NOT NULL,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    bounced_count INTEGER DEFAULT 0,
    payment_conversions INTEGER DEFAULT 0, -- Students who made payments after receiving email
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_scheduled ON email_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_campaign ON email_deliveries(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_student ON email_deliveries(student_id);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_status ON email_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_automated_rules_active ON automated_email_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automated_rules_trigger ON automated_email_rules(trigger_type);

-- Add RLS policies
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_email_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_analytics_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_templates
CREATE POLICY "Users can view email templates" ON email_templates FOR SELECT USING (true);
CREATE POLICY "Users can insert email templates" ON email_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update email templates" ON email_templates FOR UPDATE USING (true);
CREATE POLICY "Users can delete email templates" ON email_templates FOR DELETE USING (true);

-- RLS Policies for email_campaigns
CREATE POLICY "Users can view email campaigns" ON email_campaigns FOR SELECT USING (true);
CREATE POLICY "Users can insert email campaigns" ON email_campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update email campaigns" ON email_campaigns FOR UPDATE USING (true);
CREATE POLICY "Users can delete email campaigns" ON email_campaigns FOR DELETE USING (true);

-- RLS Policies for email_deliveries
CREATE POLICY "Users can view email deliveries" ON email_deliveries FOR SELECT USING (true);
CREATE POLICY "Users can insert email deliveries" ON email_deliveries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update email deliveries" ON email_deliveries FOR UPDATE USING (true);

-- RLS Policies for automated_email_rules
CREATE POLICY "Users can view automated email rules" ON automated_email_rules FOR SELECT USING (true);
CREATE POLICY "Users can insert automated email rules" ON automated_email_rules FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update automated email rules" ON automated_email_rules FOR UPDATE USING (true);
CREATE POLICY "Users can delete automated email rules" ON automated_email_rules FOR DELETE USING (true);

-- RLS Policies for student_email_preferences
CREATE POLICY "Users can view student email preferences" ON student_email_preferences FOR SELECT USING (true);
CREATE POLICY "Users can insert student email preferences" ON student_email_preferences FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update student email preferences" ON student_email_preferences FOR UPDATE USING (true);

-- RLS Policies for email_analytics_summary
CREATE POLICY "Users can view email analytics" ON email_analytics_summary FOR SELECT USING (true);
CREATE POLICY "Users can insert email analytics" ON email_analytics_summary FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update email analytics" ON email_analytics_summary FOR UPDATE USING (true);

-- Insert default email templates
INSERT INTO email_templates (name, category, subject, html_content, text_content, variables) VALUES
(
    'Payment Reminder - 7 Days',
    'payment_reminder',
    'Payment Reminder - {{student_name}}, Invoice {{invoice_number}} Due in 7 Days',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Payment Reminder</h2>
        <p>Dear {{student_name}},</p>
        <p>This is a friendly reminder that your payment for invoice <strong>{{invoice_number}}</strong> is due in 7 days.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Payment Details:</h3>
            <p><strong>Amount Due:</strong> £{{amount_due}}</p>
            <p><strong>Due Date:</strong> {{due_date}}</p>
            <p><strong>Invoice Number:</strong> {{invoice_number}}</p>
        </div>
        <p>You can make your payment through the student portal or contact us for assistance.</p>
        <p>Thank you for your prompt attention to this matter.</p>
        <p>Best regards,<br>ISKA RMS Team</p>
    </div>
</body>
</html>',
    'Payment Reminder

Dear {{student_name}},

This is a friendly reminder that your payment for invoice {{invoice_number}} is due in 7 days.

Payment Details:
- Amount Due: £{{amount_due}}
- Due Date: {{due_date}}
- Invoice Number: {{invoice_number}}

You can make your payment through the student portal or contact us for assistance.

Thank you for your prompt attention to this matter.

Best regards,
ISKA RMS Team',
    '["student_name", "invoice_number", "amount_due", "due_date"]'
),
(
    'Overdue Notice - 3 Days',
    'overdue_notice',
    'URGENT: Overdue Payment - {{student_name}}, Invoice {{invoice_number}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Overdue Payment Notice</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">Overdue Payment Notice</h2>
        <p>Dear {{student_name}},</p>
        <p>We are writing to inform you that your payment for invoice <strong>{{invoice_number}}</strong> is now 3 days overdue.</p>
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="color: #dc2626;">Payment Details:</h3>
            <p><strong>Amount Due:</strong> £{{amount_due}}</p>
            <p><strong>Due Date:</strong> {{due_date}}</p>
            <p><strong>Days Overdue:</strong> {{days_overdue}}</p>
            <p><strong>Invoice Number:</strong> {{invoice_number}}</p>
        </div>
        <p>Please make your payment immediately to avoid any additional charges or service interruptions.</p>
        <p>If you have already made this payment, please disregard this notice.</p>
        <p>If you are experiencing financial difficulties, please contact us immediately to discuss payment arrangements.</p>
        <p>Best regards,<br>ISKA RMS Team</p>
    </div>
</body>
</html>',
    'Overdue Payment Notice

Dear {{student_name}},

We are writing to inform you that your payment for invoice {{invoice_number}} is now 3 days overdue.

Payment Details:
- Amount Due: £{{amount_due}}
- Due Date: {{due_date}}
- Days Overdue: {{days_overdue}}
- Invoice Number: {{invoice_number}}

Please make your payment immediately to avoid any additional charges or service interruptions.

If you have already made this payment, please disregard this notice.

If you are experiencing financial difficulties, please contact us immediately to discuss payment arrangements.

Best regards,
ISKA RMS Team',
    '["student_name", "invoice_number", "amount_due", "due_date", "days_overdue"]'
),
(
    'General Announcement Template',
    'general_announcement',
    '{{announcement_title}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{announcement_title}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">{{announcement_title}}</h2>
        <p>Dear {{student_name}},</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
            {{announcement_content}}
        </div>
        <p>If you have any questions, please don''t hesitate to contact us.</p>
        <p>Best regards,<br>ISKA RMS Team</p>
    </div>
</body>
</html>',
    '{{announcement_title}}

Dear {{student_name}},

{{announcement_content}}

If you have any questions, please don''t hesitate to contact us.

Best regards,
ISKA RMS Team',
    '["student_name", "announcement_title", "announcement_content"]'
);

-- Insert default automated email rules
INSERT INTO automated_email_rules (name, description, trigger_type, trigger_conditions, template_id) VALUES
(
    'Payment Reminder - 7 Days Before',
    'Sends payment reminder 7 days before due date',
    'payment_reminder',
    '{"days_before": 7, "conditions": {"status": "pending"}}',
    (SELECT id FROM email_templates WHERE name = 'Payment Reminder - 7 Days' LIMIT 1)
),
(
    'Payment Reminder - 3 Days Before',
    'Sends payment reminder 3 days before due date',
    'payment_reminder',
    '{"days_before": 3, "conditions": {"status": "pending"}}',
    (SELECT id FROM email_templates WHERE name = 'Payment Reminder - 7 Days' LIMIT 1)
),
(
    'Overdue Notice - 3 Days',
    'Sends overdue notice 3 days after due date',
    'overdue_notice',
    '{"days_after": 3, "conditions": {"status": "pending"}}',
    (SELECT id FROM email_templates WHERE name = 'Overdue Notice - 3 Days' LIMIT 1)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_automated_email_rules_updated_at BEFORE UPDATE ON automated_email_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_email_preferences_updated_at BEFORE UPDATE ON student_email_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
