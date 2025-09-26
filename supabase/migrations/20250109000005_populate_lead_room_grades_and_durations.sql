-- Populate lead_room_grades table
INSERT INTO "public"."lead_room_grades" ("id", "name", "description", "is_active", "created_at", "updated_at") VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Standard', 'Standard room grade with basic amenities', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440002', 'Deluxe', 'Deluxe room grade with enhanced amenities', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440003', 'Premium', 'Premium room grade with luxury amenities', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440004', 'Silver', 'Silver studio with modern facilities', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440005', 'Gold', 'Gold studio with premium facilities', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440006', 'Platinum', 'Platinum studio with luxury facilities', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Populate lead_duration_types table
INSERT INTO "public"."lead_duration_types" ("id", "name", "description", "is_active", "created_at", "updated_at") VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '1 Week', 'One week stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440002', '2 Weeks', 'Two weeks stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440003', '1 Month', 'One month stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440004', '3 Months', 'Three months stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440005', '6 Months', 'Six months stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440006', '1 Year', 'One year stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440007', '45 Weeks', '45 weeks stay', true, now(), now()),
    ('770e8400-e29b-41d4-a716-446655440008', '51 Weeks', '51 weeks stay', true, now(), now())
ON CONFLICT (id) DO NOTHING;
