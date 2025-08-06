#!/usr/bin/env node

/**
 * Starcast Security Audit Script
 * Comprehensive security checking before deployments
 * 
 * CRITICAL: This script must pass before any git commits or Railway deployments
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class SecurityAuditor {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passed = true;
        this.sensitivePatterns = [
            // API Keys and Tokens
            /sk-[a-zA-Z0-9]{48}/g, // OpenAI API keys
            /pk_live_[a-zA-Z0-9]{24}/g, // Stripe live keys
            /pk_test_[a-zA-Z0-9]{24}/g, // Stripe test keys
            /xkeysib-[a-f0-9-]{58}/g, // Brevo API keys
            /AC[a-f0-9]{32}/g, // Twilio Account SID
            /[A-Za-z0-9]{32}/g, // Generic 32-char tokens
            
            // Database URLs with credentials
            /postgresql:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/g,
            /mysql:\/\/[^:]+:[^@]+@[^\/]+\/[^\s"']+/g,
            
            // JWT tokens
            /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g,
            
            // IP addresses and ports (in non-config files)
            /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{2,5}\b/g,
            
            // Railway/Supabase URLs with credentials
            /https:\/\/[a-z0-9]+\.supabase\.co/g,
            /https:\/\/[a-z0-9-]+\.up\.railway\.app/g
        ];
        
        this.excludeFiles = [
            'node_modules',
            '.git',
            '.next',
            'dist',
            'build',
            '*.log',
            'security-audit.js',
            'RAILWAY.md', // Contains documented connection strings
            'database-backup.md' // Contains documented data
        ];
    }

    log(level, message, file = null) {
        const timestamp = new Date().toISOString();
        const fileStr = file ? ` [${file}]` : '';
        console.log(`[${timestamp}] ${level.toUpperCase()}${fileStr}: ${message}`);
        
        if (level === 'ERROR') {
            this.errors.push({ message, file, timestamp });
            this.passed = false;
        } else if (level === 'WARN') {
            this.warnings.push({ message, file, timestamp });
        }
    }

    async scanCredentials() {
        this.log('info', '🔍 Scanning for exposed credentials...');
        
        const scanDirectories = [
            'src',
            'app',
            'pages',
            'components',
            'lib',
            'utils',
            'config',
            'docs',
            'scripts',
            '.'
        ];
        
        for (const dir of scanDirectories) {
            if (fs.existsSync(dir)) {
                await this.scanDirectory(dir);
            }
        }
    }

    async scanDirectory(dirPath) {
        const items = fs.readdirSync(dirPath);
        
        for (const item of items) {
            const fullPath = path.join(dirPath, item);
            const stat = fs.statSync(fullPath);
            
            // Skip excluded files/directories
            if (this.excludeFiles.some(exclude => 
                fullPath.includes(exclude) || item.startsWith('.')
            )) {
                continue;
            }
            
            if (stat.isDirectory()) {
                await this.scanDirectory(fullPath);
            } else if (stat.isFile()) {
                await this.scanFile(fullPath);
            }
        }
    }

    async scanFile(filePath) {
        const ext = path.extname(filePath);
        const textExtensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.md', '.txt', '.env', '.yml', '.yaml'];
        
        if (!textExtensions.includes(ext)) return;
        
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for sensitive patterns
            for (const pattern of this.sensitivePatterns) {
                const matches = content.match(pattern);
                if (matches) {
                    // Skip if it's a documented placeholder
                    const isPlaceholder = matches.some(match => 
                        match.includes('your-') || 
                        match.includes('xxx-') ||
                        match.includes('placeholder') ||
                        match.includes('example')
                    );
                    
                    if (!isPlaceholder) {
                        this.log('error', `Potential credential exposure: ${matches[0].substring(0, 20)}...`, filePath);
                    }
                }
            }
            
            // Check for specific dangerous patterns
            if (content.includes('password') && content.includes('=') && !filePath.includes('.md')) {
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    if (line.includes('password') && line.includes('=') && !line.includes('placeholder')) {
                        this.log('warn', `Potential password on line ${index + 1}: ${line.trim()}`, filePath);
                    }
                });
            }
            
        } catch (error) {
            this.log('warn', `Could not read file: ${error.message}`, filePath);
        }
    }

    async validateEnvironment() {
        this.log('info', '🔧 Validating environment configuration...');
        
        const requiredEnvVars = [
            'DATABASE_URL',
            'NEXT_PUBLIC_SUPABASE_URL',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY'
        ];
        
        // Check local .env file
        if (fs.existsSync('.env')) {
            const envContent = fs.readFileSync('.env', 'utf8');
            
            for (const varName of requiredEnvVars) {
                if (!envContent.includes(`${varName}=`)) {
                    this.log('error', `Missing required environment variable: ${varName}`, '.env');
                }
            }
            
            // Check for placeholder values
            if (envContent.includes('your-') || envContent.includes('placeholder')) {
                this.log('warn', 'Environment file contains placeholder values', '.env');
            }
        } else {
            this.log('error', 'No .env file found', null);
        }
    }

    async validateDatabase() {
        this.log('info', '🗄️ Validating database connection...');
        
        try {
            // Check if DATABASE_URL is properly formatted
            const envContent = fs.readFileSync('.env', 'utf8');
            const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
            
            if (dbUrlMatch) {
                const dbUrl = dbUrlMatch[1];
                
                // Validate Railway PostgreSQL format
                if (!dbUrl.includes('tramway.proxy.rlwy.net:43088')) {
                    this.log('warn', 'Database URL does not use Railway proxy (may cause connection issues)', '.env');
                }
                
                // Validate it's PostgreSQL
                if (!dbUrl.startsWith('postgresql://')) {
                    this.log('error', 'Database URL must use PostgreSQL protocol', '.env');
                }
                
            } else {
                this.log('error', 'No DATABASE_URL found in environment', '.env');
            }
            
        } catch (error) {
            this.log('error', `Database validation failed: ${error.message}`, null);
        }
    }

    async validateCodeQuality() {
        this.log('info', '✨ Running code quality checks...');
        
        try {
            // TypeScript check
            execSync('npm run type-check', { stdio: 'pipe' });
            this.log('info', '✅ TypeScript validation passed');
        } catch (error) {
            this.log('error', 'TypeScript validation failed', 'npm run type-check');
        }
        
        try {
            // ESLint check
            execSync('npm run lint:check', { stdio: 'pipe' });
            this.log('info', '✅ ESLint validation passed');
        } catch (error) {
            this.log('warn', 'ESLint found issues (non-blocking)', 'npm run lint:check');
        }
        
        try {
            // Build check
            execSync('npm run build', { stdio: 'pipe' });
            this.log('info', '✅ Build validation passed');
        } catch (error) {
            this.log('error', 'Build validation failed', 'npm run build');
        }
    }

    async validateApiSecurity() {
        this.log('info', '🔒 Validating API security...');
        
        const apiDir = 'src/app/api';
        if (fs.existsSync(apiDir)) {
            await this.scanApiDirectory(apiDir);
        }
    }

    async scanApiDirectory(apiPath) {
        const items = fs.readdirSync(apiPath);
        
        for (const item of items) {
            const fullPath = path.join(apiPath, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                await this.scanApiDirectory(fullPath);
            } else if (item === 'route.ts' || item === 'route.js') {
                await this.validateApiRoute(fullPath);
            }
        }
    }

    async validateApiRoute(routePath) {
        try {
            const content = fs.readFileSync(routePath, 'utf8');
            
            // Check for authentication
            if (!content.includes('auth') && !content.includes('session') && !content.includes('authorization')) {
                // Skip public endpoints
                if (!routePath.includes('/health/') && !routePath.includes('/public/')) {
                    this.log('warn', 'API route may lack authentication', routePath);
                }
            }
            
            // Check for input validation
            if (content.includes('request.json()') && !content.includes('validate') && !content.includes('schema')) {
                this.log('warn', 'API route may lack input validation', routePath);
            }
            
            // Check for SQL injection prevention
            if (content.includes('$queryRaw') && content.includes('${')) {
                this.log('error', 'Potential SQL injection vulnerability', routePath);
            }
            
            // Check for error exposure
            if (content.includes('console.log') || content.includes('console.error')) {
                this.log('warn', 'API route contains console logging (may expose sensitive data)', routePath);
            }
            
        } catch (error) {
            this.log('warn', `Could not validate API route: ${error.message}`, routePath);
        }
    }

    async generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🛡️  STARCAST SECURITY AUDIT REPORT');
        console.log('='.repeat(60));
        
        if (this.passed && this.errors.length === 0) {
            console.log('✅ SECURITY AUDIT PASSED');
            console.log(`   Warnings: ${this.warnings.length}`);
        } else {
            console.log('❌ SECURITY AUDIT FAILED');
            console.log(`   Errors: ${this.errors.length}`);
            console.log(`   Warnings: ${this.warnings.length}`);
        }
        
        if (this.errors.length > 0) {
            console.log('\n🚨 CRITICAL SECURITY ISSUES:');
            this.errors.forEach((error, i) => {
                console.log(`${i + 1}. ${error.message}`);
                if (error.file) console.log(`   File: ${error.file}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  SECURITY WARNINGS:');
            this.warnings.forEach((warning, i) => {
                console.log(`${i + 1}. ${warning.message}`);
                if (warning.file) console.log(`   File: ${warning.file}`);
            });
        }
        
        console.log('\n📋 SECURITY CHECKLIST:');
        console.log('✓ Credential scanning completed');
        console.log('✓ Environment validation completed');
        console.log('✓ Database configuration validated');
        console.log('✓ Code quality checks completed');
        console.log('✓ API security validation completed');
        
        if (!this.passed) {
            console.log('\n🛑 DEPLOYMENT BLOCKED - Fix security issues before proceeding');
            process.exit(1);
        } else {
            console.log('\n🚀 READY FOR DEPLOYMENT');
            process.exit(0);
        }
    }

    async run() {
        console.log('🛡️  Starting Starcast Security Audit...\n');
        
        await this.scanCredentials();
        await this.validateEnvironment();
        await this.validateDatabase();
        await this.validateCodeQuality();
        await this.validateApiSecurity();
        await this.generateReport();
    }
}

// Run the audit
if (require.main === module) {
    const auditor = new SecurityAuditor();
    auditor.run().catch(error => {
        console.error('Security audit failed:', error);
        process.exit(1);
    });
}

module.exports = SecurityAuditor;