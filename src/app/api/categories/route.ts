import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const featured = searchParams.get('featured') === 'true'

    // Build query parameters for Payload REST API
    const params = new URLSearchParams({
      sort: 'sort_order',
      depth: '1',
    })

    let where: any = {
      is_active: {
        equals: true,
      },
    }

    if (featured) {
      where.is_featured = {
        equals: true,
      }
    }

    params.set('where', JSON.stringify(where))

    // Call Payload CMS API
    const response = await fetch(`${PAYLOAD_API_URL}/api/categories?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    // Transform Payload data
    const categories = result.docs.map(transformCategory)

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function transformCategory(payloadCategory: any) {
  return {
    id: payloadCategory.id,
    name: payloadCategory.name,
    slug: payloadCategory.slug,
    description: payloadCategory.description,
    parentId: payloadCategory.parent?.id,
    imageUrl: payloadCategory.image?.url,
    icon: payloadCategory.icon,
    sortOrder: payloadCategory.sort_order || 0,
    isActive: payloadCategory.is_active !== false,
    isFeatured: payloadCategory.is_featured || false,
    productCount: payloadCategory.product_count || 0,
  }
}
