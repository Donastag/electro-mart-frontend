"use client";

import { Product, Category } from '@/types'

// Service for fetching products from our API routes
class ProductService {
  private static instance: ProductService
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService()
    }
    return ProductService.instance
  }

  // Get all products with caching
  async getProducts(options: {
    limit?: number
    page?: number
    category?: string
    search?: string
    featured?: boolean
    sort?: string
  } = {}) {
    const cacheKey = `products-${JSON.stringify(options)}`

    // Check cache first
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    try {
      const params = new URLSearchParams()

      if (options.limit) params.set('limit', options.limit.toString())
      if (options.page) params.set('page', options.page.toString())
      if (options.category) params.set('category', options.category)
      if (options.search) params.set('search', options.search)
      if (options.featured) params.set('featured', 'true')
      if (options.sort) params.set('sort', options.sort)

      const response = await fetch(`/api/products?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      const products = result.docs || []

      // Cache the result
      this.cache.set(cacheKey, {
        data: products,
        timestamp: Date.now(),
      })

      return products
    } catch (error) {
      console.error('Error fetching products:', error)
      // Return fallback data if backend fails
      return this.getFallbackProducts(options)
    }
  }

  // Get single product by ID or slug
  async getProduct(idOrSlug: string): Promise<Product | null> {
    try {
      const response = await fetch(`/api/products/${idOrSlug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const product = await response.json()
      return product ? product : null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return this.getProducts({ featured: true, limit })
  }

  // Get products by category
  async getProductsByCategory(categorySlug: string, options: any = {}): Promise<Product[]> {
    return this.getProducts({ category: categorySlug, ...options })
  }

  // Search products
  async searchProducts(query: string, options: any = {}): Promise<Product[]> {
    return this.getProducts({ search: query, ...options })
  }

  // Get all categories
  async getCategories() {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      return this.getFallbackCategories()
    }
  }

  // Get category by slug
  async getCategory(slug: string) {
    try {
      const response = await fetch(`/api/categories/${slug}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }



  // Fallback products when backend is unavailable
  private getFallbackProducts(options: any = {}): Product[] {
    // Import SAMPLE_PRODUCTS as fallback
    const { SAMPLE_PRODUCTS } = require('@/lib/constants')
    let filtered = [...SAMPLE_PRODUCTS]

    // Apply basic filtering
    if (options.category && options.category !== 'All') {
      filtered = filtered.filter(p => p.category === options.category)
    }

    if (options.search) {
      const query = options.search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    if (options.featured) {
      filtered = filtered.filter(p => p.isNew) // Use isNew as featured fallback
    }

    // Apply sorting and pagination
    if (options.sort === 'price_asc') {
      filtered.sort((a, b) => parseFloat(a.price.replace(/[^0-9.-]/g, '')) - parseFloat(b.price.replace(/[^0-9.-]/g, '')))
    } else if (options.sort === 'price_desc') {
      filtered.sort((a, b) => parseFloat(b.price.replace(/[^0-9.-]/g, '')) - parseFloat(a.price.replace(/[^0-9.-]/g, '')))
    }

    // Apply pagination
    const page = options.page || 1
    const limit = options.limit || 20
    const start = (page - 1) * limit
    const end = start + limit

    return filtered.slice(start, end)
  }

  // Fallback categories
  private getFallbackCategories() {
    return [
      {
        id: '1',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones and mobile devices',
        sortOrder: 1,
        isActive: true,
        isFeatured: true,
        productCount: 0,
      },
      {
        id: '2',
        name: 'Computers',
        slug: 'computers',
        description: 'Laptops, desktops, and computing devices',
        sortOrder: 2,
        isActive: true,
        isFeatured: true,
        productCount: 0,
      },
      {
        id: '3',
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming consoles, accessories, and equipment',
        sortOrder: 3,
        isActive: true,
        isFeatured: false,
        productCount: 0,
      },
      {
        id: '4',
        name: 'Accessories',
        slug: 'accessories',
        description: 'Various tech accessories and gadgets',
        sortOrder: 4,
        isActive: true,
        isFeatured: false,
        productCount: 0,
      },
    ]
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Export singleton instance
export const productService = ProductService.getInstance()

// Export types for use in components
export * from '@/types'

export interface ProductFilters {
  category?: string
  search?: string
  featured?: boolean
  sort?: string
  page?: number
  limit?: number
}
