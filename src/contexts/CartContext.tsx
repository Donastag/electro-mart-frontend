"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Product } from '@/types'

// Cart item interface
export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedVariant?: {
    color?: string
    size?: string
    [key: string]: any
  }
  unitPrice: number
  totalPrice: number
}

// Cart state interface
interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isOpen: boolean
  isLoading: boolean
}

// Cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; variant?: any } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SYNC_CART'; payload: CartItem[] }

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isOpen: false,
  isLoading: false,
}

// Calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)
  return { totalItems, totalAmount }
}

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, variant } = action.payload
      
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      )

      let newItems: CartItem[]
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity
            return {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice,
            }
          }
          return item
        })
      } else {
        // Add new item
        const unitPrice = parseFloat(product.price.replace(/[^0-9.-]/g, '')) || 0
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          selectedVariant: variant,
          unitPrice,
          totalPrice: unitPrice * quantity,
        }
        newItems = [...state.items, newItem]
      }

      const { totalItems, totalAmount } = calculateTotals(newItems)
      
      // Show success notification
      if (typeof window !== 'undefined') {
        const notification = document.createElement('div')
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50 animate-bounce'
        notification.textContent = `${product.name} added to cart!`
        document.body.appendChild(notification)
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification)
          }
        }, 2000)
      }

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const { totalItems, totalAmount } = calculateTotals(newItems)
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }

      const newItems = state.items.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice,
          }
        }
        return item
      })

      const { totalItems, totalAmount } = calculateTotals(newItems)
      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }

    case 'LOAD_CART':
    case 'SYNC_CART': {
      const items = action.payload
      const { totalItems, totalAmount } = calculateTotals(items)
      return {
        ...state,
        items,
        totalItems,
        totalAmount,
      }
    }

    default:
      return state
  }
}

// Context
interface CartContextType {
  state: CartState
  addItem: (product: Product, quantity?: number, variant?: any) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  getItemQuantity: (productId: string, variant?: any) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider component
interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('elecromart-cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('elecromart-cart', JSON.stringify(state.items))
  }, [state.items])

  // Cart actions
  const addItem = (product: Product, quantity = 1, variant?: any) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, variant } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    if (typeof window !== 'undefined') {
      const notification = document.createElement('div')
      notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50'
      notification.textContent = 'Cart cleared'
      document.body.appendChild(notification)
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 1500)
    }
  }

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' })
  }

  const getItemQuantity = (productId: string, variant?: any): number => {
    const item = state.items.find(item => 
      item.product.id.toString() === productId && 
      JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
    )
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    getItemQuantity,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Utility functions for cart operations
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const calculateShipping = (subtotal: number): number => {
  // Free shipping over KSh 5,000
  if (subtotal >= 5000) return 0
  // Standard shipping fee
  return 150
}

export const calculateTax = (subtotal: number): number => {
  // 16% VAT for Kenya
  return subtotal * 0.16
}

export const calculateTotal = (subtotal: number): number => {
  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  return subtotal + shipping + tax
}