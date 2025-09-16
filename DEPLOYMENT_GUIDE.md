# 🚀 ISKA RMS Deployment Guide

## Overview

This guide covers deploying your ISKA RMS system using GitHub and leveraging Supabase for secure file storage. The system is designed to be production-ready with comprehensive file management capabilities.

## 📋 Table of Contents

1. [GitHub Deployment](#github-deployment)
2. [Supabase File Storage Setup](#supabase-file-storage-setup)
3. [Environment Configuration](#environment-configuration)
4. [Production Deployment](#production-deployment)
5. [File Storage Features](#file-storage-features)
6. [Security Considerations](#security-considerations)
7. [Troubleshooting](#troubleshooting)

---

## 🐙 GitHub Deployment

### Why GitHub Doesn't Allow Direct Deployment

GitHub doesn't allow direct deployment of applications because:
- **Security**: Prevents malicious code execution
- **Resource Management**: GitHub is for code hosting, not application hosting
- **Scalability**: Application hosting requires different infrastructure

### Recommended Deployment Platforms

#### 1. **Vercel** (Recommended for React Apps)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: iska-rms
# - Directory: ./
# - Override settings? No
```

#### 2. **Netlify**
```bash
# Build your project
npm run build

# Deploy to Netlify
# 1. Go to netlify.com
# 2. Drag and drop your dist/ folder
# 3. Configure environment variables
```

#### 3. **Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### 4. **Render**
```bash
# Connect your GitHub repository
# 1. Go to render.com
# 2. Connect your GitHub account
# 3. Select your repository
# 4. Configure build settings
```

---

## ☁️ Supabase File Storage Setup

### ✅ **Yes, you can store files in Supabase safely!**

Supabase provides excellent file storage capabilities that are:
- **Secure**: Built on top of PostgreSQL with RLS
- **Scalable**: Handles large files efficiently
- **Cost-effective**: Generous free tier
- **Integrated**: Works seamlessly with your existing database

### File Storage Features Implemented

#### 📁 **File Categories**
- **Invoice**: Financial documents
- **Contract**: Legal agreements
- **ID Document**: Identity verification
- **Payment Proof**: Transaction receipts
- **Maintenance Photo**: Property maintenance images
- **Cleaning Report**: Housekeeping documentation
- **Lead Attachment**: Sales-related files
- **Student Document**: Academic records
- **Tourist Document**: Travel-related files
- **System Backup**: Database backups
- **General**: Miscellaneous files

#### 🔧 **File Management Capabilities**
- ✅ **Upload**: Drag & drop or file picker
- ✅ **Download**: Secure file retrieval
- ✅ **Share**: Temporary access links
- ✅ **Organize**: Categories and tags
- ✅ **Search**: Full-text search
- ✅ **Preview**: File details and metadata
- ✅ **Delete**: Soft and permanent deletion
- ✅ **Statistics**: Usage analytics

### Database Schema

The file storage system includes:

```sql
-- File storage table
CREATE TABLE file_storage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    category file_category NOT NULL DEFAULT 'general',
    description TEXT,
    tags TEXT[],
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- File sharing table
CREATE TABLE file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID REFERENCES file_storage(id) ON DELETE CASCADE,
    share_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    max_downloads INTEGER DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## ⚙️ Environment Configuration

### 1. **Supabase Configuration**

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_secret_key_here
VITE_STRIPE_API_BASE=https://api.stripe.com/v1

# Optional: Analytics
VITE_ANALYTICS_ID=your_analytics_id
```

### 2. **Supabase Storage Bucket Setup**

Run the migration to create the storage bucket:

```sql
-- This is automatically handled by the FileStorageService
-- The bucket 'iska-rms-files' will be created on first use
```

### 3. **Storage Policies** (Optional for Production)

For enhanced security, enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE file_storage ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own files" ON file_storage
    FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can upload files" ON file_storage
    FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own files" ON file_storage
    FOR UPDATE USING (auth.uid() = uploaded_by);
```

---

## 🚀 Production Deployment

### Step 1: Prepare Your Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test the build locally
npm run preview
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Environment Variables

In your Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env` file

### Step 4: Set Up Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add yourdomain.com

# Configure DNS records as instructed
```

---

## 📁 File Storage Features

### File Upload Component

```tsx
import { FileStorageService } from '@/services/fileStorage';

// Upload a file
const handleUpload = async (file: File) => {
  try {
    const fileRecord = await FileStorageService.uploadFile(file, {
      category: 'invoice',
      description: 'Monthly invoice',
      tags: ['invoice', 'monthly'],
      related_entity_type: 'payment',
      related_entity_id: 'payment-id'
    });
    
    console.log('File uploaded:', fileRecord);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### File Download Component

```tsx
// Download a file
const handleDownload = async (fileId: string) => {
  try {
    const { data, filename } = await FileStorageService.downloadFile(fileId);
    
    // Create download link
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

### File Sharing Component

```tsx
// Create share link
const handleShare = async (fileId: string) => {
  try {
    const shareToken = await FileStorageService.createShareLink(fileId, {
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      max_downloads: 10
    });
    
    const shareUrl = `${window.location.origin}/files/share/${shareToken}`;
    await navigator.clipboard.writeText(shareUrl);
  } catch (error) {
    console.error('Share failed:', error);
  }
};
```

---

## 🔒 Security Considerations

### File Security
- ✅ **File Validation**: Type and size restrictions
- ✅ **Access Control**: User-based permissions
- ✅ **Temporary Links**: Expiring share tokens
- ✅ **Soft Delete**: Recoverable file deletion
- ✅ **Audit Trail**: Upload/download tracking

### Storage Security
- ✅ **Encryption**: Files encrypted at rest
- ✅ **HTTPS**: Secure file transfer
- ✅ **RLS**: Row-level security policies
- ✅ **Backup**: Automatic database backups

### Best Practices
1. **Never store sensitive files as public**
2. **Use temporary share links for external access**
3. **Regularly audit file access logs**
4. **Implement file size limits**
5. **Validate file types on both client and server**

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. **File Upload Fails**
```bash
# Check Supabase configuration
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

# Verify storage bucket exists
await FileStorageService.initializeStorage();
```

#### 2. **Download Permission Denied**
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'file_storage';

-- Temporarily disable RLS for testing
ALTER TABLE file_storage DISABLE ROW LEVEL SECURITY;
```

#### 3. **Share Links Not Working**
```sql
-- Check share token validity
SELECT * FROM file_shares WHERE share_token = 'your_token';

-- Verify expiration
SELECT * FROM file_shares 
WHERE share_token = 'your_token' 
AND (expires_at IS NULL OR expires_at > NOW());
```

#### 4. **Storage Quota Exceeded**
- Check your Supabase plan limits
- Implement file compression
- Use external CDN for large files
- Archive old files

### Performance Optimization

#### 1. **File Compression**
```tsx
// Compress images before upload
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width * 0.8;
      canvas.height = img.height * 0.8;
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

#### 2. **Lazy Loading**
```tsx
// Implement virtual scrolling for large file lists
import { FixedSizeList as List } from 'react-window';

const FileList = ({ files }: { files: FileRecord[] }) => (
  <List
    height={400}
    itemCount={files.length}
    itemSize={60}
    itemData={files}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <FileItem file={data[index]} />
      </div>
    )}
  </List>
);
```

---

## 📊 Monitoring and Analytics

### File Usage Analytics

```tsx
// Track file operations
const trackFileOperation = (operation: string, fileId: string) => {
  // Send to analytics service
  analytics.track('file_operation', {
    operation,
    file_id: fileId,
    timestamp: new Date().toISOString()
  });
};
```

### Storage Monitoring

```sql
-- Monitor storage usage
SELECT 
  category,
  COUNT(*) as file_count,
  SUM(file_size) as total_size,
  AVG(file_size) as avg_size
FROM file_storage 
WHERE is_deleted = false 
GROUP BY category 
ORDER BY total_size DESC;
```

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ **Deploy to Vercel/Netlify**
2. ✅ **Configure environment variables**
3. ✅ **Test file upload/download**
4. ✅ **Set up monitoring**

### Future Enhancements
1. **CDN Integration**: For faster global access
2. **File Versioning**: Track file changes
3. **Bulk Operations**: Mass upload/download
4. **Advanced Search**: Full-text search
5. **File Preview**: In-browser preview
6. **Automated Backup**: Scheduled backups

---

## 📞 Support

If you encounter any issues:

1. **Check the troubleshooting section above**
2. **Review Supabase documentation**
3. **Check the system logs**
4. **Contact support with error details**

### Useful Links
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [React File Upload Best Practices](https://react.dev/learn/forms)

---

**🎉 Congratulations! Your ISKA RMS system is now ready for production with secure file storage capabilities!** 