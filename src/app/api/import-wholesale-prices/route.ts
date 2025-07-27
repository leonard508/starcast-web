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
    const requiredColumns = ['package_name', 'provider_name', 'wholesale_price']
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
      const wholesalePrice = parseFloat(rowData.wholesale_price)

      if (isNaN(wholesalePrice) || wholesalePrice < 0) {
        results.errors.push(`Row ${i + 2}: Invalid wholesale price for ${packageName}`)
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

        // Update the wholesale price (basePrice)
        await db.package.update({
          where: { id: package_.id },
          data: { basePrice: wholesalePrice }
        })

        // Record the price change
        await db.priceHistory.create({
          data: {
            packageId: package_.id,
            oldPrice: package_.basePrice,
            newPrice: wholesalePrice,
            changedBy: 'wholesale_import',
            reason: 'Wholesale price update via CSV import'
          }
        })

        results.updated++

      } catch (error) {
        results.errors.push(`Row ${i + 2}: Error updating ${packageName} - ${error}`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Wholesale prices updated successfully`,
      results
    })

  } catch (error) {
    console.error('Error importing wholesale prices:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import wholesale prices' },
      { status: 500 }
    )
  }
} 