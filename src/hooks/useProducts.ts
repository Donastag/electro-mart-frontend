"use client";

import { useState, useEffect } from 'react'
import { productService, Product, Category, ProductFilters } from '@/services/productService'

interface UseProductsReturn {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  fetchProducts: (filters?: ProductFilters) => Promise<void>
  fetchCategories: () => Promise<void>
  searchProducts: (query: string) => Promise<Product[]>
  refreshData: () => void
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products with filters
  const fetchProducts = async (filters: ProductFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getProducts(filters)
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await productService.getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  // Search products
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      return await productService.searchProducts(query)
    } catch (err) {
      console.error('Error searching products:', err)
      return []
    }
  }

  // Refresh all data
  const refreshData = () => {
    productService.clearCache()
    fetchProducts()
    fetchCategories()
  }

  // Initial data load
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    searchProducts,
    refreshData,
  }
}

// Hook for single product
export const useProduct = (idOrSlug: string) => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getProduct(idOrSlug)
        setProduct(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }

    if (idOrSlug) {
      fetchProduct()
    }
  }, [idOrSlug])

  return { product, loading, error }
}

// Hook for featured products
export const useFeaturedProducts = (limit: number = 8) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getFeaturedProducts(limit)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products')
        console.error('Error fetching featured products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [limit])

  return { products, loading, error }
}

// Hook for category products
export const useCategoryProducts = (categorySlug: string, options: any = {}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getProductsByCategory(categorySlug, options)
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category products')
        console.error('Error fetching category products:', err)
      } finally {
        setLoading(false)
      }
    }

    if (categorySlug) {
      fetchCategoryProducts()
    }
  }, [categorySlug, JSON.stringify(options)])

  return { products, loading, error }
}

// Hook for search results
export const useProductSearch = () => {
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await productService.searchProducts(query)
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products')
      console.error('Error searching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setError(null)
  }

  return { results, loading, error, search, clearResults }
}