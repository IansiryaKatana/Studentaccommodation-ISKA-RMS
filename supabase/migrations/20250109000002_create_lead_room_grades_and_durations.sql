-- Create lead-specific room grades and duration tables
-- This ensures no interference with the student module's existing tables

-- Create lead_room_grades table (separate from room_grades)
CREATE TABLE IF NOT EXISTS "public"."lead_room_grades" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."lead_room_grades" OWNER TO "postgres";

-- Add primary key constraint
ALTER TABLE ONLY "public"."lead_room_grades"
    ADD CONSTRAINT "lead_room_grades_pkey" PRIMARY KEY ("id");

-- Create lead_duration_types table (separate from durations)
CREATE TABLE IF NOT EXISTS "public"."lead_duration_types" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."lead_duration_types" OWNER TO "postgres";

-- Add primary key constraint
ALTER TABLE ONLY "public"."lead_duration_types"
    ADD CONSTRAINT "lead_duration_types_pkey" PRIMARY KEY ("id");

-- Add foreign key columns to leads table
ALTER TABLE "public"."leads" 
ADD COLUMN IF NOT EXISTS "room_grade_preference_id" "uuid",
ADD COLUMN IF NOT EXISTS "duration_type_preference_id" "uuid",
ADD COLUMN IF NOT EXISTS "estimated_revenue" numeric(10,2);

-- Add foreign key constraints
ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_room_grade_preference_id_fkey" 
    FOREIGN KEY ("room_grade_preference_id") REFERENCES "public"."lead_room_grades"("id");

ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_duration_type_preference_id_fkey" 
    FOREIGN KEY ("duration_type_preference_id") REFERENCES "public"."lead_duration_types"("id");

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS "idx_leads_room_grade_preference_id" ON "public"."leads" USING "btree" ("room_grade_preference_id");
CREATE INDEX IF NOT EXISTS "idx_leads_duration_type_preference_id" ON "public"."leads" USING "btree" ("duration_type_preference_id");

-- Add comments for documentation
COMMENT ON COLUMN "public"."leads"."room_grade_preference_id" IS 'Lead preference for room grade (Silver, Gold, Platinum, etc.)';
COMMENT ON COLUMN "public"."leads"."duration_type_preference_id" IS 'Lead preference for stay duration type (Short Stay, Long-Term Stay, etc.)';
COMMENT ON COLUMN "public"."leads"."estimated_revenue" IS 'Estimated revenue from this lead based on preferences and budget';

-- Grant permissions
GRANT ALL ON TABLE "public"."lead_room_grades" TO "anon";
GRANT ALL ON TABLE "public"."lead_room_grades" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_room_grades" TO "service_role";

GRANT ALL ON TABLE "public"."lead_duration_types" TO "anon";
GRANT ALL ON TABLE "public"."lead_duration_types" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_duration_types" TO "service_role";

-- Insert sample data based on your CSV analysis
INSERT INTO "public"."lead_room_grades" ("id", "name", "description", "is_active", "created_at", "updated_at") VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Silver Studio', 'Standard studio accommodation', true, now(), now()),
    ('550e8400-e29b-41d4-a716-446655440002', 'Gold Studio', 'Premium studio accommodation', true, now(), now()),
    ('550e8400-e29b-41d4-a716-446655440003', 'Platinum Studio', 'Luxury studio accommodation', true, now(), now()),
    ('550e8400-e29b-41d4-a716-446655440004', 'Not Specified', 'No specific room grade preference', true, now(), now());

INSERT INTO "public"."lead_duration_types" ("id", "name", "description", "is_active", "created_at", "updated_at") VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'Short Stay', 'Short-term accommodation (less than 6 months)', true, now(), now()),
    ('660e8400-e29b-41d4-a716-446655440002', 'Long-Term Stay', 'Long-term accommodation (6+ months)', true, now(), now()),
    ('660e8400-e29b-41d4-a716-446655440003', 'Not Specified', 'No specific duration preference', true, now(), now());

-- Verify the changes
SELECT 'Lead room grades and duration types tables created successfully!' as status;
