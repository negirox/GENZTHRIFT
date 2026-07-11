/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Heart, Star, Sparkles, AlertTriangle, ShieldCheck, Shirt, Check } from 'lucide-react';
import { Product, BrowsingHistoryItem } from '../types';
import { getLocalSingleSuggestion } from '../lib/clientStylist';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onToggleFavorite: (id: string, event: React.MouseEvent) => void;
  relatedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  products?: Product[];
  history?: BrowsingHistoryItem[];
}

export default function ProductDetailModal({
  product,
  onClose,
  onToggleFavorite,
  relatedProducts,
  onSelectProduct,
  products = [],
  history = [],
}: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAddedToLook, setIsAddedToLook] = useState(false);
  const [isFittingRoomOpen, setIsFittingRoomOpen] = useState(false);

  const [suggestionText, setSuggestionText] = useState<string>('');
  const [suggestionVibe, setSuggestionVibe] = useState<string>('');
  const [loadingSuggestion, setLoadingSuggestion] = useState<boolean>(false);
  const [suggestionError, setSuggestionError] = useState<string>('');

  if (!product) return null;

  const historyProducts = React.useMemo(() => {
    if (!products || !history) return [];
    // Get up to 5 most recent history products (excluding current)
    const historyProductIds = history
      .filter((h) => h.productId !== product.id)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map((h) => h.productId);

    return products.filter((p) => historyProductIds.includes(p.id));
  }, [products, history, product.id]);

  const fetchStylingSuggestion = async () => {
    setLoadingSuggestion(true);
    setSuggestionError('');
    try {
      let response;
      try {
        response = await fetch('/api/ai/styling-suggestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product,
            historyProducts,
          }),
        });
      } catch (fetchErr) {
        console.warn('API endpoint unavailable (possibly hosted on static site like Netlify). Activating local client-side styling fallback.', fetchErr);
        const fallbackData = getLocalSingleSuggestion(product, historyProducts);
        setSuggestionText(fallbackData.suggestion);
        setSuggestionVibe(fallbackData.vibeName);
        return;
      }

      if (!response.ok) {
        console.warn(`API responded with code ${response.status}. Activating local client-side styling fallback.`);
        const fallbackData = getLocalSingleSuggestion(product, historyProducts);
        setSuggestionText(fallbackData.suggestion);
        setSuggestionVibe(fallbackData.vibeName);
        return;
      }

      try {
        const data = await response.json();
        if (data && data.suggestion) {
          setSuggestionText(data.suggestion);
          setSuggestionVibe(data.vibeName || '');
        } else {
          throw new Error('Invalid data schema from API');
        }
      } catch (jsonErr) {
        console.warn('Failed to parse API JSON. Activating local client-side styling fallback.', jsonErr);
        const fallbackData = getLocalSingleSuggestion(product, historyProducts);
        setSuggestionText(fallbackData.suggestion);
        setSuggestionVibe(fallbackData.vibeName);
      }
    } catch (err: any) {
      console.error(err);
      setSuggestionError('No cap, our styling brain got a little cooked. Reload to check the vibes!');
    } finally {
      setLoadingSuggestion(false);
    }
  };

  React.useEffect(() => {
    setSuggestionText('');
    setSuggestionVibe('');
    setSuggestionError('');
    if (product) {
      fetchStylingSuggestion();
    }
  }, [product.id]);

  const handleSizeClick = (sz: string) => {
    setSelectedSize(sz);
  };

  const handleAddToLook = () => {
    setIsAddedToLook(true);
    setTimeout(() => {
      setIsAddedToLook(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-stone-800 w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-auto animate-scaleIn">
        
        {/* Left Side: Large Image Showcase */}
        <div className="relative md:w-1/2 bg-black flex items-center justify-center p-4 min-h-[300px] md:min-h-auto border-b-2 md:border-b-0 md:border-r-2 border-stone-800">
          <button
            id="close-detail-modal-mobile"
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 z-10 p-2.5 bg-black/90 text-white border border-stone-800 hover:border-[#CCFF00]"
          >
            <X className="w-4 h-4" />
          </button>

          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover max-h-[45vh] md:max-h-[70vh] rounded-none border-2 border-stone-850"
          />

          {product.featured && (
            <span className="absolute bottom-6 left-6 px-4 py-1.5 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-widest rounded-none shadow-lg flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-black" />
              <span>THRIFT GRAIL ★</span>
            </span>
          )}
        </div>

        {/* Right Side: Info & Interactive Options */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
          {/* Top Actions for desktop */}
          <div className="hidden md:flex justify-between items-center pb-4 border-b-2 border-stone-850">
            <span className="text-xs font-mono font-black tracking-widest text-[#CCFF00] uppercase">
              Curated Vintage Apparel // LKO
            </span>
            <div className="flex items-center space-x-2">
              <button
                id="btn-fav-detail"
                onClick={(e) => onToggleFavorite(product.id, e)}
                className="p-2 bg-stone-950 border-2 border-stone-800 text-stone-300 hover:text-rose-500 hover:border-rose-500 rounded-none cursor-pointer transition-colors"
              >
                <Heart className={`w-4 h-4 ${product.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                id="close-detail-modal-desktop"
                onClick={onClose}
                className="p-2 bg-stone-950 border-2 border-stone-800 text-stone-300 hover:text-[#CCFF00] hover:border-[#CCFF00] rounded-none cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details Content */}
          <div className="space-y-5 pt-4 md:pt-4">
            {/* Title & Condition rating */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-none uppercase tracking-tighter">
                {product.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black font-mono text-[#CCFF00]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-stone-500 font-mono line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                <span className="text-stone-700">|</span>
                <div className="flex items-center space-x-1.5 text-xs font-mono">
                  <Star className="w-4 h-4 text-[#CCFF00] fill-[#CCFF00]" />
                  <span className="font-black text-white uppercase">
                    CONDITION: {product.conditionScore}/10
                  </span>
                  <span className="text-stone-450 uppercase">
                    ({product.condition.replace('-', ' ')})
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-stone-300 leading-relaxed font-sans font-medium">
              {product.description}
            </p>

            {/* Custom Interactive UX: Dynamic Fitting Room simulator */}
            <div className="bg-stone-950 p-4 rounded-none border-2 border-stone-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
                  ⚡ INSTANT STYLE BUILDER
                </span>
                <button
                  id="btn-try-on"
                  onClick={() => setIsFittingRoomOpen(!isFittingRoomOpen)}
                  className="text-xs font-mono font-black text-white hover:text-[#CCFF00] flex items-center space-x-1"
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>{isFittingRoomOpen ? 'HIDE COMBO' : 'SUGGEST COMBOS'}</span>
                </button>
              </div>

              {isFittingRoomOpen ? (
                <div className="space-y-3 animate-fadeIn text-xs font-mono text-stone-300">
                  <p>
                     LUCKNOW STREET TIP: Pair this <span className="font-black text-white uppercase">{product.title}</span> with:
                  </p>
                  <div className="flex items-center space-x-3 bg-stone-900 p-2.5 border border-stone-800">
                    <div className="w-8 h-8 bg-black border border-stone-800 flex items-center justify-center font-bold text-stone-500">
                      👖
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight">Super Baggy Cargo Denim</h4>
                      <p className="text-[10px] text-stone-500 font-sans">For that absolute authentic Gen-Z skate silhouette</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400 font-mono uppercase tracking-wider">
                  Select a size and click below to draft this outfit piece into your personalized styling report canvas.
                </p>
              )}
            </div>

            {/* AI STYLING SUGGESTION SECTION */}
            <div className="bg-gradient-to-r from-stone-900 to-black p-4 rounded-none border-2 border-stone-800 relative overflow-hidden group">
              {/* Header with Sparkles & Live Pulsing Indicator */}
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#CCFF00] animate-spin" style={{ animationDuration: '3s' }} />
                  <span>AI STYLING SUGGESTION</span>
                </span>
                {suggestionVibe && (
                  <span className="text-[9px] font-mono bg-[#CCFF00]/10 text-[#CCFF00] px-2 py-0.5 border border-[#CCFF00]/20 uppercase font-black">
                    {suggestionVibe}
                  </span>
                )}
              </div>

              {/* Body Content */}
              {loadingSuggestion ? (
                <div className="py-2.5 flex flex-col items-center justify-center space-y-2">
                  <div className="w-5 h-5 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest animate-pulse">
                    Consulting Lucknow street stylist...
                  </span>
                </div>
              ) : suggestionError ? (
                <div className="text-xs text-rose-400 font-mono flex flex-col space-y-1">
                  <span>{suggestionError}</span>
                  <button 
                    onClick={fetchStylingSuggestion}
                    className="text-[10px] text-[#CCFF00] font-black underline hover:no-underline text-left mt-1 uppercase"
                  >
                    Try Again ⚡
                  </button>
                </div>
              ) : suggestionText ? (
                <div className="space-y-2">
                  <p className="text-xs font-sans font-medium text-stone-200 leading-relaxed italic">
                    "{suggestionText}"
                  </p>
                  <div className="flex items-center space-x-1.5 text-[9px] text-stone-500 font-mono uppercase">
                    <span>AI Stylist Engine // Lucknow Edition</span>
                  </div>
                </div>
              ) : (
                <div className="py-1 text-center">
                  <button
                    onClick={fetchStylingSuggestion}
                    className="w-full py-2 bg-[#CCFF00] text-black font-mono font-black text-xs uppercase tracking-wider hover:bg-white transition-colors duration-200"
                  >
                    ✨ Ask AI Stylist for Suggestion
                  </button>
                </div>
              )}
            </div>

            {/* Size selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
                CHOOSE SIZE
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      id={`detail-size-${sz}`}
                      onClick={() => handleSizeClick(sz)}
                      className={`px-4 py-2 border-2 text-xs font-mono font-black transition-all ${
                        isSelected
                          ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                          : 'bg-stone-950 border-stone-850 text-stone-300 hover:border-[#CCFF00] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags list */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="text-[10px] font-mono uppercase font-black px-2.5 py-1 bg-stone-950 border border-stone-850 text-stone-400 rounded-none"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Checkout simulated alert or add button */}
          <div className="pt-6 border-t-2 border-stone-850 mt-6 space-y-4">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase">
              <span className="text-stone-500 font-black">AVAILABILITY:</span>
              {product.stock > 0 ? (
                product.stock < 3 ? (
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1], scale: [1, 0.97, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="text-amber-500 font-black flex items-center space-x-1.5"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>LOW STOCK // QTY: {product.stock} LEFT</span>
                  </motion.span>
                ) : (
                  <span className="text-[#CCFF00] font-black flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>IN STOCK // QTY: {product.stock}</span>
                  </span>
                )
              ) : (
                <span className="text-rose-500 font-black flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>OUT OF STOCK // SOLD OUT</span>
                </span>
              )}
            </div>

            <button
              id="btn-add-to-look-canvas"
              onClick={handleAddToLook}
              disabled={product.stock === 0}
              className={`w-full py-3.5 border-2 rounded-none font-black uppercase tracking-widest text-xs transition-all cursor-pointer ${
                isAddedToLook
                  ? 'bg-emerald-500 border-emerald-500 text-white flex items-center justify-center space-x-1.5'
                  : 'bg-[#CCFF00] border-[#CCFF00] hover:bg-[#b2dd00] hover:border-[#b2dd00] text-black disabled:bg-stone-800 disabled:border-stone-800 disabled:text-stone-550'
              }`}
            >
              {isAddedToLook ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>ADDED TO LOOK CANVAS!</span>
                </>
              ) : (
                <span>Add Apparel to Look Canvas</span>
              )}
            </button>

            {/* Related/Recommend micro section */}
            {relatedProducts.length > 0 && (
              <div className="space-y-2.5 pt-4">
                <h4 className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
                  SIMILAR VIBES IN STORE ★
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {relatedProducts.slice(0, 3).map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectProduct(rel)}
                      className="cursor-pointer group flex flex-col space-y-1.5 bg-stone-950 hover:bg-stone-900 p-2 rounded-none border-2 border-stone-850 hover:border-[#CCFF00] transition-colors"
                    >
                      <div className="aspect-square rounded-none overflow-hidden bg-black border border-stone-850">
                        <img src={rel.imageUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[10px] text-white font-serif font-black uppercase tracking-tight truncate block px-0.5">
                        {rel.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
