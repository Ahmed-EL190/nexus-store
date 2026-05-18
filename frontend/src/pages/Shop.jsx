import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';

const categories = ['all', 'compressions', 'hoodies', 'shorts', 'tshirts', 'sports-bra'];
const genders = ['all', 'men', 'women'];
const sorts = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = params.get('category') || 'all';
  const gender = params.get('gender') || 'all';
  const sort = params.get('sort') || 'newest';
  const search = params.get('search') || '';
  const page = parseInt(params.get('page') || '1');

  const set = (key, val) => {
    const p = new URLSearchParams(params);
    if (val && val !== 'all') p.set(key, val); else p.delete(key);
    p.delete('page');
    setParams(p);
  };

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (category !== 'all') q.set('category', category);
    if (gender !== 'all') q.set('gender', gender);
    if (sort) q.set('sort', sort);
    if (search) q.set('search', search);
    q.set('page', page);
    q.set('limit', 12);

    axios.get(`/api/products?${q}`)
      .then(r => { setProducts(r.data?.products || []); setTotal(r.data?.total || 0); })
      .catch(() => { setProducts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [category, gender, sort, search, page]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-brand-gray-200 px-4 py-10 max-w-7xl mx-auto">
        <span className="font-mono text-xs text-brand-gray-400 tracking-widest uppercase">Browse</span>
        <h1 className="font-display text-5xl md:text-7xl tracking-widest mt-1">
          {search ? `"${search}"` : category !== 'all' ? category.toUpperCase() : gender !== 'all' ? gender.toUpperCase() : 'ALL PRODUCTS'}
        </h1>
        <p className="text-brand-gray-500 text-sm mt-2">{total} products</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Gender */}
            {genders.map(g => (
              <button key={g} onClick={() => set('gender', g)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${gender === g || (g === 'all' && !params.get('gender')) ? 'bg-brand-black text-white border-brand-black' : 'border-brand-gray-300 hover:border-brand-black'}`}>
                {g === 'all' ? 'All' : g}
              </button>
            ))}
            <span className="w-px h-6 bg-brand-gray-200 mx-1"/>
            {/* Categories */}
            {categories.map(c => (
              <button key={c} onClick={() => set('category', c)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${category === c || (c === 'all' && !params.get('category')) ? 'bg-brand-black text-white border-brand-black' : 'border-brand-gray-300 hover:border-brand-black'}`}>
                {c === 'all' ? 'All' : c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select value={sort} onChange={e => set('sort', e.target.value)}
              className="appearance-none border border-brand-gray-300 px-4 py-2 pr-8 text-xs font-semibold uppercase tracking-wider outline-none cursor-pointer bg-white">
              {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
          </div>
        </div>

        {/* Active filters */}
        {search && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-brand-gray-500">Searching: "{search}"</span>
            <button onClick={() => { const p = new URLSearchParams(params); p.delete('search'); setParams(p); }}
              className="w-5 h-5 bg-brand-gray-200 flex items-center justify-center hover:bg-brand-black hover:text-white transition-colors">
              <X size={12}/>
            </button>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-brand-gray-200"/>
                <div className="mt-3 h-4 bg-brand-gray-200 w-3/4"/>
                <div className="mt-2 h-3 bg-brand-gray-200 w-1/2"/>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-4xl text-brand-gray-300 tracking-widest">NO PRODUCTS FOUND</p>
            <p className="text-brand-gray-400 mt-3 text-sm">Try different filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(Math.ceil(total / 12))].map((_, i) => (
              <button key={i} onClick={() => { const p = new URLSearchParams(params); p.set('page', i+1); setParams(p); }}
                className={`w-10 h-10 text-sm font-semibold border ${page === i+1 ? 'bg-brand-black text-white border-brand-black' : 'border-brand-gray-300 hover:border-brand-black'}`}>
                {i+1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
