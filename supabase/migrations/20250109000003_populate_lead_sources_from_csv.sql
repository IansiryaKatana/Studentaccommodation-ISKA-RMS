-- Populate lead_sources table with sources from CSV analysis
-- This ensures proper mapping from CSV data to database

-- Insert lead sources based on CSV analysis
INSERT INTO "public"."lead_sources" ("id", "name", "description", "is_active", "created_at") VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Websites', 'Direct website inquiries', true, now()),
    ('770e8400-e29b-41d4-a716-446655440002', 'WhatsApp', 'WhatsApp inquiries and communications', true, now()),
    ('770e8400-e29b-41d4-a716-446655440003', 'Google Ads', 'Google advertising campaigns', true, now()),
    ('770e8400-e29b-41d4-a716-446655440004', 'Referrals', 'Word of mouth and referral inquiries', true, now()),
    ('770e8400-e29b-41d4-a716-446655440005', 'Meta Ads', 'Facebook and Instagram advertising', true, now())
ON CONFLICT (id) DO NOTHING;

-- Update existing lead sources to match CSV data if they exist
UPDATE "public"."lead_sources" 
SET name = 'Websites' 
WHERE name = 'Website';

UPDATE "public"."lead_sources" 
SET name = 'Google Ads' 
WHERE name = 'Online Advertising';

-- Verify the changes
SELECT 'Lead sources populated successfully!' as status;
