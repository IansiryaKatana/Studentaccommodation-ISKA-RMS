/**
 * Dynamic Favicon Service
 * Manages the system favicon based on branding data
 */

export class FaviconService {
  private static readonly DEFAULT_FAVICON = '/favicon.png';
  private static currentFavicon: string | null = null;

  /**
   * Update the favicon with a new URL
   */
  static updateFavicon(faviconUrl: string | null): void {
    try {
      // Remove existing favicon links
      this.removeExistingFavicons();

      // If no favicon URL provided, use default
      const url = faviconUrl || this.DEFAULT_FAVICON;
      
      // Create new favicon links
      this.createFaviconLinks(url);
      
      // Store current favicon
      this.currentFavicon = url;
      
      console.log('✅ Favicon updated:', url);
    } catch (error) {
      console.error('❌ Error updating favicon:', error);
    }
  }

  /**
   * Remove all existing favicon links from the document head
   */
  private static removeExistingFavicons(): void {
    const existingFavicons = document.querySelectorAll('link[rel*="icon"], link[rel*="shortcut"], link[rel*="apple-touch-icon"]');
    existingFavicons.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
  }

  /**
   * Create new favicon links in the document head
   */
  private static createFaviconLinks(faviconUrl: string): void {
    const head = document.head;
    
    // Standard favicon
    const faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    faviconLink.type = 'image/png';
    faviconLink.href = faviconUrl;
    head.appendChild(faviconLink);

    // Shortcut icon
    const shortcutLink = document.createElement('link');
    shortcutLink.rel = 'shortcut icon';
    shortcutLink.type = 'image/png';
    shortcutLink.href = faviconUrl;
    head.appendChild(shortcutLink);

    // Apple touch icon
    const appleTouchLink = document.createElement('link');
    appleTouchLink.rel = 'apple-touch-icon';
    appleTouchLink.href = faviconUrl;
    head.appendChild(appleTouchLink);

    // Additional favicon sizes for better browser support
    const sizes = ['16x16', '32x32', '48x48', '64x64', '128x128', '256x256'];
    sizes.forEach(size => {
      const sizeLink = document.createElement('link');
      sizeLink.rel = 'icon';
      sizeLink.type = 'image/png';
      sizeLink.sizes = size;
      sizeLink.href = faviconUrl;
      head.appendChild(sizeLink);
    });
  }

  /**
   * Get the current favicon URL
   */
  static getCurrentFavicon(): string | null {
    return this.currentFavicon;
  }

  /**
   * Reset to default favicon
   */
  static resetToDefault(): void {
    this.updateFavicon(null);
  }

  /**
   * Initialize favicon on app startup
   */
  static initialize(faviconUrl?: string | null): void {
    this.updateFavicon(faviconUrl || null);
  }
}
