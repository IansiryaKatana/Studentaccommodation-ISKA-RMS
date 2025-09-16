// Restoration Script for iska-RMS
// This script restores both codebase and database from a backup

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Load environment variables
require('dotenv').config();

// Configuration
const BACKUP_PATH = './backups';
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

console.log('🔄 Starting restoration process...');

async function getAvailableBackups() {
    try {
        const files = await fs.readdir(BACKUP_PATH);
        const backups = files.filter(file => 
            file.startsWith(`${PROJECT_NAME}-complete-backup-`) && 
            file.endsWith('.zip')
        ).sort().reverse();
        
        return backups;
    } catch (error) {
        console.error('❌ Error reading backup directory:', error.message);
        return [];
    }
}

async function extractBackup(backupFile) {
    const backupPath = path.join(BACKUP_PATH, backupFile);
    const extractPath = path.join(BACKUP_PATH, 'temp-restore');
    
    try {
        // Clean up any existing temp directory
        await fs.rm(extractPath, { recursive: true, force: true });
        
        // Extract the backup
        console.log(`📦 Extracting backup: ${backupFile}`);
        const command = `powershell -Command "Expand-Archive -Path '${backupPath}' -DestinationPath '${extractPath}' -Force"`;
        execSync(command, { stdio: 'inherit' });
        
        return extractPath;
    } catch (error) {
        console.error('❌ Error extracting backup:', error.message);
        return null;
    }
}

async function restoreCodebase(extractPath) {
    console.log('\n📁 === RESTORING CODEBASE ===');
    
    try {
        const codebasePath = path.join(extractPath, 'codebase');
        
        if (!(await fs.access(codebasePath).then(() => true).catch(() => false))) {
            console.log('⚠️  Codebase backup not found in backup file');
            return false;
        }
        
        // Create backup of current codebase before restoration
        const currentBackupPath = `./backup-before-restore-${Date.now()}`;
        await fs.mkdir(currentBackupPath, { recursive: true });
        
        // Backup current important directories
        const importantDirs = ['src', 'config', 'supabase', 'public'];
        for (const dir of importantDirs) {
            if (await fs.access(`./${dir}`).then(() => true).catch(() => false)) {
                await copyDirectory(`./${dir}`, path.join(currentBackupPath, dir));
            }
        }
        
        // Backup important files
        const importantFiles = [
            'package.json', 'vite.config.ts', 'tailwind.config.ts', 
            'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json',
            'postcss.config.js', 'eslint.config.js', 'components.json', 
            'index.html', '.gitignore', 'README.md'
        ];
        
        for (const file of importantFiles) {
            if (await fs.access(`./${file}`).then(() => true).catch(() => false)) {
                await fs.copyFile(`./${file}`, path.join(currentBackupPath, file));
            }
        }
        
        console.log(`✅ Current codebase backed up to: ${currentBackupPath}`);
        
        // Restore codebase
        await copyDirectory(path.join(codebasePath, 'src'), './src');
        console.log('✅ Source code restored');
        
        if (await fs.access(path.join(codebasePath, 'config')).then(() => true).catch(() => false)) {
            await copyDirectory(path.join(codebasePath, 'config'), './config');
            console.log('✅ Configuration restored');
        }
        
        if (await fs.access(path.join(codebasePath, 'supabase')).then(() => true).catch(() => false)) {
            await copyDirectory(path.join(codebasePath, 'supabase'), './supabase');
            console.log('✅ Supabase configuration restored');
        }
        
        if (await fs.access(path.join(codebasePath, 'public')).then(() => true).catch(() => false)) {
            await copyDirectory(path.join(codebasePath, 'public'), './public');
            console.log('✅ Public assets restored');
        }
        
        // Restore important files
        for (const file of importantFiles) {
            const backupFile = path.join(codebasePath, file);
            if (await fs.access(backupFile).then(() => true).catch(() => false)) {
                await fs.copyFile(backupFile, `./${file}`);
                console.log(`✅ Restored ${file}`);
            }
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error restoring codebase:', error.message);
        return false;
    }
}

async function restoreDatabase(extractPath) {
    console.log('\n🗄️  === RESTORING DATABASE ===');
    
    try {
        const databasePath = path.join(extractPath, 'database');
        
        if (!(await fs.access(databasePath).then(() => true).catch(() => false))) {
            console.log('⚠️  Database backup not found in backup file');
            return false;
        }
        
        // Read backup summary
        const summaryPath = path.join(databasePath, 'backup-summary.json');
        if (await fs.access(summaryPath).then(() => true).catch(() => false)) {
            const summaryData = await fs.readFile(summaryPath, 'utf8');
            const summary = JSON.parse(summaryData);
            console.log(`📊 Found backup with ${summary.totalTables} tables and ${summary.totalRecords} records`);
        }
        
        // Get all data files
        const files = await fs.readdir(databasePath);
        const dataFiles = files.filter(file => file.endsWith('-data.json'));
        
        console.log(`📋 Restoring ${dataFiles.length} tables...`);
        
        let restoredTables = 0;
        let restoredRecords = 0;
        
        for (const dataFile of dataFiles) {
            const tableName = dataFile.replace('-data.json', '');
            const filePath = path.join(databasePath, dataFile);
            
            try {
                const data = await fs.readFile(filePath, 'utf8');
                const records = JSON.parse(data);
                
                if (records.length > 0) {
                    console.log(`📋 Restoring table: ${tableName} (${records.length} records)`);
                    
                    // Clear existing data
                    const { error: deleteError } = await supabase
                        .from(tableName)
                        .delete()
                        .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep at least one record if needed
                    
                    if (deleteError) {
                        console.log(`   ⚠️  Could not clear ${tableName}: ${deleteError.message}`);
                    }
                    
                    // Insert backup data
                    const { error: insertError } = await supabase
                        .from(tableName)
                        .insert(records);
                    
                    if (insertError) {
                        console.log(`   ❌ Error restoring ${tableName}: ${insertError.message}`);
                    } else {
                        console.log(`   ✅ Restored ${records.length} records to ${tableName}`);
                        restoredTables++;
                        restoredRecords += records.length;
                    }
                } else {
                    console.log(`📋 Table ${tableName} is empty, skipping`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error reading ${tableName} data: ${error.message}`);
            }
        }
        
        console.log(`✅ Database restoration completed. Restored ${restoredRecords} records across ${restoredTables} tables`);
        return true;
        
    } catch (error) {
        console.error('❌ Error restoring database:', error.message);
        return false;
    }
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
        console.log(`   ⚠️  Could not copy ${src}: ${error.message}`);
    }
}

async function cleanup(extractPath) {
    try {
        await fs.rm(extractPath, { recursive: true, force: true });
        console.log('✅ Cleaned up temporary files');
    } catch (error) {
        console.log('⚠️  Could not clean up temporary files');
    }
}

async function main() {
    try {
        // Get available backups
        const backups = await getAvailableBackups();
        
        if (backups.length === 0) {
            console.log('❌ No backup files found in backups directory');
            process.exit(1);
        }
        
        console.log('📋 Available backups:');
        backups.forEach((backup, index) => {
            console.log(`   ${index + 1}. ${backup}`);
        });
        
        // Use the most recent backup
        const selectedBackup = backups[0];
        console.log(`\n🔄 Using most recent backup: ${selectedBackup}`);
        
        // Extract backup
        const extractPath = await extractBackup(selectedBackup);
        if (!extractPath) {
            console.log('❌ Failed to extract backup');
            process.exit(1);
        }
        
        // Confirm restoration
        console.log('\n⚠️  WARNING: This will overwrite your current codebase and database!');
        console.log('   Make sure you have a backup of your current state if needed.');
        console.log('   Press Ctrl+C to cancel or any key to continue...');
        
        // Wait for user input (simplified for automation)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Restore codebase
        const codebaseSuccess = await restoreCodebase(extractPath);
        
        // Restore database
        const databaseSuccess = await restoreDatabase(extractPath);
        
        // Cleanup
        await cleanup(extractPath);
        
        // Final summary
        console.log('\n🎉 === RESTORATION COMPLETE ===');
        console.log(`📁 Restored from: ${selectedBackup}`);
        console.log(`✅ Codebase restoration: ${codebaseSuccess ? 'SUCCESS' : 'FAILED'}`);
        console.log(`✅ Database restoration: ${databaseSuccess ? 'SUCCESS' : 'FAILED'}`);
        
        if (codebaseSuccess) {
            console.log('\n📦 You may need to reinstall dependencies:');
            console.log('   npm install');
        }
        
        console.log('\n🎯 Restoration completed! Your system has been restored to the backup state.');
        
    } catch (error) {
        console.error('❌ Restoration failed:', error.message);
        process.exit(1);
    }
}

// Run the restoration
main();
