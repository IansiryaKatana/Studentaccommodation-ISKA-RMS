-- Create viewing_bookings table for "Booked a Viewing" leads
CREATE TABLE IF NOT EXISTS "public"."viewing_bookings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255),
    "phone" character varying(20),
    "source_id" "uuid",
    "status" "public"."lead_status" DEFAULT 'new'::lead_status,
    "notes" "text",
    "assigned_to" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "room_grade_preference_id" "uuid",
    "duration_type_preference_id" "uuid",
    "estimated_revenue" numeric(10,2),
    "booking_datetime" timestamp with time zone NOT NULL
);

-- Add primary key constraint
ALTER TABLE ONLY "public"."viewing_bookings" ADD CONSTRAINT "viewing_bookings_pkey" PRIMARY KEY ("id");

-- Add foreign key constraints
ALTER TABLE ONLY "public"."viewing_bookings" ADD CONSTRAINT "viewing_bookings_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."lead_sources"("id");
ALTER TABLE ONLY "public"."viewing_bookings" ADD CONSTRAINT "viewing_bookings_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id");
ALTER TABLE ONLY "public"."viewing_bookings" ADD CONSTRAINT "viewing_bookings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");
ALTER TABLE ONLY "public"."viewing_bookings" ADD CONSTRAINT "viewing_bookings_room_grade_preference_id_fkey" FOREIGN KEY ("room_grade_preference_id") REFERENCES "public"."lead_room_grades"("id");
ALTER TABLE ONLY "public"."viewing_bookings" ADD CONSTRAINT "viewing_bookings_duration_type_preference_id_fkey" FOREIGN KEY ("duration_type_preference_id") REFERENCES "public"."lead_duration_types"("id");

-- Add indexes for better performance
CREATE INDEX "idx_viewing_bookings_status" ON "public"."viewing_bookings" ("status");
CREATE INDEX "idx_viewing_bookings_assigned_to" ON "public"."viewing_bookings" ("assigned_to");
CREATE INDEX "idx_viewing_bookings_created_at" ON "public"."viewing_bookings" ("created_at");
CREATE INDEX "idx_viewing_bookings_booking_datetime" ON "public"."viewing_bookings" ("booking_datetime");
CREATE INDEX "idx_viewing_bookings_source_id" ON "public"."viewing_bookings" ("source_id");

-- Add RLS policies
ALTER TABLE "public"."viewing_bookings" ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read all viewing bookings
CREATE POLICY "viewing_bookings_select_policy" ON "public"."viewing_bookings"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert viewing bookings
CREATE POLICY "viewing_bookings_insert_policy" ON "public"."viewing_bookings"
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update viewing bookings
CREATE POLICY "viewing_bookings_update_policy" ON "public"."viewing_bookings"
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete viewing bookings
CREATE POLICY "viewing_bookings_delete_policy" ON "public"."viewing_bookings"
    FOR DELETE USING (auth.role() = 'authenticated');
