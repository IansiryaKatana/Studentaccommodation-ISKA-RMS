import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log request for debugging
    console.log('Webhook called - Method:', req.method)
    console.log('Headers:', Object.fromEntries(req.headers.entries()))
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Parse the request body
    const formData = await req.json()
    console.log('Received WordPress form data:', formData)

    // Validate required fields
    if (!formData.first_name || !formData.last_name) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'First name and last name are required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the "Websites" source ID
    const { data: sources, error: sourceError } = await supabaseClient
      .from('lead_sources')
      .select('id')
      .eq('name', 'Websites')
      .single()

    if (sourceError || !sources) {
      console.error('Website source not found:', sourceError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Website source not found in system' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the current academic year from the database
    const { data: currentAcademicYear, error: yearError } = await supabaseClient
      .from('academic_years')
      .select('name')
      .eq('is_current', true)
      .single()

    let academicYear = '2025/2026' // Fallback default
    if (!yearError && currentAcademicYear) {
      academicYear = currentAcademicYear.name
    } else {
      console.log('Could not fetch current academic year, using fallback:', academicYear)
    }

    // Map Elementor form fields to ISKA RMS lead structure
    const leadData = {
      first_name: formData.first_name || '',
      last_name: formData.last_name || '',
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      source_id: sources.id, // Auto-assign "Websites" source
      status: 'new' as const,
      notes: formData.message || undefined,
      room_grade_preference_id: formData.room_grade || undefined,
      duration_type_preference_id: formData.duration || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      estimated_revenue: formData.budget ? parseFloat(formData.budget) : undefined,
      academic_year: academicYear // Use current academic year from database
      // Removed created_by field - let database use default or null
    }

    // Create the lead
    const { data, error } = await supabaseClient
      .from('leads')
      .insert(leadData)
      .select(`
        *,
        lead_source:lead_sources(name),
        assigned_user:users!leads_assigned_to_fkey(first_name, last_name),
        room_grade_preference:lead_room_grades(name),
        duration_type_preference:lead_duration_types(name)
      `)
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Failed to create lead', 
          error: error.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Lead created successfully:', data)
    console.log('Academic year used:', academicYear)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Lead created successfully', 
        leadId: data.id,
        data: data
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Internal server error', 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})