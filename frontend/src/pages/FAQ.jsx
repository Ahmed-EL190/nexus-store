import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'How long does delivery take?', a: 'Orders are processed within 1-2 business days. Delivery takes 3-5 business days across Egypt. Express shipping (1-2 days) is available for an additional fee.' },
  { q: 'What is the return/exchange policy?', a: 'We accept returns and exchanges within 14 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Sale items are final sale.' },
  { q: 'The item/size I want is out of stock — when will it restock?', a: 'Restock timelines vary by product. We recommend using the "Notify Me" option on the product page, or following our Instagram for restock announcements.' },
  { q: 'Do you have a sizing chart?', a: 'Yes! Each product page includes a detailed size guide. For compression wear, we recommend sizing up if you\'re between sizes for a more comfortable fit.' },
  { q: 'How can I track my order?', a: 'You\'ll receive a tracking link via email once your order ships. You can also check your order status using your order number on our website.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, MasterCard (via Stripe), Vodafone Cash, and InstaPay. All payments are secured with encryption.' },
  { q: 'Do you ship internationally?', a: 'Currently we ship within Egypt only. International shipping is coming soon.' },
  { q: 'How do I care for my garments?', a: 'Machine wash cold, gentle cycle. Do not bleach. Tumble dry low or hang dry. Do not iron directly on printed areas.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <span className="font-mono text-xs text-brand-gray-400 tracking-widest uppercase">Support</span>
        <h1 className="font-display text-6xl tracking-widest mt-2 mb-10">FAQ</h1>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-brand-gray-200">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="flex items-center justify-between w-full px-6 py-4 text-left font-semibold text-sm hover:bg-brand-gray-50 transition-colors">
                {faq.q}
                <ChevronDown size={18} className={`shrink-0 ml-4 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}/>
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-brand-gray-600 leading-relaxed border-t border-brand-gray-100">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
