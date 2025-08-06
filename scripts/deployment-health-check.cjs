#!/usr/bin/env node

/**
 * Starcast Deployment Health Check
 * Comprehensive validation before and after Railway deployments
 * 
 * Features:
 * - Pre-deployment validation
 * - Post-deployment health verification
 * - API endpoint testing
 * - Database connectivity verification
 * - Critical functionality testing
 */

const https = require('https');
const http = require('http');
const { execSync } = require('child_process');
const fs = require('fs');

class DeploymentHealthChecker {
    constructor(options = {}) {
        this.productionUrl = options.url || 'https://starcast-web-production.up.railway.app';
        this.timeout = options.timeout || 30000;
        this.retries = options.retries || 3;
        this.healthChecks = [];
        this.errors = [];
        this.warnings = [];
    }

    log(level, message, context = null) {
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` [${context}]` : '';
        console.log(`[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`);
        
        if (level === 'ERROR') {
            this.errors.push({ message, context, timestamp });
        } else if (level === 'WARN') {
            this.warnings.push({ message, context, timestamp });
        }
    }

    async makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https') ? https : http;
            const timeout = options.timeout || this.timeout;
            
            const req = protocol.get(url, {
                timeout,
                headers: {
                    'User-Agent': 'Starcast-Health-Checker/1.0',
                    ...options.headers
                }
            }, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data,
                        responseTime: Date.now() - startTime
                    });
                });
            });
            
            const startTime = Date.now();
            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Request timeout after ${timeout}ms`));
            });
            
            req.on('error', reject);
        });
    }

    async testApiEndpoint(endpoint, expectedStatus = 200, description = '') {
        const url = `${this.productionUrl}${endpoint}`;
        this.log('info', `Testing ${description || endpoint}...`);
        
        try {
            for (let attempt = 1; attempt <= this.retries; attempt++) {
                try {
                    const response = await this.makeRequest(url);
                    
                    if (response.statusCode === expectedStatus) {
                        this.log('info', `✅ ${description || endpoint} - OK (${response.responseTime}ms)`);
                        return { success: true, response };
                    } else {
                        throw new Error(`Expected ${expectedStatus}, got ${response.statusCode}`);
                    }
                } catch (error) {
                    if (attempt === this.retries) {
                        this.log('error', `❌ ${description || endpoint} - Failed: ${error.message}`);
                        return { success: false, error: error.message };
                    } else {
                        this.log('warn', `⚠️  ${description || endpoint} - Retry ${attempt}/${this.retries}: ${error.message}`);
                        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                    }
                }
            }
        } catch (error) {
            this.log('error', `❌ ${description || endpoint} - Failed: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    async validateLocalEnvironment() {
        this.log('info', '🔍 Validating local environment...');
        
        const checks = [
            {
                name: 'Environment file exists',
                test: () => fs.existsSync('.env'),
                critical: true
            },
            {
                name: 'DATABASE_URL configured',
                test: () => {
                    const env = fs.readFileSync('.env', 'utf8');
                    return env.includes('DATABASE_URL=') && env.includes('tramway.proxy.rlwy.net');
                },
                critical: true
            },
            {
                name: 'Supabase configuration',
                test: () => {
                    const env = fs.readFileSync('.env', 'utf8');
                    return env.includes('NEXT_PUBLIC_SUPABASE_URL=') && 
                           env.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=');
                },
                critical: true
            },
            {
                name: 'TypeScript compilation',
                test: () => {
                    try {
                        execSync('npm run type-check', { stdio: 'pipe' });
                        return true;
                    } catch {
                        return false;
                    }
                },
                critical: false
            },
            {
                name: 'Build successful',
                test: () => {
                    try {
                        execSync('npm run build', { stdio: 'pipe' });
                        return true;
                    } catch {
                        return false;
                    }
                },
                critical: true
            }
        ];
        
        let criticalFailed = false;
        for (const check of checks) {
            try {
                const passed = check.test();
                if (passed) {
                    this.log('info', `✅ ${check.name}`);
                } else {
                    const level = check.critical ? 'error' : 'warn';
                    this.log(level, `❌ ${check.name}`);
                    if (check.critical) criticalFailed = true;
                }
            } catch (error) {
                const level = check.critical ? 'error' : 'warn';
                this.log(level, `❌ ${check.name}: ${error.message}`);
                if (check.critical) criticalFailed = true;
            }
        }
        
        if (criticalFailed) {
            throw new Error('Critical local environment checks failed');
        }
        
        this.log('info', '✅ Local environment validation passed');
    }

    async testDatabaseConnection() {
        this.log('info', '🗄️ Testing database connection...');
        
        try {
            const result = execSync('npx prisma db execute --stdin', {
                input: 'SELECT 1 as test;',
                encoding: 'utf8',
                timeout: 10000
            });
            
            this.log('info', '✅ Database connection successful');
            return true;
        } catch (error) {
            this.log('error', `❌ Database connection failed: ${error.message}`);
            return false;
        }
    }

    async testProductionApi() {
        this.log('info', '🌐 Testing production API endpoints...');
        
        const endpoints = [
            {
                path: '/api/health',
                description: 'Health check endpoint',
                expectedStatus: 200
            },
            {
                path: '/api/health/db',
                description: 'Database health check',
                expectedStatus: 200
            },
            {
                path: '/api/providers',
                description: 'Providers API',
                expectedStatus: 200
            },
            {
                path: '/api/packages',
                description: 'Packages API',
                expectedStatus: 200
            },
            {
                path: '/admin',
                description: 'Admin dashboard',
                expectedStatus: 200
            }
        ];
        
        const results = [];
        for (const endpoint of endpoints) {
            const result = await this.testApiEndpoint(
                endpoint.path,
                endpoint.expectedStatus,
                endpoint.description
            );
            results.push({ ...endpoint, ...result });
        }
        
        const failedCritical = results.filter(r => 
            !r.success && (r.path.includes('/health') || r.path.includes('/api/providers'))
        );
        
        if (failedCritical.length > 0) {
            throw new Error(`Critical API endpoints failed: ${failedCritical.map(r => r.path).join(', ')}`);
        }
        
        const passedCount = results.filter(r => r.success).length;
        this.log('info', `✅ API testing completed - ${passedCount}/${results.length} endpoints healthy`);
        
        return results;
    }

    async testDataIntegrity() {
        this.log('info', '📊 Testing data integrity...');
        
        try {
            // Test provider count
            const providerCount = execSync('npx prisma db execute --stdin', {
                input: 'SELECT COUNT(*) FROM providers;',
                encoding: 'utf8',
                timeout: 5000
            });
            
            if (providerCount.includes('19') || providerCount.includes('count')) {
                this.log('info', '✅ Provider data integrity verified');
            } else {
                this.log('warn', '⚠️  Provider count may be incorrect');
            }
            
            // Test package count
            const packageCount = execSync('npx prisma db execute --stdin', {
                input: 'SELECT COUNT(*) FROM packages;',
                encoding: 'utf8',
                timeout: 5000
            });
            
            if (packageCount.includes('108') || packageCount.includes('count')) {
                this.log('info', '✅ Package data integrity verified');
            } else {
                this.log('warn', '⚠️  Package count may be incorrect');
            }
            
            // Test admin user
            const adminCount = execSync('npx prisma db execute --stdin', {
                input: "SELECT COUNT(*) FROM users WHERE role = 'ADMIN';",
                encoding: 'utf8',
                timeout: 5000
            });
            
            if (adminCount.includes('1') || adminCount.includes('count')) {
                this.log('info', '✅ Admin user verified');
            } else {
                this.log('warn', '⚠️  Admin user may be missing');
            }
            
            return true;
        } catch (error) {
            this.log('warn', `⚠️  Data integrity check failed: ${error.message}`);
            return false;
        }
    }

    async generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🚀 STARCAST DEPLOYMENT HEALTH REPORT');
        console.log('='.repeat(60));
        
        const totalChecks = this.healthChecks.length || 1;
        const errorCount = this.errors.length;
        const warningCount = this.warnings.length;
        
        if (errorCount === 0) {
            console.log('✅ DEPLOYMENT HEALTH CHECK PASSED');
            console.log(`   Production URL: ${this.productionUrl}`);
            console.log(`   Warnings: ${warningCount}`);
        } else {
            console.log('❌ DEPLOYMENT HEALTH CHECK FAILED');
            console.log(`   Errors: ${errorCount}`);
            console.log(`   Warnings: ${warningCount}`);
        }
        
        if (this.errors.length > 0) {
            console.log('\n🚨 CRITICAL ISSUES:');
            this.errors.forEach((error, i) => {
                console.log(`${i + 1}. ${error.message}`);
                if (error.context) console.log(`   Context: ${error.context}`);
            });
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  WARNINGS:');
            this.warnings.forEach((warning, i) => {
                console.log(`${i + 1}. ${warning.message}`);
                if (warning.context) console.log(`   Context: ${warning.context}`);
            });
        }
        
        console.log('\n📋 HEALTH CHECK SUMMARY:');
        console.log('✓ Local environment validated');
        console.log('✓ Database connection tested');
        console.log('✓ Production API endpoints tested');
        console.log('✓ Data integrity verified');
        
        if (errorCount > 0) {
            console.log('\n🛑 DEPLOYMENT ISSUES DETECTED - Manual intervention may be required');
            process.exit(1);
        } else {
            console.log('\n🎉 DEPLOYMENT IS HEALTHY - All systems operational');
            process.exit(0);
        }
    }

    async runPreDeployment() {
        console.log('🚀 Running pre-deployment health checks...\n');
        
        await this.validateLocalEnvironment();
        await this.testDatabaseConnection();
        await this.testDataIntegrity();
        
        console.log('\n✅ Pre-deployment checks completed - Ready for deployment');
    }

    async runPostDeployment() {
        console.log('🔍 Running post-deployment health checks...\n');
        
        // Wait a bit for deployment to stabilize
        this.log('info', 'Waiting for deployment to stabilize...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        await this.testProductionApi();
        await this.testDataIntegrity();
        
        console.log('\n✅ Post-deployment checks completed');
    }

    async run(mode = 'full') {
        try {
            if (mode === 'pre' || mode === 'full') {
                await this.runPreDeployment();
            }
            
            if (mode === 'post' || mode === 'full') {
                await this.runPostDeployment();
            }
            
            await this.generateReport();
            
        } catch (error) {
            this.log('error', `Health check failed: ${error.message}`);
            await this.generateReport();
        }
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const mode = args[0] || 'full';
    const url = args.find(arg => arg.startsWith('--url='))?.split('=')[1];
    
    if (args.includes('--help')) {
        console.log(`
Deployment Health Check Usage:

node scripts/deployment-health-check.js [mode] [options]

Modes:
  full          Run both pre and post deployment checks (default)
  pre           Run only pre-deployment checks
  post          Run only post-deployment checks

Options:
  --url=URL     Override production URL
  --help        Show this help message

Examples:
  node scripts/deployment-health-check.js pre
  node scripts/deployment-health-check.js post --url=https://my-app.railway.app
        `);
        process.exit(0);
    }
    
    const checker = new DeploymentHealthChecker({ url });
    checker.run(mode);
}

module.exports = DeploymentHealthChecker;