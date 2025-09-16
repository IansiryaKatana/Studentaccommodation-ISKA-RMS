-- Create expenses table for maintenance cost tracking
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_request_id UUID,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL DEFAULT 'other',
    vendor_name VARCHAR(255),
    expense_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    receipt_file_url TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_maintenance_request_id ON public.expenses(maintenance_request_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view expenses" ON public.expenses
    FOR SELECT USING (true);

CREATE POLICY "Users can insert expenses" ON public.expenses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update expenses" ON public.expenses
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete expenses" ON public.expenses
    FOR DELETE USING (true);

-- Add foreign key constraints (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_expenses_maintenance_request_id') THEN
        ALTER TABLE public.expenses 
        ADD CONSTRAINT fk_expenses_maintenance_request_id 
        FOREIGN KEY (maintenance_request_id) 
        REFERENCES public.maintenance_requests(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_expenses_created_by') THEN
        ALTER TABLE public.expenses 
        ADD CONSTRAINT fk_expenses_created_by 
        FOREIGN KEY (created_by) 
        REFERENCES public.users(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at (only if it doesn't exist)
DROP TRIGGER IF EXISTS update_expenses_updated_at ON public.expenses;
CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_expenses_updated_at();
