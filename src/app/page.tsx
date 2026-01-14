"use client";

import React, { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import BlackNovemberHero from '@/components/home/BlackNovemberHero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts, useProductSearch } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { CartSidebar } from '@/components/cart/CartSidebar';

export default function Home() {
  const { state: cartState, toggleCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const {
    products,
    categories,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  const {
    results: searchResults,
    search,
    clearResults,
  } = useProductSearch();

  // Use search results if there's a query, otherwise use all products
  const displayProducts = searchQuery.trim() ? searchResults : products;

  // Filter by selected category
  const categoryFilteredProducts = selectedCategory === 'All'
    ? displayProducts
    : displayProducts.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      search(query);
    } else {
      clearResults();
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Trigger new search if there's a query
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const title = selectedCategory === 'All' ? 'Featured Products' : `${selectedCategory} Products`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <Navbar
        cartCount={cartState.totalItems}
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
      />

      <main className="flex-grow">
        {/* Black November Full Screen Hero / Slider */}
        <BlackNovemberHero />

        {/* Standard Shop Components */}
        <CategoryBar
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          categories={categories}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {title}
            </h2>
            {productsLoading ? (
              <span className="text-gray-500 text-sm">Loading products...</span>
            ) : (
              <span className="text-gray-500 text-sm">
                {categoryFilteredProducts.length} items found
              </span>
            )}
          </div>

          {productsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p>Error loading products: {productsError}</p>
            </div>
          )}

          <ProductGrid products={categoryFilteredProducts} loading={productsLoading} />
        </div>
      </main>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartState.isOpen} onClose={toggleCart} />
    </div>
  );
}
