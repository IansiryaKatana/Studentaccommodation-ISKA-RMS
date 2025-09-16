# 🔐 Secure Configuration Setup Guide

## Overview

This guide explains how to securely store and manage sensitive configuration files (like Stripe API keys) in Supabase Storage instead of committing them to your Git repository.

## Why Secure Storage?

- **Security**: API keys are never committed to version control
- **Flexibility**: Easy to switch between test and live environments
- **Scalability**: Can store multiple configuration files
- **Access Control**: Supabase Storage provides built-in security

## Step-by-Step Setup

### 1. Access Configuration Management

1. Navigate to **Settings** → **Config Management** in your ISKA RMS application
2. You'll see the Stripe Configuration section

### 2. Upload Your Stripe Configuration

1. Click **"Upload Config"** button
2. Fill in your Stripe API keys:
   - **Test Publishable Key**: `pk_test_...`
   - **Test Secret Key**: `sk_test_...`
   - **Live Publishable Key**: `pk_live_...`
   - **Live Secret Key**: `sk_live_...`
   - **Environment**: Choose `test` or `live`
3. Click **"Upload Config"**

### 3. Verify Configuration

1. Click **"Load Config"** to load the configuration from storage
2. Click **"View Keys"** to verify your keys are stored correctly (they will be masked for security)

## How It Works

### Storage Location
- Configuration files are stored in Supabase Storage under the `system_backup` category
- Files are tagged with `['config', 'stripe', 'security']` for easy identification
- Access is restricted to authenticated users only

### Runtime Loading
- The application automatically loads configuration from storage when needed
- If storage is unavailable, it falls back to environment variables
- Configuration is cached for performance

### Environment Switching
- Change the `environment` field in your configuration to switch between test and live
- Upload the updated configuration to apply changes

## Security Features

### File Security
- Files are stored in Supabase Storage with restricted access
- No public access to configuration files
- Automatic encryption at rest

### Key Masking
- Keys are displayed in masked format (e.g., `pk_test_...abcd`)
- Full keys are never shown in the UI
- Secure transmission to and from storage

### Access Control
- Only authenticated users can access configuration
- File operations are logged for audit purposes
- Configuration changes are timestamped

## Getting Your Stripe Keys

### Test Keys (Free)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up for a free account
3. Navigate to **Developers** → **API keys**
4. Copy your test publishable and secret keys

### Live Keys (Production)
1. Complete Stripe account verification
2. Navigate to **Developers** → **API keys**
3. Switch to **Live** mode
4. Copy your live publishable and secret keys

## Testing Your Configuration

### 1. Test Environment
1. Set environment to `test` in your configuration
2. Use test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Expired**: `4000 0000 0000 0069`

### 2. Live Environment
1. Set environment to `live` in your configuration
2. Use real payment methods for testing

## Troubleshooting

### Configuration Not Loading
- Check if the file exists in storage
- Verify your Supabase connection
- Check browser console for errors

### Upload Fails
- Ensure you have proper Supabase permissions
- Check file size (should be small for config files)
- Verify network connection

### Keys Not Working
- Verify you're using the correct environment
- Check if keys are valid in Stripe Dashboard
- Ensure keys match the environment (test vs live)

## Best Practices

### Key Management
- Rotate keys regularly
- Use different keys for different environments
- Never share keys in public repositories

### Configuration Updates
- Update configuration when switching environments
- Keep backup of configuration files
- Document any configuration changes

### Security
- Regularly audit configuration access
- Monitor for unauthorized access
- Use strong authentication

## File Structure

Your configuration file will be stored as:
```
stripe-keys.json
{
  "stripe": {
    "test": {
      "publishable_key": "pk_test_...",
      "secret_key": "sk_test_..."
    },
    "live": {
      "publishable_key": "pk_live_...",
      "secret_key": "sk_live_..."
    },
    "environment": "test",
    "last_updated": "2024-01-01T00:00:00Z",
    "notes": "Stripe configuration for ISKA RMS"
  }
}
```

## Next Steps

1. **Upload your configuration** using the Config Management UI
2. **Test the payment functionality** with test cards
3. **Switch to live environment** when ready for production
4. **Monitor your configuration** for any issues

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase connection
3. Ensure your Stripe keys are valid
4. Contact support if problems persist

---

**Remember**: Your configuration is now securely stored and will be automatically loaded by the application. Never commit API keys to your Git repository! 