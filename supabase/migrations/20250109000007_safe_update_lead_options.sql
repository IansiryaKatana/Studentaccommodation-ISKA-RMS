-- Update existing room grades to match Elementor form options
UPDATE "public"."lead_room_grades" 
SET "name" = 'Silver', "description" = 'Silver studio with modern facilities'
WHERE "id" = '770e8400-e29b-41d4-a716-446655440001';

UPDATE "public"."lead_room_grades" 
SET "name" = 'Gold', "description" = 'Gold studio with premium facilities'
WHERE "id" = '770e8400-e29b-41d4-a716-446655440002';

UPDATE "public"."lead_room_grades" 
SET "name" = 'Platinum', "description" = 'Platinum studio with luxury facilities'
WHERE "id" = '770e8400-e29b-41d4-a716-446655440003';

-- Add new room grades for Rhodium and Rhodium Plus
INSERT INTO "public"."lead_room_grades" ("id", "name", "description", "is_active", "created_at", "updated_at") VALUES
    ('770e8400-e29b-41d4-a716-446655440004', 'Rhodium', 'Rhodium studio with premium amenities', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440005', 'Rhodium Plus', 'Rhodium Plus studio with luxury amenities', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Update existing duration types to match Elementor form options
UPDATE "public"."lead_duration_types" 
SET "name" = '45 Weeks', "description" = '45 weeks stay'
WHERE "id" = '770e8400-e29b-41d4-a716-446655440001';

UPDATE "public"."lead_duration_types" 
SET "name" = '51 Weeks', "description" = '51 weeks stay'
WHERE "id" = '770e8400-e29b-41d4-a716-446655440002';

UPDATE "public"."lead_duration_types" 
SET "name" = 'Short Stay', "description" = 'Short term stay'
WHERE "id" = '770e8400-e29b-41d4-a716-446655440003';

-- Add new duration types
INSERT INTO "public"."lead_duration_types" ("id", "name", "description", "is_active", "created_at", "updated_at") VALUES
    ('770e8400-e29b-41d4-a716-446655440004', 'Long-Term Stay', 'Long term stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440005', 'Not Sure Yet', 'Duration to be determined', true, now(), now())
ON CONFLICT (id) DO NOTHING;
