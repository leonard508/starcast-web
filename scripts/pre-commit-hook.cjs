#!/usr/bin/env node

/**
 * Starcast Pre-Commit Security Hook
 * Automatically runs security checks before git commits
 * 
 * Installation: This hook is called by git before commits
 * Usage: Automatically validates all changes before commit
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running pre-commit security validation...\n');

try {
    // Run security audit
    console.log('📋 Step 1: Running security audit...');
    execSync('node scripts/security-audit.js', { 
        stdio: 'inherit', 
        cwd: process.cwd() 
    });
    
    // Check for sensitive files in staging
    console.log('\n📋 Step 2: Checking staged files...');
    const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    const files = stagedFiles.trim().split('\n').filter(f => f);
    
    const blockedPatterns = [
        /\.env$/,
        /\.env\.local$/,
        /\.env\.production$/,
        /secrets/,
        /private/,
        /credentials/,
        /database-backup\.md$/,
        /RAILWAY\.md$/,
        /local-docs/
    ];
    
    const blockedFiles = files.filter(file => 
        blockedPatterns.some(pattern => pattern.test(file))
    );
    
    if (blockedFiles.length > 0) {
        console.log('❌ BLOCKED: Attempting to commit sensitive files:');
        blockedFiles.forEach(file => console.log(`   - ${file}`));
        console.log('\n🛑 Remove these files from staging before committing.');
        process.exit(1);
    }
    
    // Validate commit message if available
    console.log('📋 Step 3: Validating commit...');
    
    // Check for large files
    const largeFiles = files.filter(file => {
        try {
            const stats = require('fs').statSync(file);
            return stats.size > 1024 * 1024; // 1MB
        } catch {
            return false;
        }
    });
    
    if (largeFiles.length > 0) {
        console.log('⚠️  WARNING: Large files detected:');
        largeFiles.forEach(file => {
            const stats = require('fs').statSync(file);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            console.log(`   - ${file} (${sizeMB}MB)`);
        });
    }
    
    console.log('\n✅ Pre-commit validation passed!');
    console.log('🚀 Ready to commit safely.\n');
    
} catch (error) {
    console.log('\n❌ Pre-commit validation failed!');
    console.log('🛑 Fix the issues above before committing.\n');
    process.exit(1);
}