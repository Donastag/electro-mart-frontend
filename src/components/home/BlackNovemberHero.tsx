"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface Bundle {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  originalPrice: number;
  salePrice: number;
  savings: number;
  discount: number;
  products: {
    main: { name: string; image: string };
    secondary: { name: string; image: string };
  };
  expiresAt: Date;
}

const BUNDLES: Bundle[] = [
  {
    id: 1,
    title: 'Streamer Starter Pack',
    subtitle: 'BLACK NOV',
    tagline: '"Silence the noise. Amplify the work."',
    originalPrice: 227500,
    salePrice: 199000,
    savings: 28500,
    discount: 13,
    products: {
      main: {
        name: 'MacBook Air 15"',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
      },
      secondary: {
        name: 'SONY WH-100XM5',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  },
  {
    id: 2,
    title: 'Content Creator Pro',
    subtitle: 'BLACK NOV',
    tagline: '"Create without limits. Perform without boundaries."',
    originalPrice: 315000,
    salePrice: 275000,
    savings: 40000,
    discount: 13,
    products: {
      main: {
        name: 'MacBook Pro 16"',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
      },
      secondary: {
        name: 'Sony A7 Camera',
        image: 'https://images.unsplash.com/photo-1606980624314-e0b1352b0baf?w=600&h=600&fit=crop',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    title: 'Gaming Ultimate Bundle',
    subtitle: 'BLACK NOV',
    tagline: '"Dominate every match. Experience every detail."',
    originalPrice: 245000,
    salePrice: 213000,
    savings: 32000,
    discount: 13,
    products: {
      main: {
        name: 'Gaming Laptop',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&h=600&fit=crop',
      },
      secondary: {
        name: 'Gaming Headset',
        image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
];

export default function BlackNovemberHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 42, seconds: 41 });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<'main' | 'secondary' | null>(null);

  const currentBundle = BUNDLES[currentSlide];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BUNDLES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + BUNDLES.length) % BUNDLES.length);
  };

  const handleNextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % BUNDLES.length);
  };

  return (
    <section className="relative w-full h-[600px] bg-gradient-to-br from-gray-950 via-gray-900 to-black overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10 z-0"
        style={{ backgroundImage: `url(${currentBundle.products.main.image})` }}
      />

      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-center">
          {/* LEFT SIDE - Content */}
          <div className="space-y-6 z-10">
            {/* Subtitle */}
            <div className="text-gray-400 text-xl font-medium tracking-[0.3em] uppercase">
              {currentBundle.subtitle}
            </div>

            {/* Main Title */}
            <h1 className="text-6xl lg:text-7xl font-black text-white leading-none tracking-tight text-glow">
              {currentBundle.title}
            </h1>

            {/* Tagline */}
            <p className="text-2xl text-orange-400 italic font-light">
              {currentBundle.tagline}
            </p>

            {/* Pricing Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 space-y-4 max-w-md">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span className="uppercase tracking-wide">Combined Value</span>
                <span className="line-through">KSh {currentBundle.originalPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-white">
                  KSh {currentBundle.salePrice.toLocaleString()}
                </span>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-2">
                  -{currentBundle.discount}%
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                <span className="text-gray-400">You Save:</span>
                <span className="text-2xl font-bold text-orange-500">
                  KSh {currentBundle.savings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl px-6 py-4 flex items-center gap-3 mt-6">
              <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
              <div className="flex items-center gap-1 font-mono text-white text-xl font-bold">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-orange-500">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-orange-500">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - Product Showcase */}
          <div className="relative h-[500px] flex items-center justify-center">
            {/* Flash Bundle Badge - Overlay */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30 animate-pulse-fast">
              <Zap className="w-3 h-3 fill-white" />
              FLASH BUNDLE DEAL
            </div>

            {/* Main Product Card - Laptop */}
            <div
              className={`absolute left-[15%] top-1/2 -translate-y-1/2 w-[300px] bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl overflow-hidden transform -rotate-[15deg] hover:rotate-0 transition-all duration-500 hover:scale-105 group cursor-pointer animate-float ${
                hoveredCard === 'main' ? 'z-30' : hoveredCard === 'secondary' ? 'z-10' : 'z-20'
              }`}
              onMouseEnter={() => setHoveredCard('main')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={currentBundle.products.main.image}
                  alt={currentBundle.products.main.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-3 bg-white">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  {currentBundle.products.main.name.split(' ').slice(-2).join(' ')}
                </p>
                <h3 className="text-gray-900 font-bold text-base mt-1">
                  {currentBundle.products.main.name}
                </h3>
              </div>
            </div>

            {/* Plus Icon */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl z-30 animate-pulse">
              <div className="w-6 h-0.5 bg-white absolute" />
              <div className="w-0.5 h-6 bg-white absolute" />
            </div>

            {/* Secondary Product Card - Headphones */}
            <div
              className={`absolute right-[15%] top-1/2 -translate-y-1/2 w-[250px] bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl overflow-hidden transform rotate-[15deg] hover:rotate-0 transition-all duration-500 hover:scale-105 group cursor-pointer animate-float-delayed ${
                hoveredCard === 'secondary' ? 'z-30' : hoveredCard === 'main' ? 'z-10' : 'z-20'
              }`}
              onMouseEnter={() => setHoveredCard('secondary')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={currentBundle.products.secondary.image}
                  alt={currentBundle.products.secondary.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-3 bg-white">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                  Silence. Evolved.
                </p>
                <h3 className="text-gray-900 font-bold text-sm">
                  {currentBundle.products.secondary.name}
                </h3>
                <div className="flex gap-1 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>
              </div>
            </div>

            {/* Grab Button - Overlay */}
            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 z-40 group bg-white text-black px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30">
              <span className="relative z-10 flex items-center gap-2">
                GRAB THIS BUNDLE
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
        {/* Previous Button */}
        <button
          onClick={handlePrevSlide}
          className="w-12 h-12 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-gray-800 hover:border-orange-500 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 group-hover:text-orange-500 transition-colors" />
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {BUNDLES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-600'
                  : 'w-2 bg-gray-700 hover:bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNextSlide}
          className="w-12 h-12 rounded-full bg-gray-900/80 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-white hover:bg-gray-800 hover:border-orange-500 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>
    </section>
  );
}
