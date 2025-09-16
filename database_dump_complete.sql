

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'RLS completely disabled for performance. No authentication required for database access.';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."approval_status_enum" AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE "public"."approval_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."booking_status" AS ENUM (
    'pending',
    'confirmed',
    'checked_in',
    'checked_out',
    'cancelled'
);


ALTER TYPE "public"."booking_status" OWNER TO "postgres";


CREATE TYPE "public"."booking_type" AS ENUM (
    'student',
    'tourist'
);


ALTER TYPE "public"."booking_type" OWNER TO "postgres";


CREATE TYPE "public"."cleaning_status" AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'verified',
    'cancelled'
);


ALTER TYPE "public"."cleaning_status" OWNER TO "postgres";


CREATE TYPE "public"."file_category" AS ENUM (
    'invoice',
    'contract',
    'id_document',
    'payment_proof',
    'maintenance_photo',
    'cleaning_report',
    'lead_attachment',
    'student_document',
    'tourist_document',
    'system_backup',
    'general'
);


ALTER TYPE "public"."file_category" OWNER TO "postgres";


CREATE TYPE "public"."installment_status_enum" AS ENUM (
    'pending',
    'partially_paid',
    'completed',
    'processing',
    'failed',
    'refunded'
);


ALTER TYPE "public"."installment_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."lead_status" AS ENUM (
    'new',
    'contacted',
    'qualified',
    'proposal_sent',
    'negotiating',
    'won',
    'lost',
    'converted'
);


ALTER TYPE "public"."lead_status" OWNER TO "postgres";


CREATE TYPE "public"."payment_method" AS ENUM (
    'stripe',
    'bank_transfer',
    'cash',
    'check'
);


ALTER TYPE "public"."payment_method" OWNER TO "postgres";


CREATE TYPE "public"."payment_method_enum" AS ENUM (
    'stripe',
    'bank_transfer',
    'cash',
    'check',
    'cheque',
    'direct_deposit',
    'wire_transfer'
);


ALTER TYPE "public"."payment_method_enum" OWNER TO "postgres";


CREATE TYPE "public"."payment_status" AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'refunded'
);


ALTER TYPE "public"."payment_status" OWNER TO "postgres";


CREATE TYPE "public"."studio_status" AS ENUM (
    'vacant',
    'occupied',
    'dirty',
    'cleaning',
    'maintenance'
);


ALTER TYPE "public"."studio_status" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'administrator',
    'salesperson',
    'reservations',
    'cleaner',
    'accountant',
    'student',
    'super_admin',
    'admin',
    'reservationist',
    'operations_manager'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_file_share"("p_file_id" "uuid", "p_expires_at" timestamp with time zone DEFAULT NULL::timestamp with time zone, "p_max_downloads" integer DEFAULT 1, "p_created_by" "uuid" DEFAULT NULL::"uuid") RETURNS character varying
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_share_token VARCHAR(255);
BEGIN
    v_share_token := generate_share_token();
    
    INSERT INTO file_shares (file_id, share_token, expires_at, max_downloads, created_by)
    VALUES (p_file_id, v_share_token, p_expires_at, p_max_downloads, p_created_by);
    
    RETURN v_share_token;
END;
$$;


ALTER FUNCTION "public"."create_file_share"("p_file_id" "uuid", "p_expires_at" timestamp with time zone, "p_max_downloads" integer, "p_created_by" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_share_token"() RETURNS character varying
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN 'share_' || encode(gen_random_bytes(16), 'hex');
END;
$$;


ALTER FUNCTION "public"."generate_share_token"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_branding_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_branding_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_expenses_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_expenses_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_file_share"("p_share_token" character varying) RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_file_id UUID;
BEGIN
    SELECT fs.file_id INTO v_file_id
    FROM file_shares fs
    WHERE fs.share_token = p_share_token
    AND (fs.expires_at IS NULL OR fs.expires_at > NOW())
    AND (fs.max_downloads IS NULL OR fs.download_count < fs.max_downloads);
    
    IF v_file_id IS NOT NULL THEN
        UPDATE file_shares 
        SET download_count = download_count + 1
        WHERE share_token = p_share_token;
    END IF;
    
    RETURN v_file_id;
END;
$$;


ALTER FUNCTION "public"."validate_file_share"("p_share_token" character varying) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."audit_log" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "action" character varying(100) NOT NULL,
    "entity_type" character varying(50) NOT NULL,
    "entity_id" "uuid",
    "old_values" "jsonb",
    "new_values" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "action" character varying(100) NOT NULL,
    "resource_type" character varying(50),
    "resource_id" "uuid",
    "details" "jsonb",
    "ip_address" "inet",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."branding" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_name" character varying(255) DEFAULT 'ISKA RMS'::character varying NOT NULL,
    "company_address" "text",
    "company_phone" character varying(50),
    "company_email" character varying(255),
    "company_website" character varying(255),
    "logo_url" "text",
    "favicon_url" "text",
    "primary_color" character varying(7) DEFAULT '#3B82F6'::character varying,
    "secondary_color" character varying(7) DEFAULT '#1F2937'::character varying,
    "accent_color" character varying(7) DEFAULT '#10B981'::character varying,
    "font_family" character varying(100) DEFAULT 'Inter'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "dashboard_title" character varying(255) DEFAULT 'ISKA - RMS'::character varying,
    "dashboard_subtitle" character varying(500) DEFAULT 'Worldclass Student accommodation CRM'::character varying,
    "latitude" numeric(10,6),
    "longitude" numeric(10,6)
);


ALTER TABLE "public"."branding" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cleaners" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "hourly_rate" numeric(8,2) NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cleaners" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cleaning_tasks" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "studio_id" "uuid",
    "cleaner_id" "uuid",
    "scheduled_date" "date" NOT NULL,
    "scheduled_time" time without time zone,
    "estimated_duration" integer,
    "status" "public"."cleaning_status" DEFAULT 'scheduled'::"public"."cleaning_status",
    "notes" "text",
    "completed_at" timestamp with time zone,
    "verified_by" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."cleaning_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."durations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "duration_type" character varying(20) NOT NULL,
    "check_in_date" "date" NOT NULL,
    "check_out_date" "date" NOT NULL,
    "weeks_count" integer NOT NULL,
    "academic_year" character varying(20),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."durations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "maintenance_request_id" "uuid",
    "description" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "category" character varying(50) DEFAULT 'other'::character varying NOT NULL,
    "vendor_name" character varying(255),
    "expense_date" "date" DEFAULT CURRENT_DATE,
    "notes" "text",
    "receipt_file_url" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "expenses_amount_check" CHECK (("amount" > (0)::numeric))
);


ALTER TABLE "public"."expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_shares" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "file_id" "uuid",
    "share_token" character varying(255) NOT NULL,
    "expires_at" timestamp with time zone,
    "max_downloads" integer DEFAULT 1,
    "download_count" integer DEFAULT 0,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."file_shares" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."file_storage" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "filename" character varying(255) NOT NULL,
    "original_filename" character varying(255) NOT NULL,
    "file_path" "text" NOT NULL,
    "file_size" bigint NOT NULL,
    "mime_type" character varying(100) NOT NULL,
    "category" "public"."file_category" DEFAULT 'general'::"public"."file_category" NOT NULL,
    "description" "text",
    "tags" "text"[],
    "related_entity_type" character varying(50),
    "related_entity_id" "uuid",
    "uploaded_by" "uuid",
    "is_public" boolean DEFAULT false,
    "is_deleted" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."file_storage" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."installment_plans" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "number_of_installments" integer NOT NULL,
    "discount_percentage" numeric(5,2) DEFAULT 0,
    "late_fee_percentage" numeric(5,2) DEFAULT 0,
    "late_fee_flat" numeric(10,2) DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "late_fee_enabled" boolean DEFAULT false,
    "late_fee_days" integer DEFAULT 7,
    "due_dates" "jsonb" DEFAULT '[]'::"jsonb",
    "deposit_amount" numeric(10,2) DEFAULT 500.00
);


ALTER TABLE "public"."installment_plans" OWNER TO "postgres";


COMMENT ON COLUMN "public"."installment_plans"."due_dates" IS 'JSONB array of due dates for installments (e.g., ["2025-10-01", "2026-01-01"])';



COMMENT ON COLUMN "public"."installment_plans"."deposit_amount" IS 'Standard deposit amount for this installment plan in GBP';



CREATE TABLE IF NOT EXISTS "public"."invoices" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "invoice_number" character varying(50) NOT NULL,
    "reservation_id" "uuid",
    "reservation_installment_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "tax_amount" numeric(10,2) DEFAULT 0,
    "total_amount" numeric(10,2) NOT NULL,
    "due_date" "date" NOT NULL,
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status",
    "stripe_payment_intent_id" character varying(255),
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "xero_invoice_id" character varying(255),
    "xero_exported_at" timestamp with time zone,
    "xero_export_status" character varying(50) DEFAULT 'pending'::character varying,
    "student_id" "uuid"
);


ALTER TABLE "public"."invoices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "invoice_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "method" "public"."payment_method" NOT NULL,
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status",
    "stripe_payment_intent_id" character varying(255),
    "transaction_id" character varying(255),
    "processed_at" timestamp with time zone,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "xero_payment_id" character varying(255),
    "xero_exported_at" timestamp with time zone,
    "xero_export_status" character varying(50) DEFAULT 'pending'::character varying,
    "approval_status" character varying(20) DEFAULT 'approved'::character varying,
    "approved_by" "uuid",
    "approved_at" timestamp with time zone,
    "rejection_reason" "text",
    "notes" "text"
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


COMMENT ON TABLE "public"."payments" IS 'Payment records for invoices';



COMMENT ON COLUMN "public"."payments"."invoice_id" IS 'Reference to the invoice being paid';



COMMENT ON COLUMN "public"."payments"."amount" IS 'Payment amount in the invoice currency';



COMMENT ON COLUMN "public"."payments"."method" IS 'Payment method used';



COMMENT ON COLUMN "public"."payments"."status" IS 'Payment status: pending, completed, failed, refunded';



COMMENT ON COLUMN "public"."payments"."transaction_id" IS 'External transaction ID for tracking';



COMMENT ON COLUMN "public"."payments"."approval_status" IS 'Status of payment approval: pending, approved, rejected';



COMMENT ON COLUMN "public"."payments"."approved_by" IS 'User who approved/rejected the payment';



COMMENT ON COLUMN "public"."payments"."approved_at" IS 'Timestamp when payment was approved/rejected';



COMMENT ON COLUMN "public"."payments"."rejection_reason" IS 'Reason for payment rejection if applicable';



COMMENT ON COLUMN "public"."payments"."notes" IS 'Additional notes about the payment';



CREATE OR REPLACE VIEW "public"."invoice_payment_summary" WITH ("security_invoker"='true') AS
 SELECT "i"."id" AS "invoice_id",
    "i"."invoice_number",
    "i"."total_amount",
    COALESCE("sum"("p"."amount"), (0)::numeric) AS "total_paid",
    GREATEST((0)::numeric, ("i"."total_amount" - COALESCE("sum"("p"."amount"), (0)::numeric))) AS "remaining_amount",
    "count"("p"."id") AS "payment_count",
        CASE
            WHEN (COALESCE("sum"("p"."amount"), (0)::numeric) >= "i"."total_amount") THEN 'completed'::"text"
            WHEN (COALESCE("sum"("p"."amount"), (0)::numeric) > (0)::numeric) THEN 'partial'::"text"
            ELSE 'pending'::"text"
        END AS "calculated_status"
   FROM ("public"."invoices" "i"
     LEFT JOIN "public"."payments" "p" ON ((("i"."id" = "p"."invoice_id") AND ("p"."status" = 'completed'::"public"."payment_status"))))
  GROUP BY "i"."id", "i"."invoice_number", "i"."total_amount";


ALTER VIEW "public"."invoice_payment_summary" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_follow_ups" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "lead_id" "uuid",
    "type" character varying(50) NOT NULL,
    "notes" "text",
    "scheduled_date" timestamp with time zone,
    "completed_date" timestamp with time zone,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lead_follow_ups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_option_fields" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "field_name" character varying(100) NOT NULL,
    "field_type" character varying(50) NOT NULL,
    "field_label" character varying(200) NOT NULL,
    "is_required" boolean DEFAULT false,
    "options" "text"[],
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lead_option_fields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lead_sources" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lead_sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255),
    "phone" character varying(20),
    "source_id" "uuid",
    "status" "public"."lead_status" DEFAULT 'new'::"public"."lead_status",
    "budget" numeric(10,2),
    "move_in_date" "date",
    "duration_months" integer,
    "notes" "text",
    "assigned_to" "uuid",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."maintenance_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "priority" integer DEFAULT 1,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."maintenance_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."maintenance_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "studio_id" "uuid",
    "category_id" "uuid",
    "title" character varying(200) NOT NULL,
    "description" "text",
    "priority" integer DEFAULT 1,
    "status" character varying(50) DEFAULT 'open'::character varying,
    "reported_by" "uuid",
    "assigned_to" "uuid",
    "estimated_cost" numeric(10,2),
    "actual_cost" numeric(10,2),
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."maintenance_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."module_access_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_name" character varying(50) NOT NULL,
    "module_name" character varying(50) NOT NULL,
    "is_enabled" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."module_access_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."module_styles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "module_name" character varying(50) NOT NULL,
    "gradient_start" character varying(7) NOT NULL,
    "gradient_end" character varying(7) NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "section_name" character varying,
    "settings" "jsonb",
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."module_styles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "title" character varying(200) NOT NULL,
    "message" "text" NOT NULL,
    "type" character varying(50) NOT NULL,
    "is_read" boolean DEFAULT false,
    "related_entity_type" character varying(50),
    "related_entity_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pricing_matrix" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "duration_id" "uuid",
    "room_grade_id" "uuid",
    "weekly_rate_override" numeric(10,2),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."pricing_matrix" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."refund_reasons" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."refund_reasons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."refunds" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "reservation_id" "uuid",
    "invoice_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "reason" character varying(255) NOT NULL,
    "refund_type" character varying(50) DEFAULT 'full'::character varying NOT NULL,
    "processed_at" timestamp with time zone,
    "xero_refund_id" character varying(255),
    "xero_exported_at" timestamp with time zone,
    "xero_export_status" character varying(50) DEFAULT 'pending'::character varying,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."refunds" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reservation_installments" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "reservation_id" "uuid",
    "installment_plan_id" "uuid",
    "installment_number" integer NOT NULL,
    "due_date" "date" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "status" "public"."payment_status" DEFAULT 'pending'::"public"."payment_status",
    "paid_date" timestamp with time zone,
    "late_fee_amount" numeric(10,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."reservation_installments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reservations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "reservation_number" character varying(50) NOT NULL,
    "type" "public"."booking_type" NOT NULL,
    "student_id" "uuid",
    "tourist_id" "uuid",
    "studio_id" "uuid",
    "duration_id" "uuid",
    "check_in_date" "date" NOT NULL,
    "check_out_date" "date" NOT NULL,
    "status" "public"."booking_status" DEFAULT 'pending'::"public"."booking_status",
    "total_amount" numeric(10,2) NOT NULL,
    "deposit_amount" numeric(10,2) DEFAULT 0,
    "discount_amount" numeric(10,2) DEFAULT 0,
    "balance_due" numeric(10,2) NOT NULL,
    "notes" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "booking_source_id" "uuid",
    "guest_status_id" "uuid",
    "price_per_night" numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."reservations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role_name" character varying(50) NOT NULL,
    "module_name" character varying(50) NOT NULL,
    "page_path" character varying(100),
    "can_access" boolean DEFAULT false,
    "can_create" boolean DEFAULT false,
    "can_read" boolean DEFAULT false,
    "can_update" boolean DEFAULT false,
    "can_delete" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."role_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."room_grades" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "weekly_rate" numeric(10,2) NOT NULL,
    "studio_count" integer DEFAULT 0 NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "photos" "jsonb" DEFAULT '[]'::"jsonb",
    "amenities" "jsonb" DEFAULT '[]'::"jsonb",
    "features" "jsonb" DEFAULT '[]'::"jsonb"
);


ALTER TABLE "public"."room_grades" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."staff_agreements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "document_url" "text" NOT NULL,
    "agreement_type" "text" DEFAULT 'general'::"text",
    "is_active" boolean DEFAULT true,
    "due_date" timestamp with time zone,
    "uploaded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."staff_agreements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_agreements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "document_url" "text",
    "signed_document_url" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "uploaded_date" timestamp with time zone DEFAULT "now"(),
    "due_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "student_agreements_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'signed'::"text", 'overdue'::"text"])))
);


ALTER TABLE "public"."student_agreements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_documents" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "student_id" "uuid",
    "document_type" character varying(50) NOT NULL,
    "file_url" "text" NOT NULL,
    "file_name" character varying(255),
    "file_size" integer,
    "mime_type" character varying(100),
    "uploaded_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."student_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_installments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "installment_plan_id" "uuid" NOT NULL,
    "installment_number" integer NOT NULL,
    "due_date" "date" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "paid_date" "date",
    "late_fee_amount" numeric(10,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "amount_paid" numeric(10,2) DEFAULT 0,
    "remaining_amount" numeric(10,2),
    "partial_payment_date" timestamp with time zone,
    CONSTRAINT "student_installments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'completed'::"text", 'failed'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."student_installments" OWNER TO "postgres";


COMMENT ON COLUMN "public"."student_installments"."amount_paid" IS 'Amount already paid for this installment';



COMMENT ON COLUMN "public"."student_installments"."remaining_amount" IS 'Remaining amount to be paid for this installment';



COMMENT ON COLUMN "public"."student_installments"."partial_payment_date" IS 'Date when partial payment was made';



CREATE TABLE IF NOT EXISTS "public"."student_option_fields" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "field_name" character varying(100) NOT NULL,
    "field_type" character varying(50) NOT NULL,
    "field_label" character varying(200) NOT NULL,
    "is_required" boolean DEFAULT false,
    "options" "text"[],
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."student_option_fields" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."students" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "birthday" "date",
    "ethnicity" character varying(50),
    "gender" character varying(20),
    "ucas_id" character varying(50),
    "country" character varying(100),
    "address_line1" character varying(255),
    "post_code" character varying(20),
    "town" character varying(100),
    "academic_year" character varying(20),
    "year_of_study" character varying(20),
    "field_of_study" character varying(200),
    "guarantor_name" character varying(100),
    "guarantor_email" character varying(255),
    "guarantor_phone" character varying(20),
    "guarantor_relationship" character varying(50),
    "wants_installments" boolean DEFAULT false,
    "installment_plan_id" "uuid",
    "deposit_paid" boolean DEFAULT false,
    "passport_file_url" "text",
    "visa_file_url" "text",
    "utility_bill_file_url" "text",
    "guarantor_id_file_url" "text",
    "bank_statement_file_url" "text",
    "proof_of_income_file_url" "text",
    "student_id" character varying(50),
    "university" character varying(200),
    "course" character varying(200),
    "emergency_contact_name" character varying(100),
    "emergency_contact_phone" character varying(20),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "studio_id" "uuid",
    "first_name" character varying(100),
    "last_name" character varying(100),
    "email" character varying(255),
    "phone" character varying(20),
    "total_amount" numeric(10,2) DEFAULT 0,
    "check_in_date" "date",
    "duration_name" "text",
    "duration_type" "text"
);


ALTER TABLE "public"."students" OWNER TO "postgres";


COMMENT ON COLUMN "public"."students"."total_amount" IS 'Calculated total revenue for student booking (Weekly Rate × Number of Weeks)';



COMMENT ON COLUMN "public"."students"."check_in_date" IS 'Student check-in date from duration selection';



COMMENT ON COLUMN "public"."students"."duration_name" IS 'Duration name (e.g., "45 weeks", "51 weeks")';



COMMENT ON COLUMN "public"."students"."duration_type" IS 'Duration type (e.g., "student")';



CREATE TABLE IF NOT EXISTS "public"."studios" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "studio_number" character varying(20) NOT NULL,
    "room_grade_id" "uuid",
    "floor" integer,
    "status" "public"."studio_status" DEFAULT 'vacant'::"public"."studio_status",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."studios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "email" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "source" "text" DEFAULT 'public'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."subscribers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."system_preferences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "key" character varying(255) NOT NULL,
    "value" "text",
    "description" "text",
    "category" character varying(100) DEFAULT 'general'::character varying,
    "data_type" character varying(50) DEFAULT 'string'::character varying,
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."system_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tourist_booking_sources" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tourist_booking_sources" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tourist_guest_statuses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "color" character varying(20) DEFAULT 'gray'::character varying,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tourist_guest_statuses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tourist_profiles" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(20) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tourist_profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "session_token" "text" NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "ip_address" "inet",
    "user_agent" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."user_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "role" "public"."user_role" DEFAULT 'student'::"public"."user_role" NOT NULL,
    "phone" character varying(20),
    "avatar_url" "text",
    "is_active" boolean DEFAULT true,
    "last_login" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."audit_log"
    ADD CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."branding"
    ADD CONSTRAINT "branding_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cleaners"
    ADD CONSTRAINT "cleaners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cleaning_tasks"
    ADD CONSTRAINT "cleaning_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."durations"
    ADD CONSTRAINT "durations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."file_shares"
    ADD CONSTRAINT "file_shares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."file_shares"
    ADD CONSTRAINT "file_shares_share_token_key" UNIQUE ("share_token");



ALTER TABLE ONLY "public"."file_storage"
    ADD CONSTRAINT "file_storage_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."installment_plans"
    ADD CONSTRAINT "installment_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_invoice_number_key" UNIQUE ("invoice_number");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_follow_ups"
    ADD CONSTRAINT "lead_follow_ups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_option_fields"
    ADD CONSTRAINT "lead_option_fields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lead_sources"
    ADD CONSTRAINT "lead_sources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."maintenance_categories"
    ADD CONSTRAINT "maintenance_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."module_access_config"
    ADD CONSTRAINT "module_access_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."module_access_config"
    ADD CONSTRAINT "module_access_config_role_name_module_name_key" UNIQUE ("role_name", "module_name");



ALTER TABLE ONLY "public"."module_styles"
    ADD CONSTRAINT "module_styles_module_section_unique" UNIQUE ("module_name", "section_name");



ALTER TABLE ONLY "public"."module_styles"
    ADD CONSTRAINT "module_styles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pricing_matrix"
    ADD CONSTRAINT "pricing_matrix_duration_id_room_grade_id_key" UNIQUE ("duration_id", "room_grade_id");



ALTER TABLE ONLY "public"."pricing_matrix"
    ADD CONSTRAINT "pricing_matrix_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."refund_reasons"
    ADD CONSTRAINT "refund_reasons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reservation_installments"
    ADD CONSTRAINT "reservation_installments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_reservation_number_key" UNIQUE ("reservation_number");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."role_permissions"
    ADD CONSTRAINT "role_permissions_role_name_module_name_page_path_key" UNIQUE ("role_name", "module_name", "page_path");



ALTER TABLE ONLY "public"."room_grades"
    ADD CONSTRAINT "room_grades_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."staff_agreements"
    ADD CONSTRAINT "staff_agreements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_agreements"
    ADD CONSTRAINT "student_agreements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_documents"
    ADD CONSTRAINT "student_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_installments"
    ADD CONSTRAINT "student_installments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_installments"
    ADD CONSTRAINT "student_installments_student_id_installment_plan_id_install_key" UNIQUE ("student_id", "installment_plan_id", "installment_number");



ALTER TABLE ONLY "public"."student_option_fields"
    ADD CONSTRAINT "student_option_fields_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_student_id_key" UNIQUE ("student_id");



ALTER TABLE ONLY "public"."studios"
    ADD CONSTRAINT "studios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."studios"
    ADD CONSTRAINT "studios_studio_number_key" UNIQUE ("studio_number");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."system_preferences"
    ADD CONSTRAINT "system_preferences_key_key" UNIQUE ("key");



ALTER TABLE ONLY "public"."system_preferences"
    ADD CONSTRAINT "system_preferences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tourist_booking_sources"
    ADD CONSTRAINT "tourist_booking_sources_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tourist_booking_sources"
    ADD CONSTRAINT "tourist_booking_sources_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tourist_guest_statuses"
    ADD CONSTRAINT "tourist_guest_statuses_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tourist_guest_statuses"
    ADD CONSTRAINT "tourist_guest_statuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tourist_profiles"
    ADD CONSTRAINT "tourist_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_session_token_key" UNIQUE ("session_token");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_audit_logs_action" ON "public"."audit_logs" USING "btree" ("action");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at");



CREATE INDEX "idx_audit_logs_user_id" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_cleaning_tasks_scheduled_date" ON "public"."cleaning_tasks" USING "btree" ("scheduled_date");



CREATE INDEX "idx_cleaning_tasks_status" ON "public"."cleaning_tasks" USING "btree" ("status");



CREATE INDEX "idx_cleaning_tasks_studio_id" ON "public"."cleaning_tasks" USING "btree" ("studio_id");



CREATE INDEX "idx_expenses_category" ON "public"."expenses" USING "btree" ("category");



CREATE INDEX "idx_expenses_expense_date" ON "public"."expenses" USING "btree" ("expense_date");



CREATE INDEX "idx_expenses_maintenance_request_id" ON "public"."expenses" USING "btree" ("maintenance_request_id");



CREATE INDEX "idx_file_shares_expires_at" ON "public"."file_shares" USING "btree" ("expires_at");



CREATE INDEX "idx_file_shares_token" ON "public"."file_shares" USING "btree" ("share_token");



CREATE INDEX "idx_file_storage_category" ON "public"."file_storage" USING "btree" ("category");



CREATE INDEX "idx_file_storage_created_at" ON "public"."file_storage" USING "btree" ("created_at");



CREATE INDEX "idx_file_storage_deleted" ON "public"."file_storage" USING "btree" ("is_deleted");



CREATE INDEX "idx_file_storage_related_entity" ON "public"."file_storage" USING "btree" ("related_entity_type", "related_entity_id");



CREATE INDEX "idx_file_storage_tags" ON "public"."file_storage" USING "gin" ("tags");



CREATE INDEX "idx_file_storage_uploaded_by" ON "public"."file_storage" USING "btree" ("uploaded_by");



CREATE INDEX "idx_installment_plans_due_dates" ON "public"."installment_plans" USING "gin" ("due_dates");



CREATE INDEX "idx_invoices_status" ON "public"."invoices" USING "btree" ("status");



CREATE INDEX "idx_invoices_xero_export_status" ON "public"."invoices" USING "btree" ("xero_export_status");



CREATE INDEX "idx_leads_assigned_to" ON "public"."leads" USING "btree" ("assigned_to");



CREATE INDEX "idx_leads_source_id" ON "public"."leads" USING "btree" ("source_id");



CREATE INDEX "idx_leads_status" ON "public"."leads" USING "btree" ("status");



CREATE INDEX "idx_maintenance_requests_status" ON "public"."maintenance_requests" USING "btree" ("status");



CREATE INDEX "idx_maintenance_requests_studio_id" ON "public"."maintenance_requests" USING "btree" ("studio_id");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_payments_approval_status" ON "public"."payments" USING "btree" ("approval_status");



CREATE INDEX "idx_payments_created_at" ON "public"."payments" USING "btree" ("created_at");



CREATE INDEX "idx_payments_invoice_id" ON "public"."payments" USING "btree" ("invoice_id");



CREATE INDEX "idx_payments_status" ON "public"."payments" USING "btree" ("status");



CREATE INDEX "idx_payments_xero_export_status" ON "public"."payments" USING "btree" ("xero_export_status");



CREATE INDEX "idx_refunds_created_at" ON "public"."refunds" USING "btree" ("created_at");



CREATE INDEX "idx_refunds_invoice_id" ON "public"."refunds" USING "btree" ("invoice_id");



CREATE INDEX "idx_refunds_reservation_id" ON "public"."refunds" USING "btree" ("reservation_id");



CREATE INDEX "idx_reservations_booking_source_id" ON "public"."reservations" USING "btree" ("booking_source_id");



CREATE INDEX "idx_reservations_check_in_date" ON "public"."reservations" USING "btree" ("check_in_date");



CREATE INDEX "idx_reservations_check_out_date" ON "public"."reservations" USING "btree" ("check_out_date");



CREATE INDEX "idx_reservations_duration_id" ON "public"."reservations" USING "btree" ("duration_id");



CREATE INDEX "idx_reservations_guest_status_id" ON "public"."reservations" USING "btree" ("guest_status_id");



CREATE INDEX "idx_reservations_status" ON "public"."reservations" USING "btree" ("status");



CREATE INDEX "idx_reservations_studio_id" ON "public"."reservations" USING "btree" ("studio_id");



CREATE INDEX "idx_role_permissions_module" ON "public"."role_permissions" USING "btree" ("module_name");



CREATE INDEX "idx_role_permissions_role" ON "public"."role_permissions" USING "btree" ("role_name");



CREATE INDEX "idx_student_agreements_status" ON "public"."student_agreements" USING "btree" ("status");



CREATE INDEX "idx_student_agreements_student_id" ON "public"."student_agreements" USING "btree" ("student_id");



CREATE INDEX "idx_student_documents_student_id" ON "public"."student_documents" USING "btree" ("student_id");



CREATE INDEX "idx_student_documents_type" ON "public"."student_documents" USING "btree" ("document_type");



CREATE INDEX "idx_student_installments_due_date" ON "public"."student_installments" USING "btree" ("due_date");



CREATE INDEX "idx_student_installments_installment_plan_id" ON "public"."student_installments" USING "btree" ("installment_plan_id");



CREATE INDEX "idx_student_installments_status" ON "public"."student_installments" USING "btree" ("status");



CREATE INDEX "idx_student_installments_student_id" ON "public"."student_installments" USING "btree" ("student_id");



CREATE INDEX "idx_students_guarantor_email" ON "public"."students" USING "btree" ("guarantor_email");



CREATE INDEX "idx_students_studio_id" ON "public"."students" USING "btree" ("studio_id");



CREATE INDEX "idx_students_ucas_id" ON "public"."students" USING "btree" ("ucas_id");



CREATE INDEX "idx_students_user_id" ON "public"."students" USING "btree" ("user_id");



CREATE INDEX "idx_studios_room_grade_id" ON "public"."studios" USING "btree" ("room_grade_id");



CREATE INDEX "idx_studios_status" ON "public"."studios" USING "btree" ("status");



CREATE INDEX "idx_tourist_profiles_email" ON "public"."tourist_profiles" USING "btree" ("email");



CREATE INDEX "idx_tourist_profiles_name" ON "public"."tourist_profiles" USING "btree" ("first_name", "last_name");



CREATE INDEX "idx_user_sessions_expires" ON "public"."user_sessions" USING "btree" ("expires_at");



CREATE INDEX "idx_user_sessions_token" ON "public"."user_sessions" USING "btree" ("session_token");



CREATE INDEX "idx_user_sessions_user_id" ON "public"."user_sessions" USING "btree" ("user_id");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_role" ON "public"."users" USING "btree" ("role");



CREATE OR REPLACE TRIGGER "update_branding_updated_at" BEFORE UPDATE ON "public"."branding" FOR EACH ROW EXECUTE FUNCTION "public"."update_branding_updated_at"();



CREATE OR REPLACE TRIGGER "update_expenses_updated_at" BEFORE UPDATE ON "public"."expenses" FOR EACH ROW EXECUTE FUNCTION "public"."update_expenses_updated_at"();



CREATE OR REPLACE TRIGGER "update_file_storage_updated_at" BEFORE UPDATE ON "public"."file_storage" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_invoices_updated_at" BEFORE UPDATE ON "public"."invoices" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_leads_updated_at" BEFORE UPDATE ON "public"."leads" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_maintenance_requests_updated_at" BEFORE UPDATE ON "public"."maintenance_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_module_access_config_updated_at" BEFORE UPDATE ON "public"."module_access_config" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_module_styles_updated_at" BEFORE UPDATE ON "public"."module_styles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_refunds_updated_at" BEFORE UPDATE ON "public"."refunds" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_reservations_updated_at" BEFORE UPDATE ON "public"."reservations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_role_permissions_updated_at" BEFORE UPDATE ON "public"."role_permissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_student_agreements_updated_at" BEFORE UPDATE ON "public"."student_agreements" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_student_installments_updated_at" BEFORE UPDATE ON "public"."student_installments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_students_updated_at" BEFORE UPDATE ON "public"."students" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tourist_booking_sources_updated_at" BEFORE UPDATE ON "public"."tourist_booking_sources" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tourist_guest_statuses_updated_at" BEFORE UPDATE ON "public"."tourist_guest_statuses" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_tourist_profiles_updated_at" BEFORE UPDATE ON "public"."tourist_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_sessions_updated_at" BEFORE UPDATE ON "public"."user_sessions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."audit_log"
    ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cleaners"
    ADD CONSTRAINT "cleaners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."cleaning_tasks"
    ADD CONSTRAINT "cleaning_tasks_cleaner_id_fkey" FOREIGN KEY ("cleaner_id") REFERENCES "public"."cleaners"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cleaning_tasks"
    ADD CONSTRAINT "cleaning_tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cleaning_tasks"
    ADD CONSTRAINT "cleaning_tasks_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "public"."studios"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cleaning_tasks"
    ADD CONSTRAINT "cleaning_tasks_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."file_shares"
    ADD CONSTRAINT "file_shares_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."file_shares"
    ADD CONSTRAINT "file_shares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."file_storage"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."file_storage"
    ADD CONSTRAINT "file_storage_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "fk_expenses_created_by" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "fk_expenses_maintenance_request_id" FOREIGN KEY ("maintenance_request_id") REFERENCES "public"."maintenance_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_reservation_installment_id_fkey" FOREIGN KEY ("reservation_installment_id") REFERENCES "public"."reservation_installments"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id");



ALTER TABLE ONLY "public"."lead_follow_ups"
    ADD CONSTRAINT "lead_follow_ups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."lead_follow_ups"
    ADD CONSTRAINT "lead_follow_ups_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."lead_sources"("id");



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."maintenance_categories"("id");



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_reported_by_fkey" FOREIGN KEY ("reported_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id");



ALTER TABLE ONLY "public"."pricing_matrix"
    ADD CONSTRAINT "pricing_matrix_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "public"."durations"("id");



ALTER TABLE ONLY "public"."pricing_matrix"
    ADD CONSTRAINT "pricing_matrix_room_grade_id_fkey" FOREIGN KEY ("room_grade_id") REFERENCES "public"."room_grades"("id");



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id");



ALTER TABLE ONLY "public"."refunds"
    ADD CONSTRAINT "refunds_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservation_installments"
    ADD CONSTRAINT "reservation_installments_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "public"."installment_plans"("id");



ALTER TABLE ONLY "public"."reservation_installments"
    ADD CONSTRAINT "reservation_installments_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_booking_source_id_fkey" FOREIGN KEY ("booking_source_id") REFERENCES "public"."tourist_booking_sources"("id");



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_duration_id_fkey" FOREIGN KEY ("duration_id") REFERENCES "public"."durations"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_guest_status_id_fkey" FOREIGN KEY ("guest_status_id") REFERENCES "public"."tourist_guest_statuses"("id");



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."reservations"
    ADD CONSTRAINT "reservations_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "public"."studios"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."staff_agreements"
    ADD CONSTRAINT "staff_agreements_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."student_documents"
    ADD CONSTRAINT "student_documents_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_installments"
    ADD CONSTRAINT "student_installments_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "public"."installment_plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_installments"
    ADD CONSTRAINT "student_installments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_installment_plan_id_fkey" FOREIGN KEY ("installment_plan_id") REFERENCES "public"."installment_plans"("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_studio_id_fkey" FOREIGN KEY ("studio_id") REFERENCES "public"."studios"("id");



ALTER TABLE ONLY "public"."students"
    ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."studios"
    ADD CONSTRAINT "studios_room_grade_id_fkey" FOREIGN KEY ("room_grade_id") REFERENCES "public"."room_grades"("id");



ALTER TABLE ONLY "public"."user_sessions"
    ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Users can create invoices" ON "public"."invoices" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND (("auth"."uid"() = "created_by") OR ("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"])))))));



CREATE POLICY "Users can create payments" ON "public"."payments" FOR INSERT WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can create student installments" ON "public"."student_installments" FOR INSERT WITH CHECK ((("auth"."uid"() IS NOT NULL) AND ("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"]))))));



CREATE POLICY "Users can delete expenses" ON "public"."expenses" FOR DELETE USING (true);



CREATE POLICY "Users can delete invoices they created" ON "public"."invoices" FOR DELETE USING ((("auth"."uid"() = "created_by") OR ("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"]))))));



CREATE POLICY "Users can delete student installments" ON "public"."student_installments" FOR DELETE USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"])))));



CREATE POLICY "Users can insert expenses" ON "public"."expenses" FOR INSERT WITH CHECK (true);



CREATE POLICY "Users can update expenses" ON "public"."expenses" FOR UPDATE USING (true);



CREATE POLICY "Users can update invoices they created" ON "public"."invoices" FOR UPDATE USING ((("auth"."uid"() = "created_by") OR ("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"])))))) WITH CHECK ((("auth"."uid"() = "created_by") OR ("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"]))))));



CREATE POLICY "Users can update student installments" ON "public"."student_installments" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"]))))) WITH CHECK (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"])))));



CREATE POLICY "Users can update their own payments" ON "public"."payments" FOR UPDATE USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can view expenses" ON "public"."expenses" FOR SELECT USING (true);



CREATE POLICY "Users can view invoices they created" ON "public"."invoices" FOR SELECT USING ((("auth"."uid"() = "created_by") OR ("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"]))))));



CREATE POLICY "Users can view student installments" ON "public"."student_installments" FOR SELECT USING (("auth"."uid"() IN ( SELECT "users"."id"
   FROM "public"."users"
  WHERE ("users"."role" = ANY (ARRAY['super_admin'::"public"."user_role", 'admin'::"public"."user_role", 'accountant'::"public"."user_role"])))));



CREATE POLICY "Users can view their own payments" ON "public"."payments" FOR SELECT USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users with finance access can update payment approvals" ON "public"."payments" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"public"."user_role", 'accountant'::"public"."user_role", 'super_admin'::"public"."user_role"]))))));



CREATE POLICY "Users with finance access can view all payments" ON "public"."payments" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users"
  WHERE (("users"."id" = "auth"."uid"()) AND ("users"."role" = ANY (ARRAY['admin'::"public"."user_role", 'accountant'::"public"."user_role", 'super_admin'::"public"."user_role"]))))));



ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoices" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "invoices_select_all" ON "public"."invoices" FOR SELECT USING (true);



ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_installments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "student_installments_select_all" ON "public"."student_installments" FOR SELECT USING (true);





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."audit_log";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."lead_sources";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."create_file_share"("p_file_id" "uuid", "p_expires_at" timestamp with time zone, "p_max_downloads" integer, "p_created_by" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."create_file_share"("p_file_id" "uuid", "p_expires_at" timestamp with time zone, "p_max_downloads" integer, "p_created_by" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_file_share"("p_file_id" "uuid", "p_expires_at" timestamp with time zone, "p_max_downloads" integer, "p_created_by" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_share_token"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_share_token"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_share_token"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_branding_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_branding_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_branding_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_expenses_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_expenses_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_expenses_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_file_share"("p_share_token" character varying) TO "anon";
GRANT ALL ON FUNCTION "public"."validate_file_share"("p_share_token" character varying) TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_file_share"("p_share_token" character varying) TO "service_role";


















GRANT ALL ON TABLE "public"."audit_log" TO "anon";
GRANT ALL ON TABLE "public"."audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."branding" TO "anon";
GRANT ALL ON TABLE "public"."branding" TO "authenticated";
GRANT ALL ON TABLE "public"."branding" TO "service_role";



GRANT ALL ON TABLE "public"."cleaners" TO "anon";
GRANT ALL ON TABLE "public"."cleaners" TO "authenticated";
GRANT ALL ON TABLE "public"."cleaners" TO "service_role";



GRANT ALL ON TABLE "public"."cleaning_tasks" TO "anon";
GRANT ALL ON TABLE "public"."cleaning_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."cleaning_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."durations" TO "anon";
GRANT ALL ON TABLE "public"."durations" TO "authenticated";
GRANT ALL ON TABLE "public"."durations" TO "service_role";



GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";



GRANT ALL ON TABLE "public"."file_shares" TO "anon";
GRANT ALL ON TABLE "public"."file_shares" TO "authenticated";
GRANT ALL ON TABLE "public"."file_shares" TO "service_role";



GRANT ALL ON TABLE "public"."file_storage" TO "anon";
GRANT ALL ON TABLE "public"."file_storage" TO "authenticated";
GRANT ALL ON TABLE "public"."file_storage" TO "service_role";



GRANT ALL ON TABLE "public"."installment_plans" TO "anon";
GRANT ALL ON TABLE "public"."installment_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."installment_plans" TO "service_role";



GRANT ALL ON TABLE "public"."invoices" TO "anon";
GRANT ALL ON TABLE "public"."invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."invoices" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."invoice_payment_summary" TO "anon";
GRANT ALL ON TABLE "public"."invoice_payment_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."invoice_payment_summary" TO "service_role";



GRANT ALL ON TABLE "public"."lead_follow_ups" TO "anon";
GRANT ALL ON TABLE "public"."lead_follow_ups" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_follow_ups" TO "service_role";



GRANT ALL ON TABLE "public"."lead_option_fields" TO "anon";
GRANT ALL ON TABLE "public"."lead_option_fields" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_option_fields" TO "service_role";



GRANT ALL ON TABLE "public"."lead_sources" TO "anon";
GRANT ALL ON TABLE "public"."lead_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."lead_sources" TO "service_role";



GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";



GRANT ALL ON TABLE "public"."maintenance_categories" TO "anon";
GRANT ALL ON TABLE "public"."maintenance_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."maintenance_categories" TO "service_role";



GRANT ALL ON TABLE "public"."maintenance_requests" TO "anon";
GRANT ALL ON TABLE "public"."maintenance_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."maintenance_requests" TO "service_role";



GRANT ALL ON TABLE "public"."module_access_config" TO "anon";
GRANT ALL ON TABLE "public"."module_access_config" TO "authenticated";
GRANT ALL ON TABLE "public"."module_access_config" TO "service_role";



GRANT ALL ON TABLE "public"."module_styles" TO "anon";
GRANT ALL ON TABLE "public"."module_styles" TO "authenticated";
GRANT ALL ON TABLE "public"."module_styles" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."pricing_matrix" TO "anon";
GRANT ALL ON TABLE "public"."pricing_matrix" TO "authenticated";
GRANT ALL ON TABLE "public"."pricing_matrix" TO "service_role";



GRANT ALL ON TABLE "public"."refund_reasons" TO "anon";
GRANT ALL ON TABLE "public"."refund_reasons" TO "authenticated";
GRANT ALL ON TABLE "public"."refund_reasons" TO "service_role";



GRANT ALL ON TABLE "public"."refunds" TO "anon";
GRANT ALL ON TABLE "public"."refunds" TO "authenticated";
GRANT ALL ON TABLE "public"."refunds" TO "service_role";



GRANT ALL ON TABLE "public"."reservation_installments" TO "anon";
GRANT ALL ON TABLE "public"."reservation_installments" TO "authenticated";
GRANT ALL ON TABLE "public"."reservation_installments" TO "service_role";



GRANT ALL ON TABLE "public"."reservations" TO "anon";
GRANT ALL ON TABLE "public"."reservations" TO "authenticated";
GRANT ALL ON TABLE "public"."reservations" TO "service_role";



GRANT ALL ON TABLE "public"."role_permissions" TO "anon";
GRANT ALL ON TABLE "public"."role_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."room_grades" TO "anon";
GRANT ALL ON TABLE "public"."room_grades" TO "authenticated";
GRANT ALL ON TABLE "public"."room_grades" TO "service_role";



GRANT ALL ON TABLE "public"."staff_agreements" TO "anon";
GRANT ALL ON TABLE "public"."staff_agreements" TO "authenticated";
GRANT ALL ON TABLE "public"."staff_agreements" TO "service_role";



GRANT ALL ON TABLE "public"."student_agreements" TO "anon";
GRANT ALL ON TABLE "public"."student_agreements" TO "authenticated";
GRANT ALL ON TABLE "public"."student_agreements" TO "service_role";



GRANT ALL ON TABLE "public"."student_documents" TO "anon";
GRANT ALL ON TABLE "public"."student_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."student_documents" TO "service_role";



GRANT ALL ON TABLE "public"."student_installments" TO "anon";
GRANT ALL ON TABLE "public"."student_installments" TO "authenticated";
GRANT ALL ON TABLE "public"."student_installments" TO "service_role";



GRANT ALL ON TABLE "public"."student_option_fields" TO "anon";
GRANT ALL ON TABLE "public"."student_option_fields" TO "authenticated";
GRANT ALL ON TABLE "public"."student_option_fields" TO "service_role";



GRANT ALL ON TABLE "public"."students" TO "anon";
GRANT ALL ON TABLE "public"."students" TO "authenticated";
GRANT ALL ON TABLE "public"."students" TO "service_role";



GRANT ALL ON TABLE "public"."studios" TO "anon";
GRANT ALL ON TABLE "public"."studios" TO "authenticated";
GRANT ALL ON TABLE "public"."studios" TO "service_role";



GRANT ALL ON TABLE "public"."subscribers" TO "anon";
GRANT ALL ON TABLE "public"."subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscribers" TO "service_role";



GRANT ALL ON TABLE "public"."system_preferences" TO "anon";
GRANT ALL ON TABLE "public"."system_preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."system_preferences" TO "service_role";



GRANT ALL ON TABLE "public"."tourist_booking_sources" TO "anon";
GRANT ALL ON TABLE "public"."tourist_booking_sources" TO "authenticated";
GRANT ALL ON TABLE "public"."tourist_booking_sources" TO "service_role";



GRANT ALL ON TABLE "public"."tourist_guest_statuses" TO "anon";
GRANT ALL ON TABLE "public"."tourist_guest_statuses" TO "authenticated";
GRANT ALL ON TABLE "public"."tourist_guest_statuses" TO "service_role";



GRANT ALL ON TABLE "public"."tourist_profiles" TO "anon";
GRANT ALL ON TABLE "public"."tourist_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."tourist_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."user_sessions" TO "anon";
GRANT ALL ON TABLE "public"."user_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
