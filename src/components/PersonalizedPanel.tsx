/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Eye, Heart, BarChart2, Sparkles, ShoppingBag } from 'lucide-react';
import { Product, BrowsingHistoryItem, SavedOutfit } from '../types';

interface PersonalizedPanelProps {
  products: Product[];
  history: BrowsingHistoryItem[];
  savedOutfits: SavedOutfit[];
  onToggleSavedOutfit: (outfit: Omit<SavedOutfit, 'createdAt' | 'id'> & { id?: string }) => void;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  triggerAIStylist: () => void;
  onLoadOutfit: (outfit: SavedOutfit) => void;
}

export default function PersonalizedPanel({
  products,
  history,
  savedOutfits,
  onToggleSavedOutfit,
  onSelectProduct,
  onToggleFavorite,
  triggerAIStylist,
  onLoadOutfit,
}: PersonalizedPanelProps) {
  // 1. Get recently viewed items
  const recentlyViewed = history
    .map((hist) => {
      const prod = products.find((p) => p.id === hist.productId);
      return prod ? { ...prod, lastViewed: hist.timestamp } : null;
    })
    .filter((p): p is Product & { lastViewed: number } => p !== null)
    .sort((a, b) => b.lastViewed - a.lastViewed);

  // 2. Favorite items
  const favorites = products.filter((p) => p.favorite);

  // 3. Category affinity scoring
  const categoryViews: Record<string, number> = {};
  history.forEach((hist) => {
    const prod = products.find((p) => p.id === hist.productId);
    if (prod) {
      categoryViews[prod.category] = (categoryViews[prod.category] || 0) + hist.viewCount;
    }
  });

  let favoriteCategory = '';
  let maxViews = 0;
  Object.entries(categoryViews).forEach(([cat, views]) => {
    if (views > maxViews) {
      maxViews = views;
      favoriteCategory = cat;
    }
  });

  // 4. Algorithmic Recommendations (items in their favorite category they haven't viewed, or with highest score)
  const viewedIds = new Set(history.map((h) => h.productId));
  const categoryRecommendations = products
    .filter((p) => p.category === favoriteCategory && !viewedIds.has(p.id))
    .slice(0, 3);

  const topRatedRecommendations = products
    .filter((p) => !viewedIds.has(p.id))
    .sort((a, b) => b.conditionScore - a.conditionScore)
    .slice(0, 3);

  const finalRecommendations =
    categoryRecommendations.length > 0 ? categoryRecommendations : topRatedRecommendations;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Visual Analytics Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics & Insights */}
        <div className="bg-stone-900 p-6 rounded-none border-2 border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-black text-white flex items-center space-x-2 uppercase tracking-tight">
            <BarChart2 className="w-4.5 h-4.5 text-[#CCFF00]" />
            <span>Style DNA Analysis</span>
          </h3>

          <div className="space-y-3.5 text-xs font-mono">
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Total Store Views:</span>
              <span className="font-bold text-white uppercase">{history.length} unique items</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Aesthetic Category Affinity:</span>
              <span className="font-bold text-[#CCFF00] uppercase">
                {favoriteCategory || 'Analyzing...'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400">Items Liked:</span>
              <span className="font-bold text-rose-500 uppercase">{favorites.length} pieces</span>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-stone-850">
            <button
              onClick={triggerAIStylist}
              className="w-full py-3 bg-[#CCFF00] hover:bg-[#b2dd00] text-black rounded-none font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate AI Styling Report</span>
            </button>
          </div>
        </div>

        {/* Dynamic Fallback Recommendations */}
        <div className="bg-stone-900 p-6 rounded-none border-2 border-stone-800 space-y-4">
          <h3 className="font-serif text-lg font-black text-white flex items-center space-x-2 uppercase tracking-tight">
            <Sparkles className="w-4.5 h-4.5 text-[#CCFF00]" />
            <span>Algorithmic Store Matches</span>
          </h3>

          <div className="space-y-3">
            {finalRecommendations.map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="flex items-center justify-between p-3 bg-stone-950 hover:bg-stone-850 rounded-none border-2 border-stone-850 hover:border-[#CCFF00] transition-colors cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-none overflow-hidden bg-black flex-shrink-0 border border-stone-800">
                    <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-xs text-white group-hover:text-[#CCFF00] transition-colors line-clamp-1 uppercase tracking-tight">
                      {prod.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-mono flex items-center gap-1 flex-wrap">
                      <span>₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="line-through text-stone-600">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span>•</span>
                      <span className="uppercase">{prod.category}</span>
                    </p>
                  </div>
                </div>
                <ShoppingBag className="w-3.5 h-3.5 text-stone-500 group-hover:text-[#CCFF00]" />
              </div>
            ))}

            {finalRecommendations.length === 0 && (
              <p className="text-xs text-stone-500 font-mono text-center py-6">
                Analyzing your tastes. Browse around to unlock style matches!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Recently Viewed & Liked Apparel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Viewed */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-black text-white flex items-center space-x-2 uppercase tracking-tight">
            <Eye className="w-5 h-5 text-[#CCFF00]" />
            <span>Your Browsing Footprint</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentlyViewed.slice(0, 4).map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className="cursor-pointer group bg-stone-900 p-3 rounded-none border-2 border-stone-800 hover:border-[#CCFF00] flex space-x-3 transition-colors duration-300"
              >
                <div className="w-14 h-14 rounded-none overflow-hidden bg-black flex-shrink-0 border border-stone-800">
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-between text-xs py-0.5">
                  <div>
                    <h4 className="font-serif font-black text-white group-hover:text-[#CCFF00] transition-colors truncate uppercase tracking-tight">
                      {prod.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5 flex items-center gap-1 flex-wrap">
                      <span>₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="line-through text-stone-600">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span>•</span>
                      <span className="uppercase">{prod.category}</span>
                    </p>
                  </div>
                  <span className="text-[9px] text-stone-500 font-mono uppercase">
                    Seen {new Date(prod.lastViewed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {recentlyViewed.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-stone-500 border-2 border-dashed border-stone-800 rounded-none bg-stone-900/50 font-mono uppercase">
                You haven't viewed any products in this session yet.
              </div>
            )}
          </div>
        </div>

        {/* Favorites list */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-black text-white flex items-center space-x-2 uppercase tracking-tight">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Saved Favorites</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((prod) => (
              <div
                key={prod.id}
                className="group relative bg-stone-900 p-3 rounded-none border-2 border-stone-800 hover:border-[#CCFF00] flex space-x-3 transition-colors duration-300"
              >
                <div
                  onClick={() => onSelectProduct(prod)}
                  className="w-14 h-14 rounded-none overflow-hidden bg-black flex-shrink-0 border border-stone-800 cursor-pointer"
                >
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="min-w-0 flex-1 flex flex-col justify-between text-xs py-0.5">
                  <div onClick={() => onSelectProduct(prod)} className="cursor-pointer">
                    <h4 className="font-serif font-black text-white group-hover:text-[#CCFF00] transition-colors truncate uppercase tracking-tight">
                      {prod.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5 flex items-center gap-1 flex-wrap">
                      <span>₹{prod.price.toLocaleString('en-IN')}</span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="line-through text-stone-600">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                      <span>•</span>
                      <span className="uppercase">{prod.category}</span>
                    </p>
                  </div>
                  <button
                    onClick={(e) => onToggleFavorite(prod.id, e)}
                    className="text-[9px] font-mono text-rose-500 hover:text-rose-400 font-bold uppercase text-left mt-1.5 tracking-wider"
                  >
                    Remove Saved
                  </button>
                </div>
              </div>
            ))}

            {favorites.length === 0 && (
              <div className="col-span-full py-12 text-center text-xs text-stone-500 border-2 border-dashed border-stone-800 rounded-none bg-stone-900/50 font-mono uppercase">
                Tap the heart icon on any product to save your favorites!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Outfits Section */}
      <div className="space-y-4 pt-6 border-t-2 border-stone-800">
        <h3 className="font-serif text-xl font-black text-white flex items-center space-x-2 uppercase tracking-tight">
          <Sparkles className="w-5 h-5 text-[#CCFF00]" />
          <span>Saved Outfits</span>
        </h3>

        {savedOutfits.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-500 border-2 border-dashed border-stone-800 rounded-none bg-stone-900/50 font-mono uppercase">
            No saved outfit combinations yet. Go to the Outfit Lab to assemble and favorite your favorite looks!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedOutfits.map((outfit) => {
              // Retrieve products for this outfit
              const cap = products.find((p) => p.id === outfit.capId);
              const tee = products.find((p) => p.id === outfit.teeId);
              const jeans = products.find((p) => p.id === outfit.jeansId);
              const acc = products.find((p) => p.id === outfit.accId);
              const outfitItems = [cap, tee, jeans, acc].filter((item): item is Product => !!item);

              return (
                <div
                  key={outfit.id}
                  className="bg-stone-900 border-2 border-stone-800 hover:border-[#CCFF00] p-5 transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-[#CCFF00] bg-stone-950 px-2 py-0.5 uppercase tracking-wider">
                          {outfit.slang}
                        </span>
                        <h4 className="font-serif text-lg font-black text-white uppercase tracking-tight mt-1.5">
                          {outfit.name}
                        </h4>
                        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-wider">
                          {outfit.vibe}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-xs font-mono font-bold text-lime-400 bg-stone-950 px-2 py-1 border border-stone-800">
                          Synergy: {outfit.synergyIndex}%
                        </span>
                        {outfit.discountPercent > 0 && (
                          <span className="text-[9px] text-stone-500 font-mono mt-1">
                            -{outfit.discountPercent}% Bundle Off
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-stone-400 leading-relaxed">
                      {outfit.description}
                    </p>

                    {/* Outfit Flat-Lay items preview */}
                    <div className="flex items-center gap-2 pt-2">
                      {outfitItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => onSelectProduct(item)}
                          className="w-12 h-12 bg-stone-950 border border-stone-800 hover:border-[#CCFF00] cursor-pointer transition-colors p-0.5 relative group/item"
                          title={item.title}
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[6px] text-[#CCFF00] font-mono uppercase">View</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                    <div className="font-mono text-base font-black text-[#CCFF00]">
                      ₹{outfit.price.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onLoadOutfit(outfit)}
                        className="px-3 py-1.5 bg-[#CCFF00] hover:bg-[#b2dd00] text-black font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Style Fit 🧪
                      </button>
                      <button
                        onClick={() => onToggleSavedOutfit(outfit)}
                        className="px-3 py-1.5 border border-red-500 text-red-500 hover:bg-red-500/10 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
