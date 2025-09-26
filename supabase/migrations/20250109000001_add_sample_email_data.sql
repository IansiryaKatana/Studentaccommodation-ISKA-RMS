-- Add sample email templates
INSERT INTO email_templates (name, category, subject, html_content, text_content, variables) VALUES
('Payment Reminder', 'payment', 'Payment Reminder - Invoice #{invoiceNumber}', 
 '<h2>Payment Reminder</h2><p>Dear {studentName},</p><p>Your payment for invoice #{invoiceNumber} is due. Amount: ${amount}</p>',
 'Dear {studentName}, Your payment for invoice #{invoiceNumber} is due. Amount: ${amount}',
 '["studentName", "invoiceNumber", "amount"]'::jsonb),
 
('Welcome Email', 'onboarding', 'Welcome to ISKA - {studentName}',
 '<h2>Welcome {studentName}!</h2><p>We are excited to have you join ISKA.</p>',
 'Welcome {studentName}! We are excited to have you join ISKA.',
 '["studentName"]'::jsonb),
 
('Payment Overdue', 'payment', 'URGENT: Payment Overdue - Invoice #{invoiceNumber}',
 '<h2>Payment Overdue</h2><p>Dear {studentName},</p><p>Your payment for invoice #{invoiceNumber} is overdue. Please pay ${amount} immediately.</p>',
 'Dear {studentName}, Your payment for invoice #{invoiceNumber} is overdue. Please pay ${amount} immediately.',
 '["studentName", "invoiceNumber", "amount"]'::jsonb);

-- Add sample email campaign
INSERT INTO email_campaigns (name, template_id, target_criteria, status, total_recipients) 
SELECT 
  'October Payment Reminders',
  et.id,
  '{"paymentStatus": "overdue"}'::jsonb,
  'draft',
  0
FROM email_templates et WHERE et.name = 'Payment Reminder' LIMIT 1;
