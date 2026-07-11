/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onToggleFavorite,
}: ProductCardProps) {
  // Translate condition slug to display text and color
  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'brand-new':
        return { text: 'Brand New', class: 'bg-green-100 text-green-800 dark:bg-green-950/55 dark:text-green-300' };
      case 'like-new':
        return { text: 'Like New', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/55 dark:text-emerald-300' };
      case 'gently-used':
        return { text: 'Gently Used', class: 'bg-amber-100 text-amber-800 dark:bg-amber-950/55 dark:text-amber-300' };
      case 'vintage':
        return { text: 'Vintage', class: 'bg-orange-100 text-orange-800 dark:bg-orange-950/55 dark:text-orange-300' };
      default:
        return { text: 'Curated', class: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300' };
    }
  };

  const cond = getConditionLabel(product.condition);

  return (
    <motion.div
      whileHover="hover"
      className="group relative cursor-pointer bg-stone-900 rounded-none overflow-hidden border-2 border-stone-800 hover:border-[#CCFF00] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
      onClick={() => onSelect(product)}
      id={`product-card-${product.id}`}
    >
      {/* Absolute Badges on top of Image */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        <span className={`px-2.5 py-1 rounded-none text-[9px] font-mono font-bold uppercase tracking-wider ${cond.class} shadow-sm border border-black/10`}>
          {cond.text}
        </span>
        {product.featured && (
          <span className="px-2 py-1 rounded-none text-[9px] font-mono font-bold uppercase tracking-wider bg-[#CCFF00] text-black flex items-center space-x-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>GRAIL</span>
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        id={`btn-fav-${product.id}`}
        onClick={(e) => onToggleFavorite(product.id, e)}
        className="absolute top-3 right-3 z-10 p-2 rounded-none bg-black/90 text-stone-300 hover:text-rose-500 border border-stone-800 transition-colors"
        title={product.favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 hover:scale-120 ${
            product.favorite ? 'fill-rose-500 text-rose-500' : ''
          }`}
        />
      </button>

      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-950 border-b-2 border-stone-850">
        <motion.img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          variants={{
            hover: { scale: 1.15 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="object-cover w-full h-full"
        />
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <span className="px-4 py-2 bg-black border-2 border-[#CCFF00] text-[#CCFF00] font-black font-mono text-xs uppercase tracking-widest rounded-none">
              SOLD OUT
            </span>
          </div>
        )}
        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 2 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[9px] font-mono font-bold rounded-none">
            ONLY {product.stock} LEFT!
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <span className="uppercase tracking-widest">{product.category}</span>
            <span className="flex items-center space-x-0.5">
              <Star className="w-3 h-3 text-[#CCFF00] fill-[#CCFF00]" />
              <span className="font-bold text-white">{product.conditionScore}/10</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-black text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1 uppercase tracking-tight">
            {product.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1.5">
            {product.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] font-mono px-2 py-0.5 bg-stone-850 text-stone-400 rounded-none border border-stone-800"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-850">
          <div className="flex flex-col">
            <span className="text-[9px] text-stone-500 font-mono">PRICE</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-black text-[#CCFF00] font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-stone-500 font-mono line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-stone-400 group-hover:text-[#CCFF00] transition-colors font-bold uppercase">
              COP FIT
            </span>
            <div className="w-8 h-8 rounded-none bg-stone-850 border border-stone-800 flex items-center justify-center text-white group-hover:bg-[#CCFF00] group-hover:text-black transition-all duration-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
