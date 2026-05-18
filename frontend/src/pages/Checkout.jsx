import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, ChevronRight, Lock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { handleImageError } from '../utils/imageFallback';

const STEPS = ['Shipping', 'Payment', 'Review'];

const paymentMethods = [
  { id: 'card', label: 'Visa / MasterCard', desc: 'Secure card payment via Stripe', icon: CreditCard, color: '#1a56db' },
  { id: 'vodafone', label: 'Vodafone Cash', desc: 'Pay with your Vodafone wallet', icon: Smartphone, color: '#e60000' },
  { id: 'instapay', label: 'InstaPay', desc: 'Instant bank transfer via InstaPay', icon: Banknote, color: '#00a651' },
];

export default function Checkout() {
  const { items, totalPrice, dispatch } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: 'Cairo', governorate: 'Cairo',
    notes: ''
  });

  const shipping = totalPrice >= 1000 ? 0 : 80;
  const total = totalPrice + shipping;

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const govs = ['Cairo', 'Giza', 'Alexandria', 'Luxor', 'Aswan', 'Mansoura', 'Tanta', 'Zagazig', 'Ismailia', 'Suez', 'Port Said', 'Damanhur', 'Minya', 'Asyut', 'Sohag', 'Qena', 'Beni Suef', 'Fayoum', 'New Valley', 'Red Sea', 'Matrouh', 'North Sinai', 'South Sinai', 'Kafr el-Sheikh', 'Dakahlia', 'Sharqia', 'Monufia', 'Gharbia', 'Beheira', 'Qalyubia'];

  const placeOrder = async () => {
    setLoading(true);
    try {
      // Create order
      const { data: order } = await axios.post('/api/orders', {
        items: items.map(i => ({ ...i, amount: i.price * i.qty })),
        customer: { ...form, name: `${form.firstName} ${form.lastName}` },
        shippingAddress: { address: form.address, city: form.city, governorate: form.governorate },
        paymentMethod: payMethod,
        totalAmount: total
      });

      if (payMethod === 'card' || payMethod === 'vodafone' || payMethod === 'instapay') {
        // Try Paymob
        try {
          const { data: payment } = await axios.post('/api/payment/paymob/pay', {
            amount: total,
            method: payMethod,
            orderId: order.id,
            customer: { ...form, name: `${form.firstName} ${form.lastName}` },
            items: items.map(i => ({ name: i.name, amount: i.price * 100, description: i.name, quantity: i.qty }))
          });
          // Redirect to Paymob iframe
          window.location.href = payment.iframeUrl;
          return;
        } catch {
          // Paymob not configured — go to success (demo mode)
          toast('Payment gateway not configured. Demo mode — order placed!', { icon: 'ℹ️' });
        }
      }

      dispatch({ type: 'CLEAR' });
      navigate(`/order-success?id=${order.id}`);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen bg-brand-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display text-5xl tracking-widest mb-8">CHECKOUT</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <button onClick={() => i < step && setStep(i)}
                className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors ${i <= step ? 'text-black' : 'text-brand-gray-400'}`}>
                <span className={`w-7 h-7 flex items-center justify-center text-xs border-2 ${i === step ? 'bg-black text-white border-black' : i < step ? 'bg-brand-accent border-brand-accent text-black' : 'border-brand-gray-300 text-brand-gray-400'}`}>{i+1}</span>
                <span className="hidden md:block">{s}</span>
              </button>
              {i < STEPS.length - 1 && <ChevronRight size={14} className="text-brand-gray-300"/>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="bg-white p-6 space-y-4">
                <h2 className="font-display text-2xl tracking-widest">SHIPPING DETAILS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={update} className="input-field" required/></div>
                  <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={update} className="input-field" required/></div>
                </div>
                <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={update} className="input-field" required/></div>
                <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">Phone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={update} placeholder="+201xxxxxxxxx" className="input-field" required/></div>
                <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">Address *</label>
                  <input name="address" value={form.address} onChange={update} className="input-field" required/></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">Governorate *</label>
                    <select name="governorate" value={form.governorate} onChange={update} className="input-field">
                      {govs.map(g => <option key={g}>{g}</option>)}
                    </select></div>
                  <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">City</label>
                    <input name="city" value={form.city} onChange={update} className="input-field"/></div>
                </div>
                <div><label className="text-xs font-mono text-brand-gray-500 tracking-wider uppercase block mb-1">Order Notes</label>
                  <textarea name="notes" value={form.notes} onChange={update} rows={3} className="input-field resize-none" placeholder="Special instructions..."/></div>
                <button onClick={() => {
                  if (!form.firstName || !form.email || !form.phone || !form.address) { toast.error('Please fill all required fields'); return; }
                  setStep(1);
                }} className="btn-primary w-full">Continue to Payment</button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="bg-white p-6 space-y-4">
                <h2 className="font-display text-2xl tracking-widest">PAYMENT METHOD</h2>
                <div className="space-y-3">
                  {paymentMethods.map(m => (
                    <label key={m.id}
                      className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-all ${payMethod === m.id ? 'border-black' : 'border-brand-gray-200 hover:border-brand-gray-400'}`}>
                      <input type="radio" name="payment" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} className="hidden"/>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{background: m.color + '15'}}>
                        <m.icon size={20} style={{color: m.color}}/>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{m.label}</p>
                        <p className="text-xs text-brand-gray-500">{m.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${payMethod === m.id ? 'border-black' : 'border-brand-gray-300'}`}>
                        {payMethod === m.id && <div className="w-2.5 h-2.5 rounded-full bg-black"/>}
                      </div>
                    </label>
                  ))}
                </div>

                {payMethod === 'vodafone' && (
                  <div className="bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                    <strong>Vodafone Cash:</strong> You'll be redirected to enter your Vodafone number and confirm payment on the next step.
                  </div>
                )}
                {payMethod === 'instapay' && (
                  <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                    <strong>InstaPay:</strong> You'll be redirected to your bank app to confirm the transfer.
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-outline flex-1">Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="bg-white p-6 space-y-6">
                <h2 className="font-display text-2xl tracking-widest">REVIEW ORDER</h2>
                <div className="border border-brand-gray-200 p-4">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-brand-gray-500 mb-3">Shipping to</h3>
                  <p className="font-semibold">{form.firstName} {form.lastName}</p>
                  <p className="text-sm text-brand-gray-600">{form.address}, {form.city}, {form.governorate}</p>
                  <p className="text-sm text-brand-gray-600">{form.phone} | {form.email}</p>
                </div>
                <div className="border border-brand-gray-200 p-4">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-brand-gray-500 mb-3">Payment via</h3>
                  <p className="font-semibold">{paymentMethods.find(m => m.id === payMethod)?.label}</p>
                </div>
                <div className="border border-brand-gray-200 p-4 space-y-3">
                  <h3 className="text-xs font-mono tracking-widest uppercase text-brand-gray-500 mb-3">Items ({items.length})</h3>
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <img src={item.image} alt="" className="w-12 h-12 object-cover bg-brand-gray-100" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
                      <span className="flex-1">{item.name} (x{item.qty})</span>
                      <span className="font-semibold">LE {(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline flex-1">Back</button>
                  <button onClick={placeOrder} disabled={loading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> : <Lock size={14}/>}
                    Place Order — LE {total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white border border-brand-gray-200 p-6 sticky top-20">
              <h3 className="font-display text-xl tracking-widest mb-4">SUMMARY</h3>
              <div className="space-y-3 text-sm">
                {items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-brand-gray-600 truncate flex-1">{i.name} x{i.qty}</span>
                    <span className="ml-2 font-semibold">LE {(i.price * i.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-brand-gray-600">
                  <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `LE ${shipping}`}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span><span>LE {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
