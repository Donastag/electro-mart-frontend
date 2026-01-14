import { Product } from '@/types';

export const SAMPLE_PRODUCTS: Product[] = [
  // Smartphones
  { 
    id: 101, 
    name: 'Apple iPhone 15 Pro Max (256GB)', 
    price: 'KSh 215,000', 
    originalPrice: 'KSh 230,000',
    image: '/images/products/apple-iphone-15-pro-max-(256gb).png',
    category: 'Smartphones',
    rating: 4.9,
    reviews: 342,
    isNew: true
  },
  { 
    id: 102, 
    name: 'Samsung Galaxy S24 Ultra', 
    price: 'KSh 198,000', 
    image: '/images/products/samsung-galaxy-s24-ultra.png',
    category: 'Smartphones',
    rating: 4.8,
    reviews: 156
  },
  
  // Computers
  { 
    id: 201, 
    name: 'MacBook Air 15" M3 Chip', 
    price: 'KSh 185,000', 
    image: '/images/products/macbook-air-15_-m3-chip.png',
    category: 'Computers',
    rating: 4.9,
    reviews: 89
  },
  { 
    id: 202, 
    name: 'HP Spectre x360 Laptop', 
    price: 'KSh 145,000', 
    originalPrice: 'KSh 165,000',
    image: '/images/products/hp-spectre-x360-laptop.png', 
    category: 'Computers',
    rating: 4.6,
    reviews: 45
  },

  // Gaming
  { 
    id: 301, 
    name: 'PlayStation 5 Console (Slim)', 
    price: 'KSh 75,000', 
    image: '/images/products/playstation-5-console-(slim).png', 
    category: 'Gaming',
    rating: 4.9,
    reviews: 1250
  },
  { 
    id: 11, 
    name: 'Wireless Gaming Mouse Pro', 
    price: 'KSh 5,900', 
    originalPrice: 'KSh 7,500',
    image: '/images/products/wireless-gaming-mouse-pro.png',
    category: 'Gaming',
    rating: 4.6,
    reviews: 201
  },

  // Televisions
  {
    id: 401,
    name: 'LG C3 55" OLED evo 4K TV',
    price: 'KSh 189,000',
    originalPrice: 'KSh 210,000',
    image: '/images/products/lg-c3-55_-oled-evo-4k-tv.png',
    category: 'Televisions',
    rating: 4.8,
    reviews: 67
  },
  {
    id: 402,
    name: 'Samsung 65" Neo QLED 4K',
    price: 'KSh 245,000',
    image: '/images/products/samsung-65_-neo-qled-4k.png', 
    category: 'Televisions',
    rating: 4.7,
    reviews: 42
  },

  // Networking
  {
    id: 501,
    name: 'TP-Link Archer AX55 Wi-Fi 6 Router',
    price: 'KSh 12,500',
    image: '/images/products/tp-link-archer-ax55-wi-fi-6-router.png',
    category: 'Networking',
    rating: 4.5,
    reviews: 112
  },

  // Accessories (Mobile/Gadgets)
  {
    id: 601,
    name: 'Anker 737 Power Bank',
    price: 'KSh 18,500',
    image: '/images/products/anker-737-power-bank.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 230
  },
  { 
    id: 1, 
    name: 'Sony WH-1000XM5 Wireless Headphones', 
    price: 'KSh 42,500', 
    originalPrice: 'KSh 48,000',
    image: '/images/products/sony-wh-1000xm5-wireless-headphones.png',
    category: 'Accessories',
    rating: 4.8,
    reviews: 124,
    isNew: true
  },

  // Existing Categories (Fashion, Home, Sports)
  { 
    id: 3, 
    name: 'Genuine Leather Crossbody Bag', 
    price: 'KSh 6,200', 
    originalPrice: 'KSh 8,500',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', 
    category: 'Fashion',
    rating: 4.5,
    reviews: 45
  },
  { 
    id: 5, 
    name: 'Hydro Flask Wide Mouth', 
    price: 'KSh 4,500', 
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', 
    category: 'Home',
    rating: 4.8,
    reviews: 567
  },
  { 
    id: 6, 
    name: 'Lululemon Yoga Mat 5mm', 
    price: 'KSh 8,200', 
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80', 
    category: 'Sports',
    rating: 4.6,
    reviews: 78
  }
];

export const POPULAR_SEARCHES = ['iPhone 15', 'PS5', 'Laptops', 'Smart TV', 'Routers', 'Samsung', 'Fashion'];
export const CATEGORIES = ['All', 'Smartphones', 'Computers', 'Gaming', 'Televisions', 'Accessories', 'Networking', 'Fashion', 'Home', 'Sports'];

// Black Friday Bundles (exact same as original)
export const BUNDLES = [
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
  {
    id: 4,
    title: 'Smartphone Pro Pack',
    subtitle: 'BLACK NOV',
    tagline: '"Capture perfection. Connect seamlessly."',
    originalPrice: 255000,
    salePrice: 220000,
    savings: 35000,
    discount: 14,
    products: {
      main: {
        name: 'iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop',
      },
      secondary: {
        name: 'Wireless Charger',
        image: 'https://images.unsplash.com/photo-1609592804768-d0db4628fdd?w=600&h=600&fit=crop',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    title: 'Home Entertainment Hub',
    subtitle: 'BLACK NOV',
    tagline: '"Immersive experiences. Ultimate comfort."',
    originalPrice: 395000,
    salePrice: 345000,
    savings: 50000,
    discount: 13,
    products: {
      main: {
        name: '65" 4K OLED TV',
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=600&fit=crop',
      },
      secondary: {
        name: 'Soundbar System',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    id: 6,
    title: 'Fashion & Accessories',
    subtitle: 'BLACK NOV',
    tagline: '"Style meets functionality. Elevate your look."',
    originalPrice: 42500,
    salePrice: 35000,
    savings: 7500,
    discount: 18,
    products: {
      main: {
        name: 'Designer Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
      },
      secondary: {
        name: 'Leather Backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      },
    },
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
];
