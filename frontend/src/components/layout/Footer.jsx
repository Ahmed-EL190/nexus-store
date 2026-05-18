import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="font-display text-4xl tracking-widest mb-4 text-brand-accent">NEXUS</h3>
          <p className="text-brand-gray-400 text-sm leading-relaxed">Performance apparel built for those who never stop moving. Quality, style, results.</p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="w-9 h-9 border border-brand-gray-700 flex items-center justify-center hover:border-brand-accent hover:text-brand-accent transition-colors"><Instagram size={16}/></a>
            <a href="#" className="w-9 h-9 border border-brand-gray-700 flex items-center justify-center hover:border-brand-accent hover:text-brand-accent transition-colors"><Facebook size={16}/></a>
            <a href="#" className="w-9 h-9 border border-brand-gray-700 flex items-center justify-center hover:border-brand-accent hover:text-brand-accent transition-colors"><Youtube size={16}/></a>
          </div>
        </div>

        <div>
          <h4 className="font-mono text-xs tracking-widest text-brand-gray-400 uppercase mb-4">Shop</h4>
          {['New Arrivals', 'Men', 'Women', 'Sale', 'Collections'].map(l => (
            <Link key={l} to={`/shop?cat=${l.toLowerCase().replace(' ','-')}`}
              className="block text-sm text-brand-gray-300 hover:text-brand-accent transition-colors mb-2">{l}</Link>
          ))}
        </div>

        <div>
          <h4 className="font-mono text-xs tracking-widest text-brand-gray-400 uppercase mb-4">Help</h4>
          {['FAQ', 'Exchange/Return', 'Shipping', 'Size Guide', 'Contact'].map(l => (
            <Link key={l} to={`/${l.toLowerCase().replace('/','')}`}
              className="block text-sm text-brand-gray-300 hover:text-brand-accent transition-colors mb-2">{l}</Link>
          ))}
        </div>

        <div>
          <h4 className="font-mono text-xs tracking-widest text-brand-gray-400 uppercase mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-brand-gray-300">
            <div className="flex items-center gap-2"><Mail size={14} className="text-brand-accent"/><span>hello@yourbrand.com</span></div>
            <div className="flex items-center gap-2"><Phone size={14} className="text-brand-accent"/><span>+20 100 000 0000</span></div>
            <div className="flex items-center gap-2"><MapPin size={14} className="text-brand-accent"/><span>Cairo, Egypt</span></div>
          </div>
          <div className="mt-6">
            <p className="text-xs text-brand-gray-500 mb-2 font-mono uppercase tracking-wider">Newsletter</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input placeholder="your@email.com" className="bg-brand-gray-800 border border-brand-gray-700 px-3 py-2 text-sm w-full outline-none focus:border-brand-accent text-white"/>
              <button className="w-full sm:w-auto bg-brand-accent text-brand-black px-4 py-2 text-sm font-bold hover:bg-white transition-colors">GO</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-gray-500">
          <p>© {new Date().getFullYear()} NEXUS. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>We accept:</span>
            <span className="border border-brand-gray-700 px-2 py-0.5 font-mono">VISA</span>
            <span className="border border-brand-gray-700 px-2 py-0.5 font-mono">MASTERCARD</span>
            <span className="border border-brand-gray-700 px-2 py-0.5 font-mono">VODAFONE</span>
            <span className="border border-brand-gray-700 px-2 py-0.5 font-mono">INSTAPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
