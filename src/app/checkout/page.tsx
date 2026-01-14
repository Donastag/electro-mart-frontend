"use client";

import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart, formatCurrency, calculateShipping, calculateTax } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function CheckoutPage() {
  const { state: cartState } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock order data - in real implementation, this would be processed with payment gateway
  const [orderData, setOrderData] = useState({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    phone: '',
    paymentMethod: 'card'
  });

  const subtotal = cartState.totalAmount;
  const shipping = subtotal >= 5000 ? 0 : 150;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartState.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would integrate with payment gateway (Stripe, M-Pesa, etc.)
      // and create order via API

      alert('Order processing would happen here with payment integration');

      // On success, clear cart and redirect to success page

    } catch (error) {
      console.error('Order processing error:', error);
      alert('Order processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isAuthenticated && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      Already have an account?{' '}
                      <Link href="/login" className="font-medium underline">
                        Sign in
                      </Link>{' '}
                      for faster checkout
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.customerName}
                      onChange={(e) => setOrderData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={orderData.customerEmail}
                      onChange={(e) => setOrderData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderData.phone}
                    onChange={(e) => setOrderData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address *
                  </label>
                  <textarea
                    required
                    value={orderData.shippingAddress}
                    onChange={(e) => setOrderData(prev => ({ ...prev, shippingAddress: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="Street address, city, state, postal code"
                  />
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="card"
                    name="payment"
                    type="radio"
                    value="card"
                    checked={orderData.paymentMethod === 'card'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                  />
                  <label htmlFor="card" className="ml-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit/Debit Card
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="mpesa"
                    name="payment"
                    type="radio"
                    value="mpesa"
                    checked={orderData.paymentMethod === 'mpesa'}
                    onChange={(e) => setOrderData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                  />
                  <label htmlFor="mpesa" className="ml-3">
                    M-Pesa
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4">
                {cartState.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (16%):</span>
                  <span>{formatCurrency(tax)}</span>
                </div>

                <hr className="my-2" />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-gray-600">Your payment information is encrypted</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-3">
                <Truck className="w-6 h-6 text-blue-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-gray-600">Orders over KSh 5,000</p>
                </div>
              </div>
            </div>

            {/* Complete Order Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-brand-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleSubmit}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Order...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete Order - {formatCurrency(total)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
