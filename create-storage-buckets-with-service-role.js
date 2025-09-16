import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key
const supabaseUrl = 'https://vwgczfdedacpymnxzxcp.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExNjMzOSwiZXhwIjoyMDY5NjkyMzM5fQ.g9TbsejTxHLPzmo7Up21GGn0KIAQ-JaX0adg7nxFVuQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createStorageBuckets() {
  try {
    console.log('Creating storage buckets with service role...');
    
    // Define the buckets we need
    const buckets = [
      {
        name: 'iska-rms-files',
        public: false,
        fileSizeLimit: 52428800, // 50MB in bytes
        allowedMimeTypes: ['*/*']
      },
      {
        name: 'student-documents',
        public: false,
        fileSizeLimit: 52428800, // 50MB in bytes
        allowedMimeTypes: ['*/*']
      },
      {
        name: 'student-passports',
        public: false,
        fileSizeLimit: 52428800, // 50MB in bytes
        allowedMimeTypes: ['*/*']
      },
      {
        name: 'student-visas',
        public: false,
        fileSizeLimit: 52428800, // 50MB in bytes
        allowedMimeTypes: ['*/*']
      },
      {
        name: 'guarantor-documents',
        public: false,
        fileSizeLimit: 52428800, // 50MB in bytes
        allowedMimeTypes: ['*/*']
      }
    ];

    // Check existing buckets first
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    console.log('Existing buckets:', existingBuckets?.map(b => b.name) || []);

    // Create each bucket if it doesn't exist
    for (const bucketConfig of buckets) {
      const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketConfig.name);
      
      if (bucketExists) {
        console.log(`✅ Bucket '${bucketConfig.name}' already exists`);
        continue;
      }

      console.log(`Creating bucket '${bucketConfig.name}'...`);
      
      const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketConfig.name, {
        public: bucketConfig.public,
        fileSizeLimit: bucketConfig.fileSizeLimit,
        allowedMimeTypes: bucketConfig.allowedMimeTypes
      });

      if (createError) {
        console.error(`❌ Error creating bucket '${bucketConfig.name}':`, createError);
      } else {
        console.log(`✅ Successfully created bucket '${bucketConfig.name}'`);
      }
    }

    // Verify all buckets exist
    const { data: finalBuckets, error: finalListError } = await supabase.storage.listBuckets();
    
    if (finalListError) {
      console.error('Error listing final buckets:', finalListError);
      return;
    }

    console.log('\n📋 Final bucket status:');
    for (const bucketConfig of buckets) {
      const exists = finalBuckets?.some(bucket => bucket.name === bucketConfig.name);
      console.log(`${exists ? '✅' : '❌'} ${bucketConfig.name}`);
    }

    console.log('\n🎉 Storage bucket setup complete!');

  } catch (error) {
    console.error('Error creating storage buckets:', error);
  }
}

// Run the storage bucket creation
createStorageBuckets(); 