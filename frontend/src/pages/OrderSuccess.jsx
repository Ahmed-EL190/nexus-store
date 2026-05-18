// OrderSuccess.jsx
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

export function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get('id');
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-brand-black"/>
        </div>
        <h1 className="font-display text-5xl tracking-widest mb-4">ORDER PLACED!</h1>
        <p className="text-brand-gray-500 mb-2">Thank you for your order.</p>
        {orderId && <p className="font-mono text-xs text-brand-gray-400 mb-8">Order ID: {orderId}</p>}
        <p className="text-sm text-brand-gray-600 mb-8">You'll receive a confirmation email shortly. Delivery takes 3-5 business days.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/shop" className="btn-primary flex items-center gap-2"><Package size={16}/> Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
