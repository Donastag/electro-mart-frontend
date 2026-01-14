import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import './globals.css'

// Configure Inter font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Note: metadata export for client components isn't supported in Next.js 14+
// Metadata should be moved to a server component if needed
// export const metadata: Metadata = {
//   title: "Elecro.Mart - Online Shopping in Kenya",
//   description: "A premier online shopping destination in Kenya.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
