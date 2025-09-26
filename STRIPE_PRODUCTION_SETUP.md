# Stripe Production Setup Guide

## HTTPS Requirement for Production

Stripe.js requires HTTPS in production environments for security reasons. The warning you see in development is normal and expected.

### Development vs Production

- **Development**: HTTP is allowed for testing purposes
- **Production**: HTTPS is required for live transactions

### Setting Up HTTPS for Production

1. **Deploy to a platform with HTTPS support**:
   - Vercel (recommended)
   - Netlify
   - AWS CloudFront
   - Azure Static Web Apps

2. **Configure custom domain with SSL**:
   - Use Let's Encrypt for free SSL certificates
   - Configure your hosting provider's SSL settings

3. **Update Stripe webhook endpoints**:
   - Ensure webhook URLs use HTTPS
   - Update in Stripe Dashboard > Webhooks

### Environment Variables for Production

```env
# Production Stripe Keys (use live keys, not test keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_live_your_live_secret_key_here

# Ensure HTTPS is enabled
VITE_APP_ENV=production
```

### Stripe Configuration in Production

1. **Switch to Live Keys**:
   - Use Settings > Config Management in the app
   - Upload live Stripe keys (pk_live_... and sk_live_...)

2. **Configure Webhook Endpoints**:
   ```
   https://yourdomain.com/api/stripe-webhook
   ```

3. **Test Payment Flow**:
   - Use real payment methods in test mode first
   - Verify webhook handling works correctly

### Security Best Practices

- Never expose secret keys in client-side code
- Use environment variables for all sensitive configuration
- Enable Stripe's fraud protection features
- Monitor payment logs regularly

### Troubleshooting

If you see HTTPS warnings in production:
1. Check that your domain uses HTTPS
2. Verify SSL certificate is valid
3. Ensure all Stripe webhook endpoints use HTTPS
4. Check browser console for mixed content warnings

The warning in development is expected and does not affect functionality.

