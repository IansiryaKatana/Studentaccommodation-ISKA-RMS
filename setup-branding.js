const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBranding() {
  try {
    console.log('Setting up default branding...');
    
    // Check if branding record exists
    const { data: existingBranding, error: fetchError } = await supabase
      .from('branding')
      .select('*')
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching branding:', fetchError);
      return;
    }
    
    if (existingBranding && existingBranding.length > 0) {
      console.log('Branding record already exists, updating with dashboard fields...');
      
      // Update existing record with dashboard fields
      const { data: updatedBranding, error: updateError } = await supabase
        .from('branding')
        .update({
          dashboard_title: 'ISKA - RMS',
          dashboard_subtitle: 'Worldclass Student accommodation CRM',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingBranding[0].id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating branding:', updateError);
      } else {
        console.log('✅ Branding updated successfully:', updatedBranding);
      }
    } else {
      console.log('No branding record found, creating default...');
      
      // Create new branding record
      const { data: newBranding, error: insertError } = await supabase
        .from('branding')
        .insert({
          company_name: 'ISKA RMS',
          company_address: '123 Business Street, London, UK, SW1A 1AA',
          company_phone: '+44 20 1234 5678',
          company_email: 'info@iska-rms.com',
          company_website: 'https://iska-rms.com',
          primary_color: '#3B82F6',
          secondary_color: '#1F2937',
          accent_color: '#10B981',
          font_family: 'Inter',
          dashboard_title: 'ISKA - RMS',
          dashboard_subtitle: 'Worldclass Student accommodation CRM'
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating branding:', insertError);
      } else {
        console.log('✅ Branding created successfully:', newBranding);
      }
    }
    
  } catch (error) {
    console.error('Error in setupBranding:', error);
  }
}

setupBranding();
