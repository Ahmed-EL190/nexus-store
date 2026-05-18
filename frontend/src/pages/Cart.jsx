import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

export default function Cart() {
  const { items, dispatch, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
      <ShoppingBag size={60} className="text-brand-gray-300"/>
      <h2 className="font-display text-5xl tracking-widest text-brand-gray-300">YOUR CART IS EMPTY</h2>
      <Link to="/shop" className="btn-primary">Continue Shopping</Link>
    </div>
  );

  const shipping = totalPrice >= 1000 ? 0 : 80;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display text-5xl md:text-6xl tracking-widest mb-10">
          YOUR CART <span className="text-brand-gray-300">({totalItems})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 border border-brand-gray-200">
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <img src={item.image} alt={item.name} className="w-24 h-24 md:w-32 md:h-32 object-cover bg-brand-gray-100" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
                </Link>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-xs text-brand-gray-500 font-mono mt-1">
                        Size: {item.size} | Color: <span className="inline-block w-3 h-3 rounded-full border border-brand-gray-300 align-middle ml-1" style={{background: item.color}}/>
                      </p>
                    </div>
                    <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item })}
                      className="p-1 hover:text-red-500 transition-colors">
                      <Trash2 size={16}/>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-brand-gray-300">
                      <button onClick={() => item.qty <= 1 ? dispatch({ type: 'REMOVE_ITEM', payload: item }) : dispatch({ type: 'UPDATE_QTY', payload: { ...item, qty: item.qty - 1 } })}
                        className="w-8 h-8 flex items-center justify-center hover:bg-brand-gray-100">
                        <Minus size={12}/>
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-semibold">{item.qty}</span>
                      <button onClick={() => dispatch({ type: 'UPDATE_QTY', payload: { ...item, qty: Math.min(10, item.qty + 1) } })}
                        className="w-8 h-8 flex items-center justify-center hover:bg-brand-gray-100">
                        <Plus size={12}/>
                      </button>
                    </div>
                    <span className="font-bold">LE {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="border border-brand-gray-200 p-6 sticky top-20">
              <h2 className="font-display text-2xl tracking-widest mb-6">ORDER SUMMARY</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between"><span className="text-brand-gray-500">Subtotal</span><span>LE {totalPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-brand-gray-500">Shipping</span><span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>{shipping === 0 ? 'FREE' : `LE ${shipping}`}</span></div>
                {shipping > 0 && <p className="text-xs text-brand-gray-400">Add LE {(1000 - totalPrice).toLocaleString()} for free shipping</p>}
                <div className="border-t border-brand-gray-200 pt-3 flex justify-between font-bold text-base">
                  <span>Total</span><span>LE {(totalPrice + shipping).toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => navigate('/checkout')} className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={16}/>
              </button>
              <Link to="/shop" className="btn-outline w-full flex items-center justify-center mt-3">
                Continue Shopping
              </Link>

              <div className="mt-6 pt-4 border-t border-brand-gray-200">
                <p className="text-xs text-brand-gray-400 font-mono tracking-wider uppercase mb-3">We accept</p>
                <div className="flex gap-2 flex-wrap">
                  {['VISA', 'MC', 'VODAFONE', 'INSTAPAY'].map(m => (
                    <span key={m} className="border border-brand-gray-300 px-2 py-1 text-xs font-mono">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
