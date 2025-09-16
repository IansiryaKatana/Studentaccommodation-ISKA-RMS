import { supabase } from '@/integrations/supabase/client';

export interface FileRecord {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: 'invoice' | 'contract' | 'id_document' | 'payment_proof' | 'maintenance_photo' | 'cleaning_report' | 'lead_attachment' | 'student_document' | 'tourist_document' | 'system_backup' | 'general';
  description?: string;
  tags?: string[];
  related_entity_type?: string;
  related_entity_id?: string;
  uploaded_by?: string;
  is_public: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileShare {
  id: string;
  file_id: string;
  share_token: string;
  expires_at?: string;
  max_downloads?: number;
  download_count: number;
  created_by?: string;
  created_at: string;
}

export interface UploadOptions {
  category?: FileRecord['category'];
  description?: string;
  tags?: string[];
  related_entity_type?: string;
  related_entity_id?: string;
  is_public?: boolean;
}

export class FileStorageService {
  private static readonly STORAGE_BUCKET = 'iska-rms-files';
  private static readonly STUDENT_DOCUMENTS_BUCKET = 'student-documents';
  private static readonly GUARANTOR_DOCUMENTS_BUCKET = 'guarantor-documents';
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/json',
    'application/zip',
    'application/x-zip-compressed'
  ];

  /**
   * Initialize storage bucket if it doesn't exist
   */
  static async initializeStorage(): Promise<void> {
    try {
      // Try to access the bucket directly instead of listing all buckets
      // This is more reliable with anon key permissions
      const { data, error } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .list('', { limit: 1 });
      
      if (error) {
        if (error.message.includes('not found') || error.message.includes('does not exist')) {
          console.log('Storage bucket does not exist. Please create it manually in Supabase Dashboard.');
          console.log('Bucket name:', this.STORAGE_BUCKET);
          console.log('Settings: public=false, file size limit=50MB');
          console.log('\nAlternatively, run the create-storage-buckets-with-service-role.js script with your service role key.');
        } else {
          console.warn('Could not access storage bucket:', error.message);
        }
        return;
      }

      console.log('✅ Storage bucket exists and is ready');
    } catch (error) {
      console.warn('Storage initialization skipped due to permissions or network issues:', error);
      // Don't throw - let the app continue without storage
    }
  }

  /**
   * Upload a file to Supabase Storage and create database record
   */
  static async uploadFile(
    file: File,
    options: UploadOptions = {}
  ): Promise<FileRecord> {
    return this.uploadFileToBucket(file, options, this.STORAGE_BUCKET);
  }

  /**
   * Download a file from Supabase Storage
   */
  static async downloadFile(fileId: string): Promise<{ data: Blob; filename: string }> {
    try {
      // Get file record
      const { data: fileRecord, error: fetchError } = await supabase
        .from('file_storage')
        .select('*')
        .eq('id', fileId)
        .eq('is_deleted', false)
        .single();

      if (fetchError || !fileRecord) {
        throw new Error('File not found');
      }

      // Download from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .download(fileRecord.file_path);

      if (downloadError) throw downloadError;

      return {
        data: fileData,
        filename: fileRecord.original_filename
      };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  static async getFile(fileId: string): Promise<FileRecord | null> {
    try {
      const { data, error } = await supabase
        .from('file_storage')
        .select('*')
        .eq('id', fileId)
        .eq('is_deleted', false)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  }

  /**
   * List files with optional filtering
   */
  static async listFiles(filters: {
    category?: FileRecord['category'];
    related_entity_type?: string;
    related_entity_id?: string;
    uploaded_by?: string;
    tags?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<FileRecord[]> {
    try {
      let query = supabase
        .from('file_storage')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.related_entity_type) {
        query = query.eq('related_entity_type', filters.related_entity_type);
      }

      if (filters.related_entity_id) {
        query = query.eq('related_entity_id', filters.related_entity_id);
      }

      if (filters.uploaded_by) {
        query = query.eq('uploaded_by', filters.uploaded_by);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      if (filters.search) {
        query = query.or(`original_filename.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 10)) - 1);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Create a shareable link for a file
   */
  static async createShareLink(
    fileId: string,
    options: {
      expires_at?: Date;
      max_downloads?: number;
    } = {}
  ): Promise<string> {
    try {
      const { data, error } = await supabase.rpc('create_file_share', {
        p_file_id: fileId,
        p_expires_at: options.expires_at?.toISOString(),
        p_max_downloads: options.max_downloads || 1
      });

      if (error) throw error;

      // Return the share token (you can construct the full URL in your frontend)
      return data;
    } catch (error) {
      console.error('Error creating share link:', error);
      throw error;
    }
  }

  /**
   * Validate and get file from share token
   */
  static async getFileFromShare(shareToken: string): Promise<FileRecord | null> {
    try {
      const { data: fileId, error } = await supabase.rpc('validate_file_share', {
        p_share_token: shareToken
      });

      if (error || !fileId) {
        throw new Error('Invalid or expired share token');
      }

      return await this.getFile(fileId);
    } catch (error) {
      console.error('Error validating share token:', error);
      return null;
    }
  }

  /**
   * Delete a file (soft delete)
   */
  static async deleteFile(fileId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('file_storage')
        .update({ is_deleted: true })
        .eq('id', fileId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Permanently delete a file from storage and database
   */
  static async permanentlyDeleteFile(fileId: string): Promise<void> {
    try {
      // Get file record
      const fileRecord = await this.getFile(fileId);
      if (!fileRecord) {
        throw new Error('File not found');
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.STORAGE_BUCKET)
        .remove([fileRecord.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('file_storage')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;
    } catch (error) {
      console.error('Error permanently deleting file:', error);
      throw error;
    }
  }

  /**
   * Update file metadata
   */
  static async updateFile(
    fileId: string,
    updates: Partial<Pick<FileRecord, 'description' | 'tags' | 'category' | 'is_public'>>
  ): Promise<FileRecord> {
    try {
      const { data, error } = await supabase
        .from('file_storage')
        .update(updates)
        .eq('id', fileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating file:', error);
      throw error;
    }
  }

  /**
   * Get file statistics
   */
  static async getFileStats(): Promise<{
    total_files: number;
    total_size: number;
    files_by_category: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('file_storage')
        .select('file_size, category')
        .eq('is_deleted', false);

      if (error) throw error;

      const stats = {
        total_files: data.length,
        total_size: data.reduce((sum, file) => sum + file.file_size, 0),
        files_by_category: {} as Record<string, number>
      };

      data.forEach(file => {
        stats.files_by_category[file.category] = (stats.files_by_category[file.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting file stats:', error);
      return {
        total_files: 0,
        total_size: 0,
        files_by_category: {}
      };
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File): void {
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error('File type not allowed');
    }
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file icon based on MIME type
   */
  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
    if (mimeType.startsWith('text/')) return '📄';
    return '📎';
  }

  /**
   * Upload student document
   */
  static async uploadStudentDocument(
    file: File,
    studentId: string,
    documentType: string,
    options: UploadOptions = {}
  ): Promise<FileRecord> {
    return this.uploadFileToBucket(file, {
      ...options,
      category: 'student_document',
      related_entity_type: 'student',
      related_entity_id: studentId,
      description: `Student document: ${documentType}`,
      tags: ['student', 'document', documentType.toLowerCase()]
    }, this.STUDENT_DOCUMENTS_BUCKET);
  }

  /**
   * Upload guarantor document
   */
  static async uploadGuarantorDocument(
    file: File,
    studentId: string,
    documentType: string,
    options: UploadOptions = {}
  ): Promise<FileRecord> {
    return this.uploadFileToBucket(file, {
      ...options,
      category: 'guarantor_document',
      related_entity_type: 'student',
      related_entity_id: studentId,
      description: `Guarantor document: ${documentType}`,
      tags: ['guarantor', 'document', documentType.toLowerCase()]
    }, this.GUARANTOR_DOCUMENTS_BUCKET);
  }

  /**
   * Get student documents
   */
  static async getStudentDocuments(studentId: string): Promise<FileRecord[]> {
    return this.listFiles({
      category: 'student_document',
      related_entity_type: 'student',
      related_entity_id: studentId
    });
  }

  /**
   * Get guarantor documents
   */
  static async getGuarantorDocuments(studentId: string): Promise<FileRecord[]> {
    return this.listFiles({
      category: 'guarantor_document',
      related_entity_type: 'student',
      related_entity_id: studentId
    });
  }

  /**
   * Upload file with custom bucket
   */
  private static async uploadFileToBucket(
    file: File,
    options: UploadOptions = {},
    bucket: string = this.STORAGE_BUCKET
  ): Promise<FileRecord> {
    try {
      console.log('🚀 Starting file upload...');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      });

      // Validate file
      this.validateFile(file);
      console.log('✅ File validation passed');

      // Generate unique filename
      const fileExtension = file.name.split('.').pop();
      const uniqueFilename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
      const filePath = `${options.category || 'general'}/${uniqueFilename}`;
      console.log('Generated file path:', filePath);

      // Upload to Supabase Storage
      console.log('📤 Uploading to Supabase Storage...');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Storage upload error:', uploadError);
        console.error('Error details:', {
          message: uploadError.message,
          name: uploadError.name,
          statusCode: uploadError.statusCode,
          details: uploadError.details
        });
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      console.log('✅ File uploaded to storage successfully');
      console.log('Upload data:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Create database record
      console.log('💾 Creating database record...');
      const { data: fileRecord, error: dbError } = await supabase
        .from('file_storage')
        .insert({
          filename: uniqueFilename,
          original_filename: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          category: options.category || 'general',
          description: options.description,
          tags: options.tags || [],
          related_entity_type: options.related_entity_type,
          related_entity_id: options.related_entity_id,
          is_public: options.is_public || false
        })
        .select()
        .single();

      if (dbError) {
        console.error('❌ Database insert error:', dbError);
        console.error('Error details:', {
          message: dbError.message,
          name: dbError.name,
          details: dbError.details,
          hint: dbError.hint
        });
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      console.log('✅ File record created in database');
      console.log('File record:', fileRecord);
      return fileRecord;
    } catch (error) {
      console.error('❌ Error uploading file:', error);
      console.error('Full error object:', error);
      throw error;
    }
  }
} 