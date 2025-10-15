const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createCompleteDatabaseBackup() {
  try {
    console.log('🔄 Starting comprehensive database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = `backups/database/complete-backup-${timestamp}`;
    
    // Create backup directory
    if (!fs.existsSync('backups')) {
      fs.mkdirSync('backups');
    }
    if (!fs.existsSync('backups/database')) {
      fs.mkdirSync('backups/database');
    }
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // List of all tables to backup
    const tables = [
      'students',
      'users',
      'studios',
      'durations',
      'installment_plans',
      'invoices',
      'payments',
      'student_installments',
      'reservations',
      'room_grades',
      'pricing_matrix',
      'student_option_fields',
      'student_documents',
      'student_agreements',
      'staff_agreements',
      'rebooking_records',
      'studio_occupancy',
      'branding',
      'module_styles',
      'role_permissions',
      'module_access_config',
      'academic_years',
      'leads',
      'lead_sources',
      'lead_statuses',
      'tourists',
      'cleaning_schedules',
      'cleaners',
      'maintenance_requests',
      'email_templates',
      'email_logs'
    ];

    const backupData = {};
    const backupStats = {};

    console.log('📊 Backing up tables...');
    
    for (const table of tables) {
      try {
        console.log(`  📋 Backing up ${table}...`);
        
        const { data, error } = await supabase
          .from(table)
          .select('*');
          
        if (error) {
          console.log(`    ⚠️  Warning: Could not backup ${table}: ${error.message}`);
          backupData[table] = [];
          backupStats[table] = { count: 0, error: error.message };
        } else {
          backupData[table] = data || [];
          backupStats[table] = { count: data?.length || 0, error: null };
          console.log(`    ✅ ${table}: ${data?.length || 0} records`);
        }
      } catch (err) {
        console.log(`    ❌ Error backing up ${table}: ${err.message}`);
        backupData[table] = [];
        backupStats[table] = { count: 0, error: err.message };
      }
    }

    // Save backup data
    const backupFile = path.join(backupDir, 'database-backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    // Save backup stats
    const statsFile = path.join(backupDir, 'backup-stats.json');
    fs.writeFileSync(statsFile, JSON.stringify(backupStats, null, 2));
    
    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      backup_type: 'complete_database_backup',
      tables_backed_up: tables.length,
      total_records: Object.values(backupStats).reduce((sum, stat) => sum + stat.count, 0),
      backup_directory: backupDir,
      backup_file: backupFile,
      stats_file: statsFile,
      supabase_url: process.env.VITE_SUPABASE_URL,
      backup_created_by: 'migration_backup_script'
    };
    
    const manifestFile = path.join(backupDir, 'backup-manifest.json');
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));

    console.log('\n✅ Database backup completed successfully!');
    console.log(`📁 Backup directory: ${backupDir}`);
    console.log(`📊 Total records backed up: ${manifest.total_records}`);
    console.log(`📋 Tables backed up: ${manifest.tables_backed_up}`);
    
    // Display summary
    console.log('\n📈 Backup Summary:');
    Object.entries(backupStats).forEach(([table, stats]) => {
      if (stats.error) {
        console.log(`  ❌ ${table}: ${stats.count} records (ERROR: ${stats.error})`);
      } else {
        console.log(`  ✅ ${table}: ${stats.count} records`);
      }
    });

    return {
      success: true,
      backupDir,
      manifest,
      stats: backupStats
    };

  } catch (error) {
    console.error('❌ Database backup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the backup
createCompleteDatabaseBackup()
  .then(result => {
    if (result.success) {
      console.log('\n🎉 Backup completed successfully!');
      console.log(`📁 Backup location: ${result.backupDir}`);
      process.exit(0);
    } else {
      console.error('\n💥 Backup failed:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
