import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existItem = prev.find(x => x.product === product._id);
      let newCart;
      if (existItem) {
        newCart = prev.map(x => x.product === existItem.product ? { ...x, qty: x.qty + qty } : x);
      } else {
        newCart = [...prev, { 
          product: product._id, 
          name: product.name, 
          image: product.image, 
          price: product.price, 
          qty 
        }];
      }
      localStorage.setItem('cartItems', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => {
      const newCart = prev.filter(x => x.product !== id);
      localStorage.setItem('cartItems', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateCartItemQty = (id, qty) => {
    setCartItems(prev => {
      if(qty <= 0) return prev.filter(x => x.product !== id);
      const newCart = prev.map(x => x.product === id ? { ...x, qty } : x);
      localStorage.setItem('cartItems', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQty, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
