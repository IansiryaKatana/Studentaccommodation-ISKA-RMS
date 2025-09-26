# Email Service Setup

The email communication system is now set up to send real emails! Here's how to configure it:

## Current Status
- ✅ Email templates are working
- ✅ Campaign creation is working  
- ✅ Student selection is working
- ✅ Email sending function is deployed
- ⚠️ **Emails are currently logged to console (no API key configured)**

## To Enable Real Email Sending

### Option 1: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add it to your Supabase project:
   ```bash
   npx supabase secrets set RESEND_API_KEY=your_api_key_here
   ```

### Option 2: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get your API key
3. Modify `supabase/functions/send-email/index.ts` to use SendGrid API
4. Add the API key as a secret

### Option 3: Mailgun
1. Sign up at [mailgun.com](https://mailgun.com)
2. Get your API key and domain
3. Modify the email function to use Mailgun API
4. Add the API key as a secret

## Testing Without Email Service
Currently, emails are logged to the console. You can see them in:
1. Browser console (F12)
2. Supabase function logs

## Email Templates
The system supports dynamic variables in templates:
- `{studentName}` - Student's full name
- `{studentEmail}` - Student's email
- `{studentId}` - Student's ID
- `{campaignName}` - Campaign name

## Next Steps
1. Choose an email service provider
2. Add the API key to Supabase secrets
3. Test email sending
4. Monitor delivery status in the Email Analytics dashboard

## Troubleshooting
- Check Supabase function logs for errors
- Verify email service API key is correct
- Ensure sender email is verified with your email service
- Check spam folders for test emails
