import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import { handleImageError, placeholderImage } from '../../utils/imageFallback';

export default function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const { dispatch } = useCart();

  const images = product?.images || [];
  const colors = product?.colors || [];
  const sizes = product?.sizes || [];

  const addToCart = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product?.id,
        name: product?.name || 'Product',
        price: product?.price ?? 0,
        image: images[0] || placeholderImage,
        color: colors[0] || '#000',
        size: sizes[Math.floor(sizes.length / 2)] || 'M',
        qty: 1
      }
    });
    toast.success(`${product?.name || 'Item'} added to cart!`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-brand-gray-100">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product?.discount > 0 && (
            <span className="bg-brand-black text-brand-white text-xs font-mono px-2 py-0.5">
              -{product.discount}%
            </span>
          )}
          {product?.badge && product.badge !== `${product.discount ?? 0}% OFF` && (
            <span className="bg-brand-accent text-brand-black text-xs font-bold px-2 py-0.5">
              {product.badge}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={15} fill={liked ? '#000' : 'none'} />
        </button>

        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden"
          onMouseEnter={() => images[1] && setImgIdx(1)}
          onMouseLeave={() => setImgIdx(0)}>
          <img
            src={images[imgIdx] || placeholderImage}
            alt={product?.name || 'Product image'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={handleImageError}
          />
        </div>

        {/* Quick add */}
        <button
          onClick={addToCart}
          className="absolute bottom-0 left-0 right-0 bg-brand-black text-brand-white py-3 text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        >
          <ShoppingBag size={14} /> Quick Add
        </button>
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <h3 className="text-sm font-semibold text-brand-black group-hover:text-brand-gray-600 transition-colors truncate">
          {product?.name || 'Product'}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">LE {(product?.price ?? 0).toLocaleString()}</span>
            {product?.originalPrice > product?.price && (
              <span className="text-xs text-brand-gray-400 line-through">LE {(product?.originalPrice ?? 0).toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star size={11} fill="#c8f542" stroke="none" />
            <span className="text-xs text-brand-gray-500">{product?.rating ?? 0}</span>
          </div>
        </div>
        {/* Color dots */}
        <div className="flex gap-1 mt-2">
          {colors.slice(0, 5).map(c => (
            <span key={c} className="w-3 h-3 rounded-full border border-brand-gray-300" style={{ background: c }} />
          ))}
          {colors.length > 5 && <span className="text-xs text-brand-gray-400">+{colors.length - 5}</span>}
        </div>
      </div>
    </Link>
  );
}
