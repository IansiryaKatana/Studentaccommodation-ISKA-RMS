import { loadStripe } from '@stripe/stripe-js';
import ConfigService from '@/services/configService';

// Initialize Stripe with dynamic key loading
let stripePromise: Promise<any> | null = null;

export const initializeStripe = async () => {
  if (stripePromise) return stripePromise;
  
  try {
    const configService = ConfigService.getInstance();
    const keys = await configService.getCurrentStripeKeys();
    
    // Check if we have a valid publishable key
    if (keys.publishable_key && keys.publishable_key !== 'pk_test_your_publishable_key_here') {
      // Suppress HTTPS warning in development
      const isDevelopment = import.meta.env.DEV || window.location.protocol === 'http:';
      if (isDevelopment) {
        console.log('🔒 Stripe initialized in development mode (HTTP is allowed for testing)');
      }
      
      stripePromise = loadStripe(keys.publishable_key);
      return stripePromise;
    } else {
      throw new Error('No valid publishable key found in config');
    }
  } catch (error) {
    console.warn('Failed to load Stripe config, using fallback:', error);
    // Fallback to environment variable or test key
    const fallbackKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here';
    if (fallbackKey && fallbackKey !== 'pk_test_your_publishable_key_here') {
      // Suppress HTTPS warning in development
      const isDevelopment = import.meta.env.DEV || window.location.protocol === 'http:';
      if (isDevelopment) {
        console.log('🔒 Stripe initialized in development mode (HTTP is allowed for testing)');
      }
      
      stripePromise = loadStripe(fallbackKey);
    } else {
      console.warn('No valid Stripe publishable key found. Please configure your keys in Settings > Config Management');
      // Return a promise that resolves to null instead of rejecting
      stripePromise = Promise.resolve(null);
    }
    return stripePromise;
  }
};

export default initializeStripe; 