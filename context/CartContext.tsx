'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  farm: string;
  farmerId: string; // Added for isolation
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      const quantityToAdd = newItem.qty || 1;

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, qty: item.qty + quantityToAdd } : item
        );
      }
      return [...prevCart, { ...newItem, qty: quantityToAdd }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) => 
      prevCart.map((item) => item.id === id ? { ...item, qty } : item)
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => cart.reduce((total, item) => total + item.price * item.qty, 0);
  const getCartCount = () => cart.reduce((count, item) => count + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
}