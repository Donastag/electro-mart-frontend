"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShoppingCart, Heart, Sparkles, Loader2, ImageOff, Download } from 'lucide-react';
import { Product } from '@/types';
import { generateProductImage } from '@/lib/gemini';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState<string>(product.image || '');
  const [isGenerating, setIsGenerating] = useState<boolean>(!product.image);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const CACHE_KEY = `product-image-cache-${product.id}`;

  // 1. Check LocalStorage on Mount to see if we already generated this image
  useEffect(() => {
    if (!product.image) {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setImageSrc(cached);
        setIsAiGenerated(true);
        setIsGenerating(false);
        setIsImageLoaded(true); // Assume cached is ready
      }
    }
  }, [product.image, CACHE_KEY]);

  // 2. Intersection Observer for Lazy Loading (Performance)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading when item is 200px away from viewport
        threshold: 0.1
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3. Generate Image using Gemini AI if not found in cache or props
  useEffect(() => {
    // Only generate if: Visible, No Props Image, No State Image, and Is flagged as Generating
    if (isVisible && !product.image && !imageSrc && isGenerating) {
      generateProductImage(product.name)
        .then((generatedUrl) => {
          if (generatedUrl) {
            setImageSrc(generatedUrl);
            setIsAiGenerated(true);

            // Try to cache in LocalStorage so it sticks on refresh
            try {
              localStorage.setItem(CACHE_KEY, generatedUrl);
            } catch (e) {
              console.warn('LocalStorage quota exceeded, image not cached for next reload.');
            }
          }
          setIsGenerating(false);
        })
        .catch(() => {
          setIsGenerating(false);
        });
    }
  }, [product.name, product.image, imageSrc, isGenerating, isVisible, CACHE_KEY]);

  const handleProductClick = () => {
    router.push(`/products/${product.id}`);
  };

  const handleDownloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageSrc) return;

    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleProductClick}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out group flex flex-col h-full relative cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm z-10 tracking-wider">
            NEW
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 bg-neon-red text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm z-10 tracking-wider">
            SALE
          </span>
        )}

        {/* Image Display Logic */}
        {isGenerating ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 gap-3">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <Sparkles className="w-4 h-4 text-brand-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xs font-medium animate-pulse">
              {isVisible ? 'Creating Magic...' : 'Pending...'}
            </span>
          </div>
        ) : imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out ${isImageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                 <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
              </div>
            )}

            {/* AI Generated Badge & Controls */}
            {isAiGenerated && isImageLoaded && (
              <>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 z-10 pointer-events-none border border-white/10">
                  <Sparkles className="w-3 h-3 text-brand-400" />
                  <span>AI Generated</span>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownloadImage}
                  title="Download Image"
                  className="absolute bottom-3 right-14 w-8 h-8 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors z-20 border border-white/10"
                >
                  <Download className="w-4 h-4" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
             <ImageOff className="w-10 h-10 mb-2 opacity-50" />
             <span className="text-xs">No Image</span>
          </div>
        )}

        {/* Wishlist Button (Floats up on hover) */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all translate-y-16 group-hover:translate-y-0 duration-500 ease-out z-20"
        >
          <Heart className="w-5 h-5 fill-current" />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow bg-white relative z-20">
        <div className="text-[10px] text-brand-600 font-bold mb-1 uppercase tracking-widest">
          {product.category}
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[48px] group-hover:text-brand-600 transition-colors" title={product.name}>
          {product.name}
        </h3>

        <div className="mt-auto">
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-2">
            <div className="text-lg font-bold text-gray-900">{product.price}</div>
            {product.originalPrice && (
              <div className="text-xs text-gray-400 line-through decoration-gray-400/60">{product.originalPrice}</div>
            )}
          </div>

          {/* Ratings Section */}
          <div className="flex items-center gap-1 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1 font-medium">
              ({product.reviews})
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
