import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('📧 Send-real-email function called:', req.method, req.url)
  
  if (req.method === 'OPTIONS') {
    console.log('📧 CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📧 Processing real email request...')
    const body = await req.json()
    console.log('📧 Request body received:', JSON.stringify(body, null, 2))
    
    const { to, subject, html, text } = body

    if (!to || !subject || (!html && !text)) {
      throw new Error('Missing required fields: to, subject, and either html or text content')
    }

    console.log('📧 Sending real email to:', to)
    console.log('📧 Subject:', subject)

    // Get Resend API key
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      console.log('📧 No RESEND_API_KEY found')
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'No RESEND_API_KEY configured - using mock mode',
          error: 'RESEND_API_KEY not configured',
          emailData: { to, subject, html, text },
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Always return 200 to prevent client errors
        }
      )
    }

    // Prepare email data - use Resend's verified domain for development
    const emailData = {
      to: to,
      subject: subject,
      html: html || text,
      text: text || html,
      from: 'ISKA RMS <onboarding@resend.dev>' // Use Resend's verified domain for development
    }

    console.log('📧 Attempting to send email via Resend API...')
    
    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    console.log('📧 Resend API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('📧 Resend API error:', response.status, errorText)
      
      // Return error but still with 200 status to prevent client-side errors
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Email sending failed via Resend API',
          error: `Resend API error: ${response.status} - ${errorText}`,
          emailData: { to, subject, html, text },
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 // Always return 200 to prevent client errors
        }
      )
    }

    const result = await response.json()
    console.log('📧 Email sent successfully via Resend:', result)
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully via Resend',
        emailId: result.id,
        to: to,
        subject: subject,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('📧 Unexpected error in send-real-email function:', error)
    console.error('📧 Error stack:', error.stack)
    
    // Always return 200 status to prevent client-side FunctionsHttpError
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Email processing failed (error details included)',
        error: error.message,
        timestamp: new Date().toISOString(),
        function: 'send-real-email'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Always return 200 to prevent client errors
      }
    )
  }
})
