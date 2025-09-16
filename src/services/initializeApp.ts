import { FileStorageService } from './fileStorage';

export class AppInitializer {
  /**
   * Initialize all required services for the application
   */
  static async initialize(): Promise<void> {
    try {
      console.log('Initializing ISKA RMS application...');
      
      // Initialize Supabase Storage bucket with timeout
      await this.initializeStorageWithTimeout();
      
      console.log('Application initialization completed successfully');
    } catch (error) {
      console.error('Application initialization failed:', error);
      // Don't throw - let the app continue with degraded functionality
    }
  }

  /**
   * Initialize Supabase Storage with timeout
   */
  private static async initializeStorageWithTimeout(): Promise<void> {
    try {
      // Set a 5-second timeout for storage initialization
      const storagePromise = FileStorageService.initializeStorage();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Storage initialization timeout')), 5000);
      });

      await Promise.race([storagePromise, timeoutPromise]);
      console.log('Supabase Storage initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize Supabase Storage (continuing without storage):', error);
      // This is not critical for the app to function
    }
  }
} 