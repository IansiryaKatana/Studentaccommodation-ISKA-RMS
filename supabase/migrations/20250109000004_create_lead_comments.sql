-- Create lead_comments table
CREATE TABLE IF NOT EXISTS "public"."lead_comments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "lead_id" "uuid" NOT NULL,
    "author_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

-- Add primary key
ALTER TABLE ONLY "public"."lead_comments"
    ADD CONSTRAINT "lead_comments_pkey" PRIMARY KEY ("id");

-- Add foreign key constraints
ALTER TABLE ONLY "public"."lead_comments"
    ADD CONSTRAINT "lead_comments_lead_id_fkey" 
    FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."lead_comments"
    ADD CONSTRAINT "lead_comments_author_id_fkey" 
    FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_lead_comments_lead_id" ON "public"."lead_comments" ("lead_id");
CREATE INDEX IF NOT EXISTS "idx_lead_comments_created_at" ON "public"."lead_comments" ("created_at" DESC);

-- Enable RLS
ALTER TABLE "public"."lead_comments" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view lead comments" ON "public"."lead_comments"
    FOR SELECT USING (true);

CREATE POLICY "Users can insert lead comments" ON "public"."lead_comments"
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own lead comments" ON "public"."lead_comments"
    FOR UPDATE USING ("author_id" = auth.uid());

CREATE POLICY "Users can delete their own lead comments" ON "public"."lead_comments"
    FOR DELETE USING ("author_id" = auth.uid());
