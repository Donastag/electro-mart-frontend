export interface Product {
  id: number | string;
  name: string;
  price: string;
  originalPrice?: string;
  image?: string; // Made optional for AI-generated images
  category: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  description?: string;
  shortDescription?: string;
  sku?: string;
  inventoryCount?: number;
  tags?: string[];
  specifications?: any;
  isActive?: boolean;
  isFeatured?: boolean;
  slug?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: Order[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  productCount: number;
}

export interface AIModel {
  generateProductRecommendations(userId: string, products: Product[]): Promise<Product[]>;
  generateProductDescription(productName: string, category: string): Promise<string>;
  analyzeProductImage(imageUrl: string): Promise<string[]>;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryItem {
  productId: number;
  quantity: number;
  lowStockThreshold: number;
  lastUpdated: Date;
}
