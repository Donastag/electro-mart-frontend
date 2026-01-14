'use client'

import { Search } from 'lucide-react'

interface HeroSectionProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-bold mb-4">
          Kenya's Premier Electronics Store
        </h2>
        <p className="text-xl mb-8">
          Discover the latest technology with AI-powered recommendations
        </p>
        <div className="flex max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-lg text-gray-900"
          />
          <button className="bg-brand-500 px-6 py-3 rounded-r-lg hover:bg-brand-400">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}