import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

const addItem = (product, quantity = 1) => {
  setItems((prevItems) => {
    const existing = prevItems.find((item) => item.productId === product._id);

    if (existing) {
      const newQuantity = Math.min(existing.quantity + quantity, product.stock);

      return prevItems.map((item) =>
        item.productId === product._id
          ? { ...item, quantity: newQuantity, stock: product.stock }
          : item
      );
    }

    return [
      ...prevItems,
      {
        productId: product._id,
        name: product.name,
        image: product.images[0],
        price: product.discountPrice || product.price,
        stock: product.stock,
        quantity: Math.min(quantity, product.stock),
      },
    ];
  });
};

  const removeItem = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}