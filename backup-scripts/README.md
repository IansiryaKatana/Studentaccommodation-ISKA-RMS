# Complete Backup System for iska-RMS

This directory contains comprehensive backup scripts for both the codebase and database of the iska-RMS project.

## 📁 Backup Scripts Overview

### 1. `final-backup.bat` - Complete Backup Script (Recommended)
- **Purpose**: Creates comprehensive backup of both codebase and database
- **Usage**: Double-click or run from command line
- **Features**: 
  - Complete codebase backup with improved path handling
  - Error handling and reporting
  - Compressed final backup
  - Cleanup of temporary files

### 2. `backup-codebase.ps1` - Codebase Backup Script
- **Purpose**: Backs up all source code, configuration, and documentation
- **Excludes**: `node_modules`, `.git`, `dist`, `.cursor`, `backups`
- **Output**: Compressed ZIP file with timestamp

### 3. `backup-database.js` - Database Backup Script
- **Purpose**: Backs up all Supabase database tables, schemas, and data
- **Requirements**: Node.js and Supabase credentials
- **Output**: JSON files for each table and database objects

## 🚀 Quick Start

### Prerequisites
1. **Node.js** installed (for database backup)
2. **PowerShell** (Windows default)
3. **Supabase credentials** in environment variables:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Running Complete Backup
```bash
# Option 1: Double-click the batch file
backup-all.bat

# Option 2: Run from command line
.\backup-scripts\backup-all.bat
```

### Running Individual Backups
```bash
# Codebase only
powershell -ExecutionPolicy Bypass -File ".\backup-scripts\backup-codebase.ps1"

# Database only
node ".\backup-scripts\backup-database.js"
```

## 📊 What Gets Backed Up

### Codebase Backup Includes:
- ✅ All source code (`src/` directory)
- ✅ Configuration files (`config/`, `package.json`, etc.)
- ✅ Supabase migrations and schema
- ✅ Public assets (`public/` directory)
- ✅ Documentation files (`*.md`)
- ✅ Utility scripts (`*.js`, `*.cjs`)
- ✅ Build configuration files
- ✅ Environment examples

### Database Backup Includes:
- ✅ All table schemas and structures
- ✅ Complete data from all tables
- ✅ RLS (Row Level Security) policies
- ✅ Database functions and triggers
- ✅ Foreign key relationships
- ✅ Indexes and constraints

## 📁 Backup Output Structure

```
backups/
├── iska-RMS-complete-backup-YYYY-MM-DD_HH-MM-SS.zip
│   ├── codebase-backup.zip
│   ├── database-backup/
│   │   ├── backup-manifest.json
│   │   ├── schemas.json
│   │   ├── rls-policies.json
│   │   ├── functions.json
│   │   ├── triggers.json
│   │   ├── [table-name]-data.json (for each table)
│   │   └── ...
│   └── complete-backup-manifest.json
```

## 🔧 Configuration Options

### Environment Variables Required:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Backup Paths:
- **Default**: `./backups/`
- **Codebase**: `./backups/codebase/`
- **Database**: `./backups/database/`
- **Complete**: `./backups/iska-RMS-complete-backup-[timestamp].zip`

## 📋 Backup Manifest Information

Each backup includes a detailed manifest with:
- Project information and timestamp
- File counts and sizes
- Database table summaries
- System information
- Error logs (if any)
- Backup duration

## 🔄 Restore Process

### Codebase Restore:
1. Extract the `codebase-backup.zip`
2. Replace current project files with backup files
3. Run `npm install` to restore dependencies

### Database Restore:
1. Extract the `database-backup/` folder
2. Use Supabase CLI or dashboard to restore:
   ```bash
   # Restore schemas
   supabase db reset
   
   # Restore data (using the JSON files)
   # Import each table data file through Supabase dashboard
   ```

## ⚠️ Important Notes

### Security:
- Backup scripts use service role key for full database access
- Keep backup files secure and encrypted if containing sensitive data
- Consider cloud storage for backup redundancy

### Performance:
- Database backup may take time depending on data size
- Large tables are backed up in batches of 1000 records
- Progress indicators show backup status

### Dependencies:
- Node.js required for database backup
- PowerShell required for codebase backup
- Supabase client library automatically installed

## 🛠️ Troubleshooting

### Common Issues:

1. **Node.js not found**
   - Install Node.js from https://nodejs.org/
   - Ensure it's in your system PATH

2. **Supabase credentials missing**
   - Check environment variables
   - Verify service role key permissions

3. **PowerShell execution policy**
   - Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

4. **Insufficient disk space**
   - Check available space before backup
   - Clean up old backups if needed

### Error Logs:
- Check the backup manifest for detailed error information
- Individual backup scripts provide verbose output
- Database backup errors are logged in the manifest

## 📈 Backup Monitoring

### File Sizes:
- Codebase backups: Typically 10-50 MB
- Database backups: Varies with data size
- Complete backups: Compressed format for efficiency

### Frequency Recommendations:
- **Development**: Before major changes
- **Production**: Daily automated backups
- **Critical updates**: Before deployments

## 🔗 Related Documentation

- [Supabase Backup Guide](https://supabase.com/docs/guides/backups)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Compatibility**: Windows 10+, Node.js 16+, PowerShell 5+
