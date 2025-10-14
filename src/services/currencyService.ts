/**
 * Dynamic Currency Service
 * Handles currency formatting based on system preferences
 */

export class CurrencyService {
  private static currentCurrency = 'GBP'; // Default fallback
  private static currentLocale = 'en-GB'; // Default fallback

  /**
   * Initialize currency service with system preferences
   */
  static initialize(currency?: string, locale?: string): void {
    this.currentCurrency = currency || 'GBP';
    this.currentLocale = locale || this.getLocaleFromCurrency(this.currentCurrency);
  }

  /**
   * Get locale from currency code
   */
  private static getLocaleFromCurrency(currency: string): string {
    const currencyLocaleMap: Record<string, string> = {
      'USD': 'en-US',
      'GBP': 'en-GB', 
      'EUR': 'en-EU',
      'CAD': 'en-CA',
      'AUD': 'en-AU',
      'JPY': 'ja-JP',
      'CHF': 'de-CH',
      'SEK': 'sv-SE',
      'NOK': 'nb-NO',
      'DKK': 'da-DK'
    };
    return currencyLocaleMap[currency] || 'en-GB';
  }

  /**
   * Format amount as currency
   */
  static format(amount: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.currentLocale, {
        style: 'currency',
        currency: this.currentCurrency,
        ...options
      }).format(amount);
    } catch (error) {
      console.warn('Currency formatting error, using fallback:', error);
      return this.getCurrencySymbol() + amount.toFixed(2);
    }
  }

  /**
   * Get currency symbol
   */
  static getCurrencySymbol(): string {
    const symbols: Record<string, string> = {
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'CAD': 'C$',
      'AUD': 'A$',
      'JPY': '¥',
      'CHF': 'CHF',
      'SEK': 'kr',
      'NOK': 'kr',
      'DKK': 'kr'
    };
    return symbols[this.currentCurrency] || '£';
  }

  /**
   * Get current currency code
   */
  static getCurrentCurrency(): string {
    return this.currentCurrency;
  }

  /**
   * Parse currency string to number
   */
  static parse(currencyString: string): number {
    // Remove currency symbols and parse
    const cleaned = currencyString.replace(/[^\d.,-]/g, '');
    return parseFloat(cleaned.replace(',', ''));
  }
}
