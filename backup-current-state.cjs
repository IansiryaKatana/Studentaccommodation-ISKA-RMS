// Comprehensive Backup Script for iska-RMS Current State
// This script creates a complete backup of both codebase and database

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables
require('dotenv').config();

// Configuration
const BACKUP_PATH = './backups';
const PROJECT_NAME = 'iska-RMS';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                 new Date().toTimeString().split(' ')[0].replace(/:/g, '-');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Starting comprehensive backup of iska-RMS...');
console.log(`📅 Backup timestamp: ${timestamp}`);

async function createBackupDirectories() {
    const backupFolder = path.join(BACKUP_PATH, `${PROJECT_NAME}-complete-backup-${timestamp}`);
    const codebaseFolder = path.join(backupFolder, 'codebase');
    const databaseFolder = path.join(backupFolder, 'database');
    
    try {
        await fs.mkdir(backupFolder, { recursive: true });
        await fs.mkdir(codebaseFolder, { recursive: true });
        await fs.mkdir(databaseFolder, { recursive: true });
        console.log('✅ Created backup directories');
        return { backupFolder, codebaseFolder, databaseFolder };
    } catch (error) {
        console.error('❌ Error creating backup directories:', error.message);
        process.exit(1);
    }
}

async function backupCodebase(codebaseFolder) {
    console.log('\n📁 === BACKING UP CODEBASE ===');
    
    try {
        // Copy source code
        await copyDirectory('./src', path.join(codebaseFolder, 'src'));
        console.log('✅ Source code backed up');
        
        // Copy configuration files
        await copyDirectory('./config', path.join(codebaseFolder, 'config'));
        console.log('✅ Configuration backed up');
        
        // Copy Supabase configuration
        await copyDirectory('./supabase', path.join(codebaseFolder, 'supabase'));
        console.log('✅ Supabase configuration backed up');
        
        // Copy public assets
        await copyDirectory('./public', path.join(codebaseFolder, 'public'));
        console.log('✅ Public assets backed up');
        
        // Copy important individual files
        const importantFiles = [
            'package.json', 'package-lock.json', 'bun.lockb', 'vite.config.ts',
            'tailwind.config.ts', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json',
            'postcss.config.js', 'eslint.config.js', 'components.json', 'index.html',
            '.gitignore', 'README.md', 'env.example', 'env.sample', '.env'
        ];
        
        for (const file of importantFiles) {
            if (await fileExists(`./${file}`)) {
                await fs.copyFile(`./${file}`, path.join(codebaseFolder, file));
                console.log(`✅ Backed up ${file}`);
            }
        }
        
        // Copy documentation files
        const docFiles = await findFiles('./', '*.md', ['node_modules', '.git', 'backups', '.cursor']);
        for (const docFile of docFiles) {
            const relativePath = path.relative('./', docFile);
            const backupPath = path.join(codebaseFolder, relativePath);
            await fs.mkdir(path.dirname(backupPath), { recursive: true });
            await fs.copyFile(docFile, backupPath);
        }
        console.log(`✅ Backed up ${docFiles.length} documentation files`);
        
        // Copy utility scripts
        const scriptFiles = await findFiles('./', '*.js', ['node_modules', '.git', 'backups', '.cursor']);
        for (const scriptFile of scriptFiles) {
            const relativePath = path.relative('./', scriptFile);
            const backupPath = path.join(codebaseFolder, relativePath);
            await fs.mkdir(path.dirname(backupPath), { recursive: true });
            await fs.copyFile(scriptFile, backupPath);
        }
        console.log(`✅ Backed up ${scriptFiles.length} script files`);
        
        return true;
    } catch (error) {
        console.error('❌ Error backing up codebase:', error.message);
        return false;
    }
}

async function backupDatabase(databaseFolder) {
    console.log('\n🗄️  === BACKING UP DATABASE ===');
    
    try {
        // Get all tables using a more reliable query
        const { data: tables, error: tablesError } = await supabase
            .from('pg_tables')
            .select('tablename')
            .eq('schemaname', 'public');
            
        if (tablesError) {
            console.log('⚠️  Could not get tables list, trying alternative method...');
            // Fallback: try to get tables from information_schema
            const { data: altTables, error: altError } = await supabase
                .rpc('get_all_tables');
                
            if (altError) {
                console.log('⚠️  Could not get tables, proceeding with known tables...');
                // Use known tables from migrations
                const knownTables = [
                    'users', 'profiles', 'students', 'studios', 'reservations', 
                    'tourists', 'tourist_bookings', 'leads', 'lead_sources', 'lead_statuses',
                    'cleaning_tasks', 'cleaning_schedules', 'cleaners', 'maintenance_requests',
                    'invoices', 'payments', 'payment_plans', 'installment_plans',
                    'student_agreements', 'system_preferences', 'branding_settings',
                    'refund_reasons', 'durations', 'room_grades', 'pricing_matrix',
                    'lead_option_fields', 'student_option_fields', 'module_styles'
                ];
                
                await backupKnownTables(knownTables, databaseFolder);
                return true;
            } else {
                await backupKnownTables(altTables.map(t => t.table_name), databaseFolder);
                return true;
            }
        } else {
            await backupKnownTables(tables.map(t => t.tablename), databaseFolder);
            return true;
        }
    } catch (error) {
        console.error('❌ Error backing up database:', error.message);
        return false;
    }
}

async function backupKnownTables(tables, databaseFolder) {
    console.log(`📊 Found ${tables.length} tables to backup`);
    
    const backupResults = [];
    
    for (const table of tables) {
        try {
            console.log(`📋 Backing up table: ${table}`);
            
            // Get table data
            const { data, error } = await supabase
                .from(table)
                .select('*');
                
            if (error) {
                console.log(`   ⚠️  Error backing up ${table}: ${error.message}`);
                backupResults.push({ table, data: [], count: 0, error: error.message });
                continue;
            }
            
            const count = data ? data.length : 0;
            console.log(`   ✅ Backed up ${count} records from ${table}`);
            
            // Save table data
            await fs.writeFile(
                path.join(databaseFolder, `${table}-data.json`),
                JSON.stringify(data || [], null, 2)
            );
            
            backupResults.push({ table, data: data || [], count });
            
        } catch (error) {
            console.log(`   ❌ Error backing up ${table}: ${error.message}`);
            backupResults.push({ table, data: [], count: 0, error: error.message });
        }
    }
    
    // Save backup summary
    await fs.writeFile(
        path.join(databaseFolder, 'backup-summary.json'),
        JSON.stringify({
            timestamp,
            totalTables: tables.length,
            backupResults,
            totalRecords: backupResults.reduce((sum, r) => sum + r.count, 0)
        }, null, 2)
    );
    
    console.log(`✅ Database backup completed. Total records: ${backupResults.reduce((sum, r) => sum + r.count, 0)}`);
}

async function copyDirectory(src, dest) {
    try {
        await fs.mkdir(dest, { recursive: true });
        const entries = await fs.readdir(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                await copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    } catch (error) {
        // Directory might not exist, that's okay
        console.log(`   ⚠️  Could not copy ${src}: ${error.message}`);
    }
}

async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function findFiles(dir, pattern, excludeDirs = []) {
    const files = [];
    
    async function scanDirectory(currentDir) {
        try {
            const entries = await fs.readdir(currentDir, { withFileTypes: true });
            
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);
                
                if (entry.isDirectory()) {
                    if (!excludeDirs.includes(entry.name)) {
                        await scanDirectory(fullPath);
                    }
                } else if (entry.name.match(pattern)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory might not exist or be accessible
        }
    }
    
    await scanDirectory(dir);
    return files;
}

async function createBackupManifest(backupFolder, codebaseSuccess, databaseSuccess) {
    const manifest = {
        projectName: PROJECT_NAME,
        backupTimestamp: timestamp,
        backupLocation: backupFolder,
        backupResults: {
            codebase: codebaseSuccess,
            database: databaseSuccess
        },
        systemInfo: {
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            backupDate: new Date().toISOString()
        }
    };
    
    await fs.writeFile(
        path.join(backupFolder, 'backup-manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
    
    console.log('✅ Created backup manifest');
    return manifest;
}

async function createCompressedBackup(backupFolder) {
    console.log('\n🗜️  Creating compressed backup...');
    
    try {
        const compressedPath = `${backupFolder}.zip`;
        
        // Use PowerShell to create zip (more reliable on Windows)
        const command = `powershell -Command "Compress-Archive -Path '${backupFolder}' -DestinationPath '${compressedPath}' -Force"`;
        execSync(command, { stdio: 'inherit' });
        
        console.log(`✅ Compressed backup created: ${compressedPath}`);
        
        // Clean up uncompressed folder
        await fs.rm(backupFolder, { recursive: true, force: true });
        console.log('✅ Cleaned up uncompressed backup folder');
        
        return compressedPath;
    } catch (error) {
        console.log('⚠️  Could not create compressed backup, keeping uncompressed version');
        return backupFolder;
    }
}

async function main() {
    try {
        // Create backup directories
        const { backupFolder, codebaseFolder, databaseFolder } = await createBackupDirectories();
        
        // Backup codebase
        const codebaseSuccess = await backupCodebase(codebaseFolder);
        
        // Backup database
        const databaseSuccess = await backupDatabase(databaseFolder);
        
        // Create manifest
        const manifest = await createBackupManifest(backupFolder, codebaseSuccess, databaseSuccess);
        
        // Create compressed backup
        const finalBackupPath = await createCompressedBackup(backupFolder);
        
        // Final summary
        console.log('\n🎉 === BACKUP COMPLETE ===');
        console.log(`📁 Final backup location: ${finalBackupPath}`);
        console.log(`📅 Backup timestamp: ${timestamp}`);
        console.log(`✅ Codebase backup: ${codebaseSuccess ? 'SUCCESS' : 'FAILED'}`);
        console.log(`✅ Database backup: ${databaseSuccess ? 'SUCCESS' : 'FAILED'}`);
        
        // Calculate backup size
        try {
            const stats = await fs.stat(finalBackupPath);
            const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`💾 Backup size: ${sizeInMB} MB`);
        } catch (error) {
            console.log('⚠️  Could not calculate backup size');
        }
        
        console.log('\n🎯 Your complete backup is ready!');
        console.log('📋 You can restore both codebase and database to this state using the backup files.');
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        process.exit(1);
    }
}

// Run the backup
main();
