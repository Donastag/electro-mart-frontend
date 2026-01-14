"use client";

import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">
              Shop<span className="text-brand-500">.KE</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online marketplace for quality products in Kenya. Experience seamless shopping with secure payments and fast delivery.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button
                  key={i}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 hover:scale-110 transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white relative inline-block">
              Shopping
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Deals'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-brand-500 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white relative inline-block">
              Information
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms & Conditions', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand-500 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-brand-500 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-600 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 bg-slate-800 rounded-full group-hover:bg-brand-600 transition-colors">
                  <MapPin className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <span className="mt-1 group-hover:text-white transition-colors">Moi Avenue, CBD<br/>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-slate-800 rounded-full group-hover:bg-brand-600 transition-colors">
                   <Phone className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">+254 700 123 456</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-slate-800 rounded-full group-hover:bg-brand-600 transition-colors">
                   <Mail className="w-4 h-4 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <span className="group-hover:text-white transition-colors">support@shop.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            © {new Date().getFullYear()} Shop.KE. All rights reserved.
          </div>
          <div className="flex gap-6">
             <button className="hover:text-brand-500 transition-colors">Privacy</button>
             <button className="hover:text-brand-500 transition-colors">Terms</button>
             <button className="hover:text-brand-500 transition-colors">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
