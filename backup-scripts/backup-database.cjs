// Complete Database Backup Script for iska-RMS
// This script creates a comprehensive backup of the Supabase database

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config();

// Configuration
const BACKUP_PATH = './backups/database';
const PROJECT_NAME = 'iska-RMS';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create timestamp for backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                 new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
const backupFolder = path.join(BACKUP_PATH, `${PROJECT_NAME}-db-backup-${timestamp}`);

console.log('🚀 Starting complete database backup...');
console.log(`📁 Backup location: ${backupFolder}`);

async function createBackupDirectory() {
    try {
        await fs.mkdir(backupFolder, { recursive: true });
        console.log('✅ Created backup directory');
    } catch (error) {
        console.error('❌ Error creating backup directory:', error.message);
        process.exit(1);
    }
}

async function getTableList() {
    try {
        const { data, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .not('table_name', 'like', 'pg_%')
            .not('table_name', 'like', 'information_schema%');

        if (error) throw error;
        
        return data.map(row => row.table_name);
    } catch (error) {
        console.error('❌ Error getting table list:', error.message);
        return [];
    }
}

async function backupTableSchema(tableName) {
    try {
        const { data, error } = await supabase
            .rpc('get_table_schema', { table_name: tableName });

        if (error) {
            // Fallback to basic schema query
            const { data: columns, error: colError } = await supabase
                .from('information_schema.columns')
                .select('column_name, data_type, is_nullable, column_default')
                .eq('table_schema', 'public')
                .eq('table_name', tableName)
                .order('ordinal_position');

            if (colError) throw colError;
            
            return {
                table_name: tableName,
                columns: columns,
                type: 'fallback_schema'
            };
        }

        return data;
    } catch (error) {
        console.error(`❌ Error backing up schema for ${tableName}:`, error.message);
        return null;
    }
}

async function backupTableData(tableName) {
    try {
        console.log(`📊 Backing up data for table: ${tableName}`);
        
        // Get total count
        const { count, error: countError } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        if (count === 0) {
            console.log(`   ⚠️  Table ${tableName} is empty`);
            return { table: tableName, data: [], count: 0 };
        }

        console.log(`   📈 Found ${count} records`);

        // Fetch all data in batches
        const batchSize = 1000;
        const allData = [];
        let offset = 0;

        while (offset < count) {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .range(offset, offset + batchSize - 1);

            if (error) throw error;

            allData.push(...data);
            offset += batchSize;

            // Progress indicator
            const progress = Math.min(100, Math.round((offset / count) * 100));
            process.stdout.write(`\r   📊 Progress: ${progress}% (${offset}/${count})`);
        }

        console.log(`\n   ✅ Successfully backed up ${allData.length} records`);
        return { table: tableName, data: allData, count: allData.length };

    } catch (error) {
        console.error(`\n   ❌ Error backing up data for ${tableName}:`, error.message);
        return { table: tableName, data: [], count: 0, error: error.message };
    }
}

async function backupRLSPolicies() {
    try {
        console.log('🔒 Backing up RLS policies...');
        
        const { data, error } = await supabase
            .rpc('get_rls_policies');

        if (error) {
            console.log('   ⚠️  Could not fetch RLS policies, skipping...');
            return [];
        }

        console.log(`   ✅ Backed up ${data.length} RLS policies`);
        return data;
    } catch (error) {
        console.log('   ⚠️  Error backing up RLS policies:', error.message);
        return [];
    }
}

async function backupFunctions() {
    try {
        console.log('⚙️  Backing up database functions...');
        
        const { data, error } = await supabase
            .from('information_schema.routines')
            .select('routine_name, routine_definition')
            .eq('routine_schema', 'public')
            .eq('routine_type', 'FUNCTION');

        if (error) throw error;

        console.log(`   ✅ Backed up ${data.length} functions`);
        return data;
    } catch (error) {
        console.log('   ⚠️  Error backing up functions:', error.message);
        return [];
    }
}

async function backupTriggers() {
    try {
        console.log('🔔 Backing up database triggers...');
        
        const { data, error } = await supabase
            .from('information_schema.triggers')
            .select('trigger_name, event_manipulation, event_object_table, action_statement')
            .eq('trigger_schema', 'public');

        if (error) throw error;

        console.log(`   ✅ Backed up ${data.length} triggers`);
        return data;
    } catch (error) {
        console.log('   ⚠️  Error backing up triggers:', error.message);
        return [];
    }
}

async function createBackupManifest(tables, schemas, dataBackups, rlsPolicies, functions, triggers) {
    const manifest = {
        projectName: PROJECT_NAME,
        backupTimestamp: timestamp,
        backupLocation: backupFolder,
        databaseInfo: {
            url: supabaseUrl,
            backupDate: new Date().toISOString(),
            totalTables: tables.length,
            totalRecords: dataBackups.reduce((sum, backup) => sum + backup.count, 0)
        },
        backupSummary: {
            tables: tables.map(table => ({
                name: table,
                recordCount: dataBackups.find(b => b.table === table)?.count || 0,
                hasSchema: schemas.some(s => s?.table_name === table)
            })),
            rlsPolicies: rlsPolicies.length,
            functions: functions.length,
            triggers: triggers.length
        },
        systemInfo: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch
        }
    };

    const manifestPath = path.join(backupFolder, 'backup-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Created backup manifest');
    return manifest;
}

async function saveBackupData(data, filename) {
    const filePath = path.join(backupFolder, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function main() {
    try {
        // Create backup directory
        await createBackupDirectory();

        // Get all tables
        console.log('📋 Getting table list...');
        const tables = await getTableList();
        console.log(`✅ Found ${tables.length} tables`);

        // Backup schemas
        console.log('\n🏗️  Backing up table schemas...');
        const schemas = [];
        for (const table of tables) {
            const schema = await backupTableSchema(table);
            if (schema) {
                schemas.push(schema);
                console.log(`   ✅ Schema backed up for ${table}`);
            }
        }
        await saveBackupData(schemas, 'schemas.json');

        // Backup data
        console.log('\n📊 Backing up table data...');
        const dataBackups = [];
        for (const table of tables) {
            const dataBackup = await backupTableData(table);
            dataBackups.push(dataBackup);
            
            // Save individual table data
            await saveBackupData(dataBackup, `${table}-data.json`);
        }

        // Backup RLS policies
        const rlsPolicies = await backupRLSPolicies();
        await saveBackupData(rlsPolicies, 'rls-policies.json');

        // Backup functions
        const functions = await backupFunctions();
        await saveBackupData(functions, 'functions.json');

        // Backup triggers
        const triggers = await backupTriggers();
        await saveBackupData(triggers, 'triggers.json');

        // Create manifest
        const manifest = await createBackupManifest(tables, schemas, dataBackups, rlsPolicies, functions, triggers);

        // Final summary
        console.log('\n🎉 === DATABASE BACKUP COMPLETE ===');
        console.log(`📁 Backup location: ${backupFolder}`);
        console.log(`📊 Total tables: ${manifest.backupSummary.tables.length}`);
        console.log(`📈 Total records: ${manifest.databaseInfo.totalRecords}`);
        console.log(`🔒 RLS policies: ${manifest.backupSummary.rlsPolicies}`);
        console.log(`⚙️  Functions: ${manifest.backupSummary.functions}`);
        console.log(`🔔 Triggers: ${manifest.backupSummary.triggers}`);

        // Calculate backup size
        const stats = await fs.stat(backupFolder);
        const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`💾 Backup size: ${sizeInMB} MB`);

    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
    }
}

// Run the backup
main();
