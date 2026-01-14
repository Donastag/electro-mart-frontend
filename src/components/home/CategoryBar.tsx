import React from 'react';
import { CATEGORIES } from '../../lib/constants';

interface Category {
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

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories?: Category[];
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categories
}) => {
  const displayCategories = categories || CATEGORIES.map(cat => ({
    id: cat.toLowerCase().replace(/\s+/g, '-'),
    name: cat,
    slug: cat.toLowerCase().replace(/\s+/g, '-'),
    sortOrder: 0,
    isActive: true,
    isFeatured: true,
    productCount: 0
  }));

  return (
    <div className="bg-white border-b border-gray-200 sticky top-[80px] z-30 shadow-sm overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-4">
          {displayCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => onSelectCategory(category.slug)}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
                ${selectedCategory === category.slug
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900'
                }
              `}
            >
              {category.name} {category.productCount > 0 ? `(${category.productCount})` : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
