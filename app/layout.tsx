import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khetify | Soil to Storefront",
  description: "Connecting regional farmers directly to wholesale buyers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-background text-on-background antialiased`}>
        {/* THE FIX: Wrap children in the CartProvider */}
        <CartProvider>
          {children}
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}