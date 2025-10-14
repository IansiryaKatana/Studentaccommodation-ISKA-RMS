/**
 * Dynamic Page Title and Meta Tags Service
 * Manages page titles and meta tags based on branding data
 */

export class PageTitleService {
  private static readonly DEFAULT_TITLE = 'Property Management System';
  private static readonly DEFAULT_DESCRIPTION = 'Professional Property Management System';
  private static readonly DEFAULT_AUTHOR = 'System Administrator';
  private static readonly DEFAULT_OG_IMAGE = '/favicon.png';
  private static readonly DEFAULT_TWITTER_SITE = '@propertymgmt';

  /**
   * Update page title and meta tags based on branding data
   */
  static updatePageMeta(branding: {
    company_name?: string;
    dashboard_title?: string;
    dashboard_subtitle?: string;
    company_website?: string;
    logo_url?: string;
  } | null): void {
    try {
      // Generate dynamic title and description
      const companyName = branding?.company_name || 'Property Management System';
      const dashboardTitle = branding?.dashboard_title || companyName;
      const dashboardSubtitle = branding?.dashboard_subtitle || 'Property Management System';
      
      // Update page title
      const pageTitle = `${dashboardTitle} - ${dashboardSubtitle}`;
      document.title = pageTitle;

      // Update meta description
      this.updateMetaTag('description', `${dashboardTitle} - ${dashboardSubtitle}`);

      // Update Open Graph tags
      this.updateMetaTag('og:title', dashboardTitle, 'property');
      this.updateMetaTag('og:description', `${dashboardTitle} - ${dashboardSubtitle}`, 'property');
      this.updateMetaTag('og:type', 'website', 'property');
      
      // Update Open Graph image if logo is available
      if (branding?.logo_url) {
        this.updateMetaTag('og:image', branding.logo_url, 'property');
      } else {
        this.updateMetaTag('og:image', this.DEFAULT_OG_IMAGE, 'property');
      }

      // Update Twitter Card tags
      this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
      this.updateMetaTag('twitter:title', dashboardTitle, 'name');
      this.updateMetaTag('twitter:description', `${dashboardTitle} - ${dashboardSubtitle}`, 'name');
      
      // Update Twitter image
      if (branding?.logo_url) {
        this.updateMetaTag('twitter:image', branding.logo_url, 'name');
      } else {
        this.updateMetaTag('twitter:image', this.DEFAULT_OG_IMAGE, 'name');
      }

      // Update author if company website is available
      if (branding?.company_website) {
        this.updateMetaTag('author', companyName);
      } else {
        this.updateMetaTag('author', this.DEFAULT_AUTHOR);
      }

      console.log('✅ Page meta tags updated:', {
        title: pageTitle,
        company: companyName,
        description: `${dashboardTitle} - ${dashboardSubtitle}`
      });

    } catch (error) {
      console.error('❌ Error updating page meta tags:', error);
    }
  }

  /**
   * Update a specific meta tag
   */
  private static updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name'): void {
    // Try to find existing meta tag
    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (metaTag) {
      // Update existing tag
      metaTag.content = content;
    } else {
      // Create new meta tag
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      metaTag.content = content;
      document.head.appendChild(metaTag);
    }
  }

  /**
   * Reset to default meta tags
   */
  static resetToDefault(): void {
    document.title = this.DEFAULT_TITLE;
    this.updateMetaTag('description', this.DEFAULT_DESCRIPTION);
    this.updateMetaTag('og:title', 'Property Management System', 'property');
    this.updateMetaTag('og:description', this.DEFAULT_DESCRIPTION, 'property');
    this.updateMetaTag('og:image', this.DEFAULT_OG_IMAGE, 'property');
    this.updateMetaTag('twitter:title', 'Property Management System', 'name');
    this.updateMetaTag('twitter:description', this.DEFAULT_DESCRIPTION, 'name');
    this.updateMetaTag('twitter:image', this.DEFAULT_OG_IMAGE, 'name');
    this.updateMetaTag('author', this.DEFAULT_AUTHOR);
  }

  /**
   * Initialize page meta tags
   */
  static initialize(branding?: {
    company_name?: string;
    dashboard_title?: string;
    dashboard_subtitle?: string;
    company_website?: string;
    logo_url?: string;
  } | null): void {
    this.updatePageMeta(branding || null);
  }
}
