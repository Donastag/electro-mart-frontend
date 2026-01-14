// Client-side Payload utilities - types and helper functions only
// All server-side operations are now handled through API routes

// Type definitions for common Payload responses
export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

// Product filters interface
export interface ProductFilters {
  limit?: number
  page?: number
  category?: string
  search?: string
  featured?: boolean
  sort?: string
  where?: any
  depth?: number
}

// Helper functions for client-side use (no server imports)
export const createProductWhere = (filters: {
  category?: string
  search?: string
  featured?: boolean
}): any => {
  const where: any = {
    is_active: {
      equals: true,
    },
  }

  if (filters.category && filters.category !== 'All') {
    where['category.slug'] = {
      equals: filters.category,
    }
  }

  if (filters.search) {
    where.or = [
      {
        name: {
          contains: filters.search,
        },
      },
      {
        description: {
          contains: filters.search,
        },
      },
      {
        'category.name': {
          contains: filters.search,
        },
      },
    ]
  }

  if (filters.featured) {
    where.is_featured = {
      equals: true,
    }
  }

  return where
}
