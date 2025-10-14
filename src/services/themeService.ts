// Theme Service - Applies branding colors to CSS variables
// This service converts hex colors to HSL and updates CSS custom properties

export class ThemeService {
  /**
   * Convert hex color to HSL format used by Tailwind CSS variables
   * @param hex - Hex color string (e.g., "#3B82F6")
   * @returns HSL string (e.g., "221.2 83.2% 53.3%")
   */
  static hexToHSL(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Find min and max values
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    // Calculate lightness
    let l = (max + min) / 2;

    // Calculate saturation
    let s = 0;
    if (delta !== 0) {
      s = delta / (1 - Math.abs(2 * l - 1));
    }

    // Calculate hue
    let h = 0;
    if (delta !== 0) {
      if (max === r) {
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      } else if (max === g) {
        h = ((b - r) / delta + 2) / 6;
      } else {
        h = ((r - g) / delta + 4) / 6;
      }
    }

    // Convert to degrees and percentages
    h = Math.round(h * 360 * 10) / 10;
    s = Math.round(s * 100 * 10) / 10;
    l = Math.round(l * 100 * 10) / 10;

    // Return in Tailwind CSS variable format (no hsl() wrapper)
    return `${h} ${s}% ${l}%`;
  }

  /**
   * Calculate a contrasting foreground color (black or white) based on background luminance
   * @param hex - Background hex color
   * @returns HSL string for white or black text
   */
  static getContrastForeground(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance (WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? '0 0% 0%' : '0 0% 100%';
  }

  /**
   * Apply branding colors to CSS custom properties
   * @param primaryColor - Hex color for primary (buttons, links, etc.)
   * @param secondaryColor - Hex color for secondary elements (optional, not used currently)
   * @param accentColor - Hex color for accents (optional, not used currently)
   * 
   * Note: Only primary color is applied to maintain module-specific hover states
   */
  static applyBrandingColors(
    primaryColor: string,
    secondaryColor?: string,
    accentColor?: string
  ): void {
    const root = document.documentElement;

    // Convert primary color to HSL
    const primaryHSL = this.hexToHSL(primaryColor);
    const primaryForeground = this.getContrastForeground(primaryColor);

    // Apply primary color (used for buttons, links, focus rings)
    root.style.setProperty('--primary', primaryHSL);
    root.style.setProperty('--primary-foreground', primaryForeground);
    root.style.setProperty('--ring', primaryHSL); // Focus ring uses primary color

    // DO NOT apply secondary or accent colors - they are used for sidebar hover states
    // and should remain as neutral grays to not interfere with module-specific gradients
    // The sidebar uses module-specific gradients for active states via --custom-gradient

    console.log('🎨 Theme colors applied:', {
      primary: primaryHSL,
      primaryForeground,
      note: 'Accent/Secondary unchanged to preserve module hover colors'
    });
  }

  /**
   * Reset to default theme colors
   */
  static resetToDefaults(): void {
    const root = document.documentElement;
    
    // Default blue theme
    root.style.setProperty('--primary', '221.2 83.2% 53.3%');
    root.style.setProperty('--primary-foreground', '210 40% 98%');
    root.style.setProperty('--ring', '221.2 83.2% 53.3%');
    root.style.setProperty('--secondary', '210 40% 96%');
    root.style.setProperty('--secondary-foreground', '222.2 84% 4.9%');
    root.style.setProperty('--accent', '210 40% 96%');
    root.style.setProperty('--accent-foreground', '222.2 84% 4.9%');
    
    console.log('🎨 Theme reset to defaults');
  }

  /**
   * Get current CSS variable value
   * @param variableName - CSS variable name without --
   */
  static getCSSVariable(variableName: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(`--${variableName}`)
      .trim();
  }
}

