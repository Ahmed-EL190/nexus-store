import { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return; }
    toast.success('Message sent! We\'ll reply within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <span className="font-mono text-xs text-brand-gray-400 tracking-widest uppercase">Reach Us</span>
        <h1 className="font-display text-6xl md:text-7xl tracking-widest mt-2 mb-12">CONTACT US</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Name *</label>
                <input name="name" value={form.name} onChange={update} className="input-field" placeholder="Your name"/>
              </div>
              <div>
                <label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Email *</label>
                <input name="email" type="email" value={form.email} onChange={update} className="input-field" placeholder="you@email.com"/>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Subject</label>
              <select name="subject" value={form.subject} onChange={update} className="input-field">
                <option value="">Select a topic</option>
                <option>Order Issue</option>
                <option>Exchange / Return</option>
                <option>Product Question</option>
                <option>Wholesale Inquiry</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Message *</label>
              <textarea name="message" value={form.message} onChange={update} rows={6} className="input-field resize-none" placeholder="How can we help you?"/>
            </div>
            <button onClick={submit} className="btn-primary w-full">Send Message</button>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl tracking-widest mb-4">GET IN TOUCH</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@yourbrand.com', href: 'mailto:hello@yourbrand.com' },
                  { icon: Phone, label: 'Phone / WhatsApp', value: '+20 100 000 0000', href: 'https://wa.me/201000000000' },
                  { icon: MapPin, label: 'Location', value: 'Cairo, Egypt', href: null },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-4 border border-brand-gray-200 hover:border-brand-black transition-colors">
                    <div className="w-10 h-10 bg-brand-accent flex items-center justify-center shrink-0">
                      <item.icon size={18}/>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-brand-gray-400 uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-semibold text-sm hover:underline">{item.value}</a>
                      ) : <p className="font-semibold text-sm">{item.value}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl tracking-widest mb-4">FOLLOW US</h3>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, label: 'Instagram', color: '#E1306C' },
                  { icon: Facebook, label: 'Facebook', color: '#1877F2' },
                  { icon: MessageCircle, label: 'TikTok', color: '#000' },
                ].map(s => (
                  <a key={s.label} href="#"
                    className="flex items-center gap-2 border border-brand-gray-200 px-4 py-3 text-sm font-semibold hover:border-brand-black hover:bg-brand-black hover:text-white transition-all">
                    <s.icon size={16}/> {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-brand-black text-white p-6">
              <h3 className="font-display text-xl tracking-widest mb-2 text-brand-accent">WORKING HOURS</h3>
              <div className="space-y-1 text-sm text-brand-gray-300">
                <div className="flex justify-between"><span>Saturday – Thursday</span><span>10:00 AM – 8:00 PM</span></div>
                <div className="flex justify-between"><span>Friday</span><span>2:00 PM – 8:00 PM</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
