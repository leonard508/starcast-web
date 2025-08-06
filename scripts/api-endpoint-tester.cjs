#!/usr/bin/env node

/**
 * Starcast API Endpoint Tester
 * Comprehensive testing of all API endpoints
 * 
 * Features:
 * - Tests all REST endpoints
 * - Authentication testing
 * - Data validation
 * - Performance monitoring
 * - Security validation
 */

const https = require('https');
const http = require('http');
const fs = require('fs');

class ApiEndpointTester {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'http://localhost:3003';
        this.timeout = options.timeout || 10000;
        this.verbose = options.verbose || false;
        this.results = [];
        this.authToken = null;
    }

    log(level, message, context = null) {
        if (!this.verbose && level === 'info') return;
        
        const timestamp = new Date().toISOString();
        const contextStr = context ? ` [${context}]` : '';
        console.log(`[${timestamp}] ${level.toUpperCase()}${contextStr}: ${message}`);
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const method = options.method || 'GET';
        
        return new Promise((resolve, reject) => {
            const isHttps = url.startsWith('https');
            const protocol = isHttps ? https : http;
            
            const requestOptions = {
                method,
                timeout: this.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Starcast-API-Tester/1.0',
                    ...options.headers
                }
            };
            
            if (this.authToken) {
                requestOptions.headers['Authorization'] = `Bearer ${this.authToken}`;
            }
            
            const startTime = Date.now();
            const req = protocol.request(url, requestOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    const responseTime = Date.now() - startTime;
                    let parsedData = null;
                    
                    try {
                        parsedData = data ? JSON.parse(data) : null;
                    } catch (e) {
                        // Response is not JSON, keep as string
                        parsedData = data;
                    }
                    
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: parsedData,
                        rawData: data,
                        responseTime
                    });
                });
            });
            
            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Request timeout after ${this.timeout}ms`));
            });
            
            req.on('error', reject);
            
            if (options.body) {
                req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
            }
            
            req.end();
        });
    }

    async testEndpoint(endpoint, options = {}) {
        const {
            method = 'GET',
            expectedStatus = 200,
            description = endpoint,
            body = null,
            headers = {},
            validate = null,
            requireAuth = false
        } = options;
        
        this.log('info', `Testing ${method} ${endpoint}...`, description);
        
        try {
            const requestHeaders = { ...headers };
            if (requireAuth && this.authToken) {
                requestHeaders['Authorization'] = `Bearer ${this.authToken}`;
            }
            
            const response = await this.makeRequest(endpoint, {
                method,
                body,
                headers: requestHeaders
            });
            
            const result = {
                endpoint,
                method,
                description,
                expectedStatus,
                actualStatus: response.statusCode,
                responseTime: response.responseTime,
                success: response.statusCode === expectedStatus,
                response: response.data,
                timestamp: new Date().toISOString()
            };
            
            // Custom validation
            if (validate && result.success) {
                try {
                    const validationResult = validate(response.data, response);
                    result.validationPassed = validationResult === true;
                    if (validationResult !== true) {
                        result.validationError = validationResult;
                        result.success = false;
                    }
                } catch (error) {
                    result.validationPassed = false;
                    result.validationError = error.message;
                    result.success = false;
                }
            }
            
            if (result.success) {
                this.log('info', `✅ ${description} - ${response.statusCode} (${response.responseTime}ms)`);
            } else {
                const errorMsg = result.validationError || `Expected ${expectedStatus}, got ${response.statusCode}`;
                this.log('error', `❌ ${description} - ${errorMsg}`);
            }
            
            this.results.push(result);
            return result;
            
        } catch (error) {
            const result = {
                endpoint,
                method,
                description,
                expectedStatus,
                actualStatus: null,
                responseTime: null,
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
            
            this.log('error', `❌ ${description} - ${error.message}`);
            this.results.push(result);
            return result;
        }
    }

    async testHealthEndpoints() {
        this.log('info', '🏥 Testing health endpoints...');
        
        await this.testEndpoint('/api/health', {
            description: 'Application health check',
            validate: (data) => data && data.status === 'ok'
        });
        
        await this.testEndpoint('/api/health/db', {
            description: 'Database health check',
            validate: (data) => data && data.success === true
        });
    }

    async testPublicEndpoints() {
        this.log('info', '🌐 Testing public API endpoints...');
        
        await this.testEndpoint('/api/providers', {
            description: 'Get all providers',
            validate: (data) => Array.isArray(data) && data.length > 0
        });
        
        await this.testEndpoint('/api/packages', {
            description: 'Get all packages',
            validate: (data) => Array.isArray(data) && data.length > 0
        });
        
        await this.testEndpoint('/api/packages?providerId=test', {
            description: 'Get packages with filter',
            validate: (data) => Array.isArray(data) // May be empty, that's OK
        });
    }

    async testAuthEndpoints() {
        this.log('info', '🔐 Testing authentication endpoints...');
        
        // Test login endpoint (should fail without credentials)
        await this.testEndpoint('/api/auth/sign-in', {
            method: 'POST',
            expectedStatus: 400,
            description: 'Login without credentials (should fail)',
            body: {}
        });
        
        // Test registration endpoint
        await this.testEndpoint('/api/applications', {
            method: 'POST',
            expectedStatus: 400,
            description: 'Create application without data (should fail)',
            body: {}
        });
    }

    async testAdminEndpoints() {
        this.log('info', '👑 Testing admin endpoints...');
        
        // These should require authentication
        await this.testEndpoint('/api/admin/users', {
            expectedStatus: 401,
            description: 'Admin users endpoint (should require auth)',
            requireAuth: false
        });
        
        await this.testEndpoint('/api/admin/applications', {
            expectedStatus: 401,
            description: 'Admin applications endpoint (should require auth)',
            requireAuth: false
        });
    }

    async testMessagingEndpoints() {
        this.log('info', '📨 Testing messaging endpoints...');
        
        await this.testEndpoint('/api/send-email', {
            method: 'POST',
            expectedStatus: 400,
            description: 'Send email without data (should fail)',
            body: {}
        });
        
        await this.testEndpoint('/api/send-whatsapp', {
            method: 'POST',
            expectedStatus: 400,
            description: 'Send WhatsApp without data (should fail)',
            body: {}
        });
    }

    async testErrorHandling() {
        this.log('info', '🚨 Testing error handling...');
        
        await this.testEndpoint('/api/nonexistent', {
            expectedStatus: 404,
            description: 'Non-existent endpoint (should return 404)'
        });
        
        await this.testEndpoint('/api/providers/invalid-id', {
            expectedStatus: 404,
            description: 'Invalid provider ID (should return 404)'
        });
    }

    async testPerformance() {
        this.log('info', '⚡ Testing performance...');
        
        const performanceTests = [
            { endpoint: '/api/providers', maxTime: 1000 },
            { endpoint: '/api/packages', maxTime: 2000 },
            { endpoint: '/api/health', maxTime: 500 }
        ];
        
        for (const test of performanceTests) {
            const result = await this.testEndpoint(test.endpoint, {
                description: `Performance test: ${test.endpoint} (< ${test.maxTime}ms)`,
                validate: (data, response) => {
                    if (response.responseTime > test.maxTime) {
                        return `Response time ${response.responseTime}ms exceeds limit ${test.maxTime}ms`;
                    }
                    return true;
                }
            });
        }
    }

    async testDataValidation() {
        this.log('info', '📊 Testing data validation...');
        
        // Test provider data structure
        const providersResult = await this.testEndpoint('/api/providers', {
            description: 'Providers data structure validation',
            validate: (data) => {
                if (!Array.isArray(data)) return 'Response should be an array';
                if (data.length === 0) return 'Should have at least one provider';
                
                const provider = data[0];
                if (!provider.id) return 'Provider should have id';
                if (!provider.name) return 'Provider should have name';
                if (!provider.slug) return 'Provider should have slug';
                
                return true;
            }
        });
        
        // Test packages data structure
        const packagesResult = await this.testEndpoint('/api/packages', {
            description: 'Packages data structure validation',
            validate: (data) => {
                if (!Array.isArray(data)) return 'Response should be an array';
                if (data.length === 0) return 'Should have at least one package';
                
                const package = data[0];
                if (!package.id) return 'Package should have id';
                if (!package.name) return 'Package should have name';
                if (typeof package.currentPrice !== 'number') return 'Package should have numeric currentPrice';
                if (!package.provider) return 'Package should have provider relationship';
                
                return true;
            }
        });
    }

    async generateReport() {
        const totalTests = this.results.length;
        const passedTests = this.results.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        const avgResponseTime = this.results
            .filter(r => r.responseTime)
            .reduce((sum, r) => sum + r.responseTime, 0) / 
            this.results.filter(r => r.responseTime).length;
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 STARCAST API ENDPOINT TEST REPORT');
        console.log('='.repeat(60));
        console.log(`Base URL: ${this.baseUrl}`);
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
        console.log(`Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
        console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
        
        if (failedTests > 0) {
            console.log('\n❌ FAILED TESTS:');
            this.results.filter(r => !r.success).forEach((result, i) => {
                const error = result.error || result.validationError || `Status ${result.actualStatus}`;
                console.log(`${i + 1}. ${result.description}: ${error}`);
            });
        }
        
        console.log('\n📈 PERFORMANCE SUMMARY:');
        const slowTests = this.results
            .filter(r => r.responseTime && r.responseTime > 1000)
            .sort((a, b) => b.responseTime - a.responseTime);
        
        if (slowTests.length > 0) {
            console.log('⚠️  Slow endpoints (>1000ms):');
            slowTests.forEach(test => {
                console.log(`   ${test.endpoint}: ${test.responseTime}ms`);
            });
        } else {
            console.log('✅ All endpoints respond within acceptable time');
        }
        
        console.log('\n📋 TEST CATEGORIES:');
        console.log('✓ Health endpoints');
        console.log('✓ Public API endpoints');
        console.log('✓ Authentication endpoints');
        console.log('✓ Admin endpoints');
        console.log('✓ Messaging endpoints');
        console.log('✓ Error handling');
        console.log('✓ Performance testing');
        console.log('✓ Data validation');
        
        if (failedTests > 0) {
            console.log('\n🛑 SOME API TESTS FAILED - Review and fix issues');
            process.exit(1);
        } else {
            console.log('\n🎉 ALL API TESTS PASSED - Endpoints are healthy');
            process.exit(0);
        }
    }

    async run() {
        console.log('🧪 Starting Starcast API Endpoint Tests...\n');
        
        try {
            await this.testHealthEndpoints();
            await this.testPublicEndpoints();
            await this.testAuthEndpoints();
            await this.testAdminEndpoints();
            await this.testMessagingEndpoints();
            await this.testErrorHandling();
            await this.testPerformance();
            await this.testDataValidation();
            
            await this.generateReport();
            
        } catch (error) {
            console.log('\n❌ API testing failed:', error.message);
            process.exit(1);
        }
    }
}

// Command line usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const baseUrl = args.find(arg => arg.startsWith('--url='))?.split('=')[1] || 'http://localhost:3003';
    const verbose = args.includes('--verbose');
    
    if (args.includes('--help')) {
        console.log(`
API Endpoint Tester Usage:

node scripts/api-endpoint-tester.js [options]

Options:
  --url=URL       Base URL for API testing (default: http://localhost:3003)
  --verbose       Enable verbose logging
  --help          Show this help message

Examples:
  node scripts/api-endpoint-tester.js
  node scripts/api-endpoint-tester.js --url=https://starcast-web-production.up.railway.app
        `);
        process.exit(0);
    }
    
    const tester = new ApiEndpointTester({ baseUrl, verbose });
    tester.run();
}

module.exports = ApiEndpointTester;