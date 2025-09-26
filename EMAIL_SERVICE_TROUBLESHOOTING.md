# Email Service Troubleshooting Guide

## Current Issue: 500 Error from send-email Edge Function

The email service is returning a 500 error when trying to send bulk emails. This is likely due to one of the following issues:

### Possible Causes

1. **Edge Function Not Deployed**: The updated send-email function may not be deployed to Supabase
2. **Authentication Issues**: Supabase CLI authentication may be expired
3. **Runtime Environment**: Deno runtime issues or missing dependencies
4. **Request Format**: The request body format might not match what the function expects

### Immediate Solutions

#### Solution 1: Deploy the Edge Function
```bash
# Navigate to supabase directory
cd supabase

# Login to Supabase (if not already logged in)
supabase login

# Deploy the send-email function
supabase functions deploy send-email
```

#### Solution 2: Test the Function Locally
```bash
# Start Supabase locally
supabase start

# Test the function locally
supabase functions serve send-email --env-file .env.local
```

#### Solution 3: Manual Function Deployment via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. Create or update the `send-email` function
4. Copy the content from `supabase/functions/send-email/index.ts`
5. Deploy the function

### Enhanced Error Handling

The updated send-email function now includes:
- Detailed logging for debugging
- Better error messages
- Graceful fallback when no API key is configured
- Input validation
- Comprehensive error responses

### Fallback Email Service

If the edge function continues to fail, the application now:
- Logs detailed error information
- Provides fallback email logging in the console
- Creates delivery records with failed status
- Continues processing other emails in the batch

### Testing the Email Service

Use the provided test script:
```javascript
// Run in browser console or Node.js
const testData = {
  to: 'test@example.com',
  subject: 'Test Email',
  html: '<h1>Test</h1>',
  text: 'Test email content'
};

// Test with Supabase client
const { data, error } = await supabase.functions.invoke('send-email', {
  body: testData
});
```

### Production Email Service Setup

For production, configure a real email service:

#### Option 1: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Set environment variable: `RESEND_API_KEY=your_api_key`
4. Deploy the function

#### Option 2: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Modify the edge function to use SendGrid API
3. Set environment variable: `SENDGRID_API_KEY=your_api_key`

#### Option 3: Mailgun
1. Sign up at [mailgun.com](https://mailgun.com)
2. Modify the edge function to use Mailgun API
3. Set environment variable: `MAILGUN_API_KEY=your_api_key`

### Environment Variables

Add these to your Supabase project settings:
```
RESEND_API_KEY=your_resend_api_key_here
# OR
SENDGRID_API_KEY=your_sendgrid_api_key_here
# OR
MAILGUN_API_KEY=your_mailgun_api_key_here
```

### Debugging Steps

1. **Check Supabase Logs**:
   - Go to Supabase Dashboard > Logs
   - Look for edge function logs
   - Check for error messages

2. **Test with curl**:
```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-email \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test",
    "text": "Test email"
  }'
```

3. **Check Function Status**:
   - Verify the function is deployed
   - Check function logs for errors
   - Ensure environment variables are set

### Current Status

The email service has been enhanced with:
- ✅ Better error handling
- ✅ Detailed logging
- ✅ Input validation
- ✅ Fallback mechanisms
- ✅ Mock email support for development

The 500 error should be resolved once the updated function is deployed to Supabase.

