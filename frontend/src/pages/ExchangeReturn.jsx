import { Link } from 'react-router-dom';
import { RefreshCw, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

export default function ExchangeReturn() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <span className="font-mono text-xs text-brand-gray-400 tracking-widest uppercase">Policy</span>
        <h1 className="font-display text-6xl tracking-widest mt-2 mb-4">EXCHANGE & RETURN</h1>
        <p className="text-brand-gray-500 mb-12">Your satisfaction is our priority. Here's everything you need to know about our policy.</p>

        {/* Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Clock, title: '14 Days', desc: 'Return/exchange window from delivery date', color: 'bg-brand-accent' },
            { icon: Package, title: 'Original Condition', desc: 'Items must be unworn, unwashed, with tags attached', color: 'bg-brand-black text-white' },
            { icon: RefreshCw, title: 'Free Exchange', desc: 'Exchange for different size or color at no extra cost', color: 'bg-brand-gray-100' },
          ].map(item => (
            <div key={item.title} className={`p-6 ${item.color}`}>
              <item.icon size={24} className="mb-3"/>
              <h3 className="font-display text-2xl tracking-widest mb-2">{item.title}</h3>
              <p className="text-sm opacity-80">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Accepted / Not accepted */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="font-display text-3xl tracking-widest mb-4 flex items-center gap-2">
              <CheckCircle size={24} className="text-green-500"/> ACCEPTED
            </h2>
            <ul className="space-y-3 text-sm text-brand-gray-600">
              {[
                'Items returned within 14 days',
                'Unworn and unwashed items',
                'Original packaging & tags attached',
                'Defective or damaged items (contact us first)',
                'Wrong size received',
                'Wrong item received',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl tracking-widest mb-4 flex items-center gap-2">
              <XCircle size={24} className="text-red-500"/> NOT ACCEPTED
            </h2>
            <ul className="space-y-3 text-sm text-brand-gray-600">
              {[
                'Items returned after 14 days',
                'Used, washed, or worn items',
                'Missing tags or original packaging',
                'Sale / discounted items (final sale)',
                'Intimate apparel for hygiene reasons',
                'Items damaged by misuse',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"/>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How to */}
        <div className="border border-brand-gray-200 p-8 mb-8">
          <h2 className="font-display text-3xl tracking-widest mb-6">HOW TO RETURN / EXCHANGE</h2>
          <ol className="space-y-4">
            {[
              'Contact us via email or WhatsApp with your order number and reason.',
              'We\'ll review your request within 24 hours and send return instructions.',
              'Pack the item securely and ship it back to our address.',
              'Once received and inspected, we\'ll process your exchange or refund within 3-5 business days.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4 text-sm">
                <span className="w-7 h-7 bg-brand-black text-white flex items-center justify-center font-bold text-xs shrink-0">{i+1}</span>
                <p className="text-brand-gray-600 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="text-center">
          <p className="text-brand-gray-500 text-sm mb-4">Have more questions?</p>
          <Link to="/contact" className="btn-primary inline-flex">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
