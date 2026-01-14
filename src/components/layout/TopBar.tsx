"use client";

import React from 'react';
import { Phone, Mail, Truck } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
        {/* Contact Info */}
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <a
            href="tel:+254700123456"
            className="flex items-center gap-1.5 hover:text-brand-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5 cursor-pointer group"
          >
            <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>+254 700 123 456</span>
          </a>
          <a
            href="mailto:support@shop.co.ke"
            className="flex items-center gap-1.5 hover:text-brand-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5 cursor-pointer group"
          >
            <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>support@shop.co.ke</span>
          </a>
        </div>

        {/* Shipping Info */}
        <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 cursor-default select-none">
          <Truck className="w-3.5 h-3.5 animate-pulse text-brand-500" />
          <span className="tracking-wide">Free shipping on orders over <span className="font-semibold text-brand-500">KSh 5,000</span></span>
        </div>
      </div>
    </div>
  );
};
