import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";

// ✨ 1. Import the new Floating Chatbot Component
import AgriChatbot from "@/components/ui/AgriChatbot"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khetify | AgroDirect Platform",
  description: "The Zero-Commission Agri-Marketplace connecting farmers to consumers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Material Symbols for UI Icons */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" 
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <CartProvider>
            
            {/* The main content of your web pages */}
            {children}

            {/* ✨ 2. Add the Chatbot so it floats on every screen ✨ */}
            <AgriChatbot />

          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}