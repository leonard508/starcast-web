import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import * as ExcelJS from 'exceljs'
import { requireAdmin, rateLimit, securityHeaders, corsHeaders } from '@/lib/auth/middleware'
import { importExcelSchema } from '@/lib/validation/schemas'

export async function POST(request: NextRequest) {
  try {
    // Add security headers
    const headers = {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    };

    // Strict rate limiting for imports - only 2 per hour
    const rateLimitResult = rateLimit(2, 3600000, (req) => `admin_import_${req.headers.get('x-forwarded-for') || 'unknown'}`)(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Require admin authentication
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
    const { user } = authResult;

    const body = await request.json()
    const validatedBody = importExcelSchema.parse(body)
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (validatedBody.data.length > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400, headers }
      );
    }

    // Decode base64 Excel data with error handling
    let excelBuffer: Buffer;
    try {
      excelBuffer = Buffer.from(validatedBody.data, 'base64');
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format' },
        { status: 400, headers }
      );
    }
    
    // Read Excel file
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(excelBuffer as any)
    const sheetNames = workbook.worksheets.map(ws => ws.name)
    
    console.log('📋 Available sheets:', sheetNames)
    
    // Use specified sheet or find the most relevant one
    const targetSheetName = validatedBody.sheetName || 
      sheetNames.find(name => 
        name.toLowerCase().includes('pricing') || 
        name.toLowerCase().includes('fibre') ||
        name.toLowerCase().includes('packages')
      ) || sheetNames[0]
    
    const worksheet = workbook.getWorksheet(targetSheetName)
    if (!worksheet) {
      return NextResponse.json(
        { error: `Sheet '${targetSheetName}' not found` },
        { status: 400, headers }
      )
    }
    
    const jsonData: any[] = []
    const headerRow = worksheet.getRow(1)
    const excelHeaders: string[] = []
    
    headerRow.eachCell((cell, colNumber) => {
      excelHeaders[colNumber] = cell.value?.toString() || ''
    })
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        const rowData: any = {}
        row.eachCell((cell, colNumber) => {
          if (excelHeaders[colNumber]) {
            rowData[excelHeaders[colNumber]] = cell.value
          }
        })
        jsonData.push(rowData)
      }
    })
    
    console.log(`📊 Processing sheet: ${targetSheetName}`)
    console.log(`📈 Found ${jsonData.length} rows`)
    
    if (jsonData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No data found in the specified sheet'
      }, { status: 400 })
    }
    
    // Log sample data structure
    console.log('📋 Sample data structure:', JSON.stringify(jsonData[0], null, 2))
    
    const results = {
      providersCreated: 0,
      packagesCreated: 0,
      packagesUpdated: 0,
      errors: [] as string[]
    }
    
    // Process each row
    for (const row of jsonData as any[]) {
      try {
        // Extract data based on actual Excel structure
        const provider = row.Provider
        const productName = row['Fibre Product Name']
        const downloadSpeed = row['Download Speed'] || row.Speed
        // const uploadSpeed = row['Upload Speed']
        const wholesalePrice = row['Wholesale Price']
        const retailPrice = row['Retail Price']
        const terms = row.Terms
        
        // Skip invalid rows
        if (!provider || !productName || !retailPrice) {
          continue
        }
        
        // Parse price - use retail price as primary, wholesale as fallback
        const numericPrice = typeof retailPrice === 'string' ? 
          parseFloat(retailPrice.replace(/[^\d.]/g, '')) : 
          parseFloat(retailPrice) || parseFloat(wholesalePrice) || 0
        
        if (isNaN(numericPrice) || numericPrice <= 0) {
          results.errors.push(`Invalid price for ${provider} ${productName}: ${retailPrice}`)
          continue
        }
        
        // Find or create provider
        const providerSlug = provider.toLowerCase().replace(/\s+/g, '-')
        let providerRecord = await db.provider.findUnique({
          where: { slug: providerSlug }
        })
        
        if (!providerRecord) {
          providerRecord = await db.provider.create({
            data: {
              name: provider,
              slug: providerSlug,
              active: true
            }
          })
          results.providersCreated++
        }
        
        // Create package ID
        const speedText = downloadSpeed || productName.replace(/[^a-zA-Z0-9]/g, '')
        const packageId = `${providerSlug}_${speedText}`
        
        // Create or update package
        const packageData = await db.package.upsert({
          where: { id: packageId },
          update: {
            currentPrice: numericPrice,
            updatedAt: new Date()
          },
          create: {
            id: packageId,
            name: productName,
            providerId: providerRecord.id,
            type: 'FIBRE',
            speed: downloadSpeed || productName,
            data: 'Unlimited',
            aup: terms || null,
            throttle: null,
            basePrice: numericPrice,
            currentPrice: numericPrice,
            active: true
          }
        })
        
        if (packageData.createdAt.getTime() === packageData.updatedAt.getTime()) {
          results.packagesCreated++
        } else {
          results.packagesUpdated++
        }
        
        // Create price history entry for new packages
        const existingHistory = await db.priceHistory.findFirst({
          where: { packageId: packageData.id }
        })
        
        if (!existingHistory) {
          await db.priceHistory.create({
            data: {
              packageId: packageData.id,
              oldPrice: 0,
              newPrice: numericPrice,
              changedBy: user.id, // Use authenticated admin ID
              reason: `Excel import by ${user.email} - ${validatedBody.filename || 'unknown file'}`
            }
          })
        }
        
      } catch (error) {
        const errorMsg = `Error processing row: ${JSON.stringify(row)} - ${error instanceof Error ? error.message : 'Unknown error'}`
        results.errors.push(errorMsg)
        console.error(errorMsg)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Excel data imported successfully',
      results: {
        ...results,
        totalProcessed: jsonData.length,
        sheetName: targetSheetName,
        importedBy: user.email,
        importedAt: new Date().toISOString()
      }
    }, { headers })
    
  } catch (error) {
    console.error('Error importing Excel data:', error)
    
    // Don't expose internal error details
    const errorMessage = error instanceof Error && error.message.includes('validation') 
      ? error.message 
      : 'Failed to import Excel data';
      
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { 
      status: error instanceof Error && error.message.includes('validation') ? 400 : 500,
      headers: {
        ...securityHeaders(),
        ...corsHeaders()
      }
    })
  }
}

export async function GET(request: NextRequest) {
  // Require admin authentication even for GET
  const authResult = await requireAdmin(request);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  return NextResponse.json({
    success: true,
    message: 'Excel import endpoint is ready',
    usage: {
      method: 'POST',
      authentication: 'Admin role required',
      rateLimit: '2 requests per hour',
      maxFileSize: '10MB',
      body: {
        data: 'Base64 encoded Excel file content',
        filename: 'Optional filename',
        sheetName: 'Optional specific sheet name'
      }
    }
  }, {
    headers: {
      ...securityHeaders(),
      ...corsHeaders(request.headers.get('origin') || undefined)
    }
  })
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...corsHeaders(request.headers.get('origin') || undefined),
      ...securityHeaders()
    }
  });
} 