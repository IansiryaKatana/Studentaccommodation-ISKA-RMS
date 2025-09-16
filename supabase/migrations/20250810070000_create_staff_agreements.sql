-- Create staff_agreements table
CREATE TABLE IF NOT EXISTS staff_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  document_url TEXT NOT NULL,
  agreement_type TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  due_date TIMESTAMP WITH TIME ZONE,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some dummy agreements for testing
INSERT INTO staff_agreements (title, description, document_url, agreement_type, due_date) VALUES
  ('Accommodation Agreement', 'Standard accommodation agreement for all students', 'https://example.com/agreements/accommodation.pdf', 'accommodation', NOW() + INTERVAL '30 days'),
  ('House Rules Agreement', 'Rules and regulations for living in the accommodation', 'https://example.com/agreements/house-rules.pdf', 'house_rules', NOW() + INTERVAL '7 days'),
  ('Payment Plan Agreement', 'Agreement for installment payment plan', 'https://example.com/agreements/payment-plan.pdf', 'payment', NOW() + INTERVAL '14 days');
