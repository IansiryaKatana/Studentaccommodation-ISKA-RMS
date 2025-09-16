import { supabase } from '@/integrations/supabase/client';
import { FileStorageService } from './fileStorage';

export interface StripeConfig {
  test: {
    publishable_key: string;
    secret_key: string;
  };
  live: {
    publishable_key: string;
    secret_key: string;
  };
  environment: 'test' | 'live';
  last_updated: string;
  notes: string;
}

export interface AppConfig {
  stripe: StripeConfig;
  [key: string]: any;
}

class ConfigService {
  private static instance: ConfigService;
  private configCache: Map<string, any> = new Map();
  private storageInitialized = false;

  constructor() {
    // Remove automatic storage initialization to prevent loading timeouts
    // Storage will be initialized lazily when needed
  }

  private async initializeStorageIfNeeded() {
    if (this.storageInitialized) return;
    
    try {
      await FileStorageService.initializeStorage();
      this.storageInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize storage bucket:', error);
      // Don't throw - let the app continue without storage
    }
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Load configuration file from localStorage (primary) or Supabase Storage (backup)
   */
  async loadConfig(filename: string): Promise<any> {
    try {
      // Check cache first
      if (this.configCache.has(filename)) {
        console.log(`Config ${filename} loaded from cache`);
        return this.configCache.get(filename);
      }

      // Try to load from localStorage first (primary source)
      const localConfig = localStorage.getItem(`config_${filename}`);
      if (localConfig) {
        try {
          const config = JSON.parse(localConfig);
          this.configCache.set(filename, config);
          console.log(`✅ Config ${filename} loaded from localStorage`);
          return config;
        } catch (parseError) {
          console.warn('Failed to parse localStorage config:', parseError);
        }
      }

      // Try to load from Supabase Storage (backup) - initialize storage lazily
      try {
        await this.initializeStorageIfNeeded();
        
        const files = await FileStorageService.listFiles({
          search: filename,
          category: 'system_backup'
        });

        if (files.length === 0) {
          throw new Error(`Configuration file ${filename} not found in storage`);
        }

        // Get the most recent version
        const configFile = files.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];

        // Download and parse the file
        const { data: fileData } = await FileStorageService.downloadFile(configFile.id);
        const config = JSON.parse(await fileData.text());

        // Cache the result
        this.configCache.set(filename, config);
        
        console.log(`✅ Config ${filename} loaded from Supabase Storage backup`);
        return config;
      } catch (storageError) {
        console.warn('Storage backup not available:', storageError.message);
        throw new Error(`Configuration file ${filename} not found in localStorage or storage backup`);
      }
    } catch (error) {
      console.error(`Error loading config ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Load Stripe configuration specifically
   */
  async loadStripeConfig(): Promise<StripeConfig> {
    const config = await this.loadConfig('stripe-keys.json');
    return config.stripe;
  }

  /**
   * Get current Stripe keys based on environment
   */
  async getCurrentStripeKeys(): Promise<{ publishable_key: string; secret_key: string }> {
    const stripeConfig = await this.loadStripeConfig();
    const environment = stripeConfig.environment || 'test';
    return stripeConfig[environment];
  }

  /**
   * Save configuration file to localStorage and optionally to Supabase Storage
   */
  async uploadConfig(filename: string, config: any): Promise<void> {
    try {
      // Save to localStorage (primary)
      localStorage.setItem(`config_${filename}`, JSON.stringify(config, null, 2));
      
      // Update cache
      this.configCache.set(filename, config);
      
      console.log(`✅ Config ${filename} saved to localStorage`);

      // Optionally save to Supabase Storage as backup
      try {
        await this.initializeStorageIfNeeded();
        
        const configBlob = new Blob([JSON.stringify(config, null, 2)], {
          type: 'application/json'
        });
        
        const configFile = new File([configBlob], filename, {
          type: 'application/json'
        });

        await FileStorageService.uploadFile(configFile, {
          category: 'system_backup',
          description: `Configuration backup for ${filename}`,
          tags: ['config', 'backup', filename.replace('.json', '')]
        });

        console.log(`✅ Config ${filename} backed up to Supabase Storage`);
      } catch (storageError) {
        console.warn('Failed to backup config to storage:', storageError);
        // Don't throw - localStorage save was successful
      }
    } catch (error) {
      console.error(`Error saving config ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Clear the configuration cache
   */
  clearCache(): void {
    this.configCache.clear();
    console.log('Configuration cache cleared');
  }

  /**
   * Check if a configuration file exists
   */
  async configExists(filename: string): Promise<boolean> {
    try {
      // Check localStorage first
      const localConfig = localStorage.getItem(`config_${filename}`);
      if (localConfig) return true;

      // Check storage backup
      await this.initializeStorageIfNeeded();
      
      const files = await FileStorageService.listFiles({
        search: filename,
        category: 'system_backup'
      });

      return files.length > 0;
    } catch (error) {
      console.warn('Error checking config existence:', error);
      return false;
    }
  }

  /**
   * Get all available configuration files
   */
  async listConfigs(): Promise<string[]> {
    const configs: string[] = [];
    
    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('config_')) {
        configs.push(key.replace('config_', ''));
      }
    }

    // Check storage backup
    try {
      await this.initializeStorageIfNeeded();
      
      const files = await FileStorageService.listFiles({
        category: 'system_backup'
      });

      files.forEach(file => {
        if (file.original_filename.endsWith('.json')) {
          configs.push(file.original_filename);
        }
      });
    } catch (error) {
      console.warn('Error listing storage configs:', error);
    }

    return [...new Set(configs)]; // Remove duplicates
  }

  /**
   * Delete a configuration file
   */
  async deleteConfig(filename: string): Promise<void> {
    try {
      // Remove from localStorage
      localStorage.removeItem(`config_${filename}`);
      
      // Remove from cache
      this.configCache.delete(filename);
      
      console.log(`✅ Config ${filename} deleted from localStorage`);

      // Optionally remove from storage backup
      try {
        await this.initializeStorageIfNeeded();
        
        const files = await FileStorageService.listFiles({
          search: filename,
          category: 'system_backup'
        });

        for (const file of files) {
          await FileStorageService.deleteFile(file.id);
        }

        console.log(`✅ Config ${filename} deleted from storage backup`);
      } catch (storageError) {
        console.warn('Failed to delete config from storage:', storageError);
        // Don't throw - localStorage deletion was successful
      }
    } catch (error) {
      console.error(`Error deleting config ${filename}:`, error);
      throw error;
    }
  }
}

export default ConfigService; 