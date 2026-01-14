import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_API_URL = process.env.PAYLOAD_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'

    // Build query parameters for Payload REST API
    const params = new URLSearchParams({
      limit: limit.toString(),
      page: page.toString(),
      sort: '-createdAt',
      depth: '2',
    })

    let where: any = {
      is_active: {
        equals: true,
      },
    }

    if (category && category !== 'All') {
      where['category.slug'] = {
        equals: category,
      }
    }

    if (search) {
      where.or = [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
        {
          'category.name': {
            contains: search,
          },
        },
      ]
    }

    if (featured) {
      where.is_featured = {
        equals: true,
      }
    }

    params.set('where', JSON.stringify(where))

    // Call Payload CMS API
    const response = await fetch(`${PAYLOAD_API_URL}/api/products?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    // Transform Payload data to our interface
    const products = result.docs.map(transformProduct)

    return NextResponse.json({
      docs: products,
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function transformProduct(payloadProduct: any) {
  return {
    id: payloadProduct.id,
    name: payloadProduct.name,
    price: formatPrice(payloadProduct.price),
    originalPrice: payloadProduct.original_price ? formatPrice(payloadProduct.original_price) : undefined,
    image: payloadProduct.images?.[0]?.url || payloadProduct.ai_generated_image || '/images/placeholder-product.png',
    category: payloadProduct.category?.name || 'General',
    rating: payloadProduct.rating || 0,
    reviews: payloadProduct.review_count || 0,
    isNew: payloadProduct.is_new || false,
    description: payloadProduct.description || '',
    shortDescription: payloadProduct.short_description || '',
    sku: payloadProduct.sku,
    inventoryCount: payloadProduct.inventory_count || 0,
    tags: payloadProduct.tags || [],
    specifications: payloadProduct.specifications || {},
    isActive: payloadProduct.is_active !== false,
    isFeatured: payloadProduct.is_featured || false,
    slug: payloadProduct.slug,
  }
}

function formatPrice(price: number): string {
  return `KSh ${price.toLocaleString('en-KE')}`
}
