import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { handleImageError } from '../utils/imageFallback';

const HeroSlide = ({ active, slide }) => (
  <div className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className="relative h-full">
      <img src={slide.img} alt="" className="w-full h-full object-cover object-top" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-8 md:px-16 max-w-full sm:max-w-3xl md:mx-0 mx-auto text-left">
        <span className="font-mono text-brand-accent text-xs tracking-[0.3em] uppercase mb-4 animate-fade-up">{slide.tag}</span>
        <h1 className="font-display text-7xl sm:text-7xl md:text-7xl lg:text-9xl text-white leading-tight mb-6 animate-fade-up" style={{animationDelay:'0.1s'}}>
          {slide.title}
        </h1>
        <p className="text-white/70 text-lg mb-8 max-w-md animate-fade-up" style={{animationDelay:'0.2s'}}>{slide.sub}</p>
        <div className="flex gap-4 animate-fade-up" style={{animationDelay:'0.3s'}}>
          <Link to={slide.link} className="btn-accent flex items-center gap-2">{slide.cta} <ArrowRight size={16}/></Link>
          <Link to="/shop" className="border-2 border-white text-white font-body font-semibold px-8 py-3 text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all">
            Explore All
          </Link>
        </div>
      </div>
    </div>
  </div>
);

const slides = [
  {
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
    tag: 'New Collection 2024',
    title: 'BUILT FOR MOVEMENT',
    sub: 'Premium performance apparel engineered for every rep, every mile, every moment.',
    link: '/shop?gender=men',
    cta: 'Shop Men'
  },
  {
    img: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=1600&q=80',
    tag: 'Women\'s Collection',
    title: 'YOUR STYLE YOUR POWER',
    sub: 'Compression wear and lifestyle pieces designed to move with you.',
    link: '/shop?gender=women',
    cta: 'Shop Women'
  }
];

const categories = [
  { label: 'Compressions', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600', link: '/shop?category=compressions' },
  { label: 'Hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600', link: '/shop?category=hoodies' },
  { label: 'Shorts', img: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600', link: '/shop?category=shorts' },
  { label: 'Women', img: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600', link: '/shop?gender=women' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    axios.get('/api/products?featured=true&limit=6').then(r => setProducts(r.data.products)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] md:h-[90vh] md:min-h-[600px] overflow-hidden bg-black">
        {slides.map((s, i) => <HeroSlide key={i} slide={s} active={i === slide} />)}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`h-0.5 transition-all duration-300 ${i === slide ? 'w-8 bg-brand-accent' : 'w-4 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-4xl md:text-5xl tracking-widest">SHOP BY CATEGORY</h2>
          <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider hover:text-brand-gray-500 transition-colors">
            View All <ChevronRight size={16}/>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map(cat => (
            <Link key={cat.label} to={cat.link} className="group relative overflow-hidden aspect-square">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError} />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"/>
              <span className="absolute bottom-4 left-4 font-display text-2xl text-white tracking-widest uppercase">
                {cat.label}
              </span>
              <ArrowRight size={18} className="absolute bottom-5 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-xs text-brand-gray-400 tracking-widest uppercase">Handpicked</span>
            <h2 className="font-display text-4xl md:text-5xl tracking-widest mt-1">FEATURED PICKS</h2>
          </div>
          <Link to="/shop" className="btn-outline hidden md:flex items-center gap-2">Shop All <ArrowRight size={14}/></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p}/>)}
        </div>
        <div className="text-center mt-10 md:hidden">
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">Shop All <ArrowRight size={14}/></Link>
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-brand-black py-20 px-4 text-center">
        <span className="font-mono text-brand-accent text-xs tracking-widest uppercase">Reviews</span>
        <h2 className="font-display text-5xl md:text-7xl text-white tracking-widest mt-2 mb-4">LET CUSTOMERS<br/>SPEAK FOR US</h2>
        <div className="flex items-center justify-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#c8f542" stroke="none"/>)}
        </div>
        <p className="text-brand-gray-400 font-mono text-sm">From 2,953+ verified reviews</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          {[
            { name: 'Ahmed K.', text: 'Quality and fitting 10/10. Best brand in Egypt for sportswear.', rating: 5 },
            { name: 'Sara M.', text: 'Love the compression leggings! So comfortable and the quality is amazing.', rating: 5 },
            { name: 'Omar H.', text: 'Fast shipping and great customer service. Will definitely order again.', rating: 5 }
          ].map((r, i) => (
            <div key={i} className="border border-brand-gray-800 p-6 text-left">
              <div className="flex gap-1 mb-3">{[...Array(r.rating)].map((_, j) => <Star key={j} size={14} fill="#c8f542" stroke="none"/>)}</div>
              <p className="text-brand-gray-300 text-sm leading-relaxed mb-4">"{r.text}"</p>
              <p className="text-brand-gray-500 font-mono text-xs">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sale banner */}
      <section className="py-20 px-4 bg-brand-accent">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-mono text-xs tracking-widest uppercase text-brand-gray-700">Limited Time</span>
          <h2 className="font-display text-6xl md:text-8xl text-brand-black tracking-widest my-4">BUY 1 GET 1 FREE</h2>
          <p className="text-brand-gray-700 mb-8">Winter collection — all compression items. Shop now before it ends.</p>
          <Link to="/shop?badge=b1g1" className="btn-primary inline-flex items-center gap-2">Shop the Deal <ArrowRight size={16}/></Link>
        </div>
      </section>
    </div>
  );
}
