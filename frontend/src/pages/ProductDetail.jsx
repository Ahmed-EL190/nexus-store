import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Truck, RefreshCw, Shield, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import ProductCard from '../components/product/ProductCard';
import { handleImageError, placeholderImage } from '../utils/imageFallback';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [imgIdx, setImgIdx] = useState(0);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
  const { dispatch } = useCart();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`).then(r => {
      setProduct(r.data ?? {});
      setColor(r.data?.colors?.[0] ?? null);
      setSize(null);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      axios.get(`/api/products?category=${product.category}&limit=4`).then(r => {
        const relatedProducts = r.data?.products || [];
        setRelated(relatedProducts.filter(p => p.id !== id).slice(0, 4));
      }).catch(() => {});
    }
  }, [product]);

  const images = product.images || [];
  const colors = product.colors || [];
  const sizes = product.sizes || [];

  const addToCart = () => {
    if (!size) { toast.error('Please select a size'); return; }
    dispatch({ type: 'ADD_ITEM', payload: { id: product.id, name: product.name, price: product.price ?? 0, image: images[0] || placeholderImage, color, size, qty } });
    toast.success('Added to cart!');
  };

  const faqs = [
    { q: 'How long does delivery take?', a: '3-5 business days within Egypt. Express options available.' },
    { q: 'What is the return policy?', a: '14 days easy returns. Items must be unworn with tags attached.' },
    { q: 'How do I find my size?', a: 'Check our size guide for detailed measurements. When in doubt, size up for compressions.' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"/>
    </div>
  );
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p>Product not found</p></div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-brand-gray-400 font-mono tracking-wider mb-8">
          <Link to="/" className="hover:text-black">HOME</Link> / <Link to="/shop" className="hover:text-black">SHOP</Link> / <span className="text-black">{product.name.toUpperCase()}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square overflow-hidden bg-brand-gray-100 mb-3">
              <img src={images[imgIdx] || placeholderImage} alt={product.name || 'Product image'} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`aspect-square overflow-hidden border-2 transition-colors ${imgIdx === i ? 'border-black' : 'border-transparent'}`}>
                    <img src={img || placeholderImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.discount > 0 && <span className="bg-black text-white text-xs font-mono px-3 py-1">-{product.discount}%</span>}
              {product.badge && <span className="bg-brand-accent text-black text-xs font-bold px-3 py-1">{product.badge}</span>}
            </div>

            <div>
              <h1 className="font-display text-4xl md:text-5xl tracking-widest">{product.name?.toUpperCase() || ''}</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(product.rating || 0) ? '#c8f542' : '#e0e0e0'} stroke="none"/>)}</div>
                <span className="text-sm text-brand-gray-500">{product.rating ?? 0} ({product.reviews ?? 0} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-display text-4xl">LE {(product.price ?? 0).toLocaleString()}</span>
              {product.originalPrice > (product.price ?? 0) && (
                <span className="text-xl text-brand-gray-400 line-through">LE {(product.originalPrice ?? 0).toLocaleString()}</span>
              )}
            </div>

            <p className="text-brand-gray-600 leading-relaxed">{product.description || ''}</p>

            {/* Color */}
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-3">Color: <span className="font-bold text-black">{color}</span></p>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-black scale-110' : 'border-transparent hover:border-brand-gray-400'}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-3">Size: {!size && <span className="text-red-500">Select a size</span>}</p>
              <div className="flex gap-2 flex-wrap">
                {sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`w-12 h-12 border-2 text-sm font-semibold transition-all ${size === s ? 'bg-black text-white border-black' : 'border-brand-gray-300 hover:border-black'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add */}
            <div className="flex gap-3">
              <div className="flex border border-brand-gray-300">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-brand-gray-100 text-xl">-</button>
                <span className="w-12 h-12 flex items-center justify-center font-semibold">{qty}</span>
                <button onClick={() => setQty(q => Math.min(10, q + 1))} className="w-12 h-12 flex items-center justify-center hover:bg-brand-gray-100 text-xl">+</button>
              </div>
              <button onClick={addToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <ShoppingBag size={16}/> Add to Cart
              </button>
              <Link to="/cart" className="btn-outline hidden md:flex items-center justify-center gap-2">Buy Now</Link>
            </div>

            {/* Perks */}
            <div className="border-t border-brand-gray-200 pt-6 space-y-3">
              {[
                { icon: Truck, text: 'Free shipping over LE 1,000' },
                { icon: RefreshCw, text: '14-day easy returns' },
                { icon: Shield, text: '100% authentic & quality guaranteed' }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-brand-gray-600">
                  <Icon size={16} className="text-brand-black"/>{text}
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="border-t border-brand-gray-200 pt-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-b border-brand-gray-100 py-3">
                  <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="flex items-center justify-between w-full text-left text-sm font-semibold">
                    {faq.q} <ChevronDown size={16} className={`transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}/>
                  </button>
                  {faqOpen === i && <p className="text-sm text-brand-gray-500 mt-2 leading-relaxed">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-4xl tracking-widest mb-8">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
