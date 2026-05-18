import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id && i.color === action.payload.color && i.size === action.payload.size);
      if (exists) {
        return { ...state, items: state.items.map(i => i.id === action.payload.id && i.color === action.payload.color && i.size === action.payload.size ? { ...i, qty: i.qty + action.payload.qty } : i) };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => !(i.id === action.payload.id && i.color === action.payload.color && i.size === action.payload.size)) };
    case 'UPDATE_QTY':
      return { ...state, items: state.items.map(i => i.id === action.payload.id && i.color === action.payload.color && i.size === action.payload.size ? { ...i, qty: action.payload.qty } : i) };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const getInitialState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('cart') || '{}');
      return saved.items ? saved : { items: [] };
    } catch {
      return { items: [] };
    }
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const totalItems = (state.items || []).reduce((s, i) => s + i.qty, 0);
  const totalPrice = (state.items || []).reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
