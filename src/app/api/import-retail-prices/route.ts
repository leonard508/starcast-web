import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read the file content
    const fileContent = await file.text()
    const lines = fileContent.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: 'File must contain at least a header and one data row' },
        { status: 400 }
      )
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const dataRows = lines.slice(1)

    // Validate required columns
    const requiredColumns = ['package_name', 'provider_name', 'retail_price']
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required columns: ${missingColumns.join(', ')}` 
        },
        { status: 400 }
      )
    }

    const results = {
      updated: 0,
      errors: [] as string[],
      notFound: [] as string[]
    }

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i]
      const values = row.split(',').map(v => v.trim())
      
      if (values.length !== headers.length) {
        results.errors.push(`Row ${i + 2}: Column count mismatch`)
        continue
      }

      const rowData = headers.reduce((obj, header, index) => {
        obj[header] = values[index]
        return obj
      }, {} as Record<string, string>)

      const packageName = rowData.package_name
      const providerName = rowData.provider_name
      const retailPrice = parseFloat(rowData.retail_price)

      if (isNaN(retailPrice) || retailPrice < 0) {
        results.errors.push(`Row ${i + 2}: Invalid retail price for ${packageName}`)
        continue
      }

      try {
        // Find the package by name and provider
        const package_ = await db.package.findFirst({
          where: {
            name: {
              contains: packageName
            },
            provider: {
              name: {
                contains: providerName
              }
            }
          },
          include: {
            provider: true
          }
        })

        if (!package_) {
          results.notFound.push(`${packageName} (${providerName})`)
          continue
        }

        // Update the retail price (currentPrice)
        await db.package.update({
          where: { id: package_.id },
          data: { currentPrice: retailPrice }
        })

        // Record the price change
        await db.priceHistory.create({
          data: {
            packageId: package_.id,
            oldPrice: package_.currentPrice,
            newPrice: retailPrice,
            changedBy: 'retail_import',
            reason: 'Retail price update via CSV import'
          }
        })

        results.updated++

      } catch (error) {
        results.errors.push(`Row ${i + 2}: Error updating ${packageName} - ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Retail prices updated successfully`,
      results
    })

  } catch (error) {
    console.error('Error importing retail prices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import retail prices' },
      { status: 500 }
    )
  }
} 