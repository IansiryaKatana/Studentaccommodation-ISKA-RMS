import { ApiService } from './api';

export interface WordPressFormData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  message?: string;
  room_grade?: string;
  duration?: string;
  budget?: string;
}

export class WebhookService {
  /**
   * Process WordPress/Elementor form submission
   * This endpoint should be called from WordPress when a form is submitted
   */
  static async processWordPressForm(formData: WordPressFormData) {
    try {
      console.log('Processing WordPress form data:', formData);

      // Validate required fields
      if (!formData.first_name || !formData.last_name) {
        throw new Error('First name and last name are required');
      }

      // Create lead using the API service
      const lead = await ApiService.createLeadFromWebhook(formData);

      console.log('Lead created successfully:', lead);

      return {
        success: true,
        message: 'Lead created successfully',
        leadId: lead.id,
        data: lead
      };
    } catch (error) {
      console.error('Error processing WordPress form:', error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        error: error
      };
    }
  }

  /**
   * Test endpoint to simulate WordPress form submission
   * This can be used for testing the integration
   */
  static async testWordPressIntegration() {
    const testData: WordPressFormData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      message: 'Interested in booking a room for 2 weeks',
      room_grade: '770e8400-e29b-41d4-a716-446655440001', // This should be a valid room grade ID
      duration: '770e8400-e29b-41d4-a716-446655440001', // This should be a valid duration ID
      budget: '1500'
    };

    return await this.processWordPressForm(testData);
  }
}
