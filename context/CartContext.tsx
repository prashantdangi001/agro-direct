'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  farm: string;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItem = prevCart.find((item) => item.id === newItem.id);
      
      // Use the quantity passed from the component, or default to 1
      const quantityToAdd = newItem.qty || 1;

      if (existingItem) {
        // If it exists, add the NEW quantity to the EXISTING quantity
        return prevCart.map((item) =>
          item.id === newItem.id ? { ...item, qty: item.qty + quantityToAdd } : item
        );
      }
      
      // If it's a brand new item, add it with the requested quantity
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

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.qty, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}