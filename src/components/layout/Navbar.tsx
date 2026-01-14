"use client";

import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, searchQuery, setSearchQuery }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">
              Shop<span className="text-brand-600">.KE</span>
            </span>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products, brands and categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-11 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all shadow-sm group-hover:shadow-md"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-gray-600 hover:text-brand-600 transition-colors rounded-full hover:bg-gray-100 hidden sm:block group">
              <div className="flex flex-col items-center">
                <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium mt-0.5">Account</span>
              </div>
            </button>

            <button className="relative p-2 text-gray-600 hover:text-brand-600 transition-colors rounded-full hover:bg-gray-100 group">
              <div className="flex flex-col items-center">
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium mt-0.5">Cart</span>
              </div>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu */}
        <div className={`lg:hidden pb-4 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            {['Account', 'Orders', 'Saved Items', 'Help Center'].map((item) => (
              <a key={item} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
