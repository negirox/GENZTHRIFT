/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Flame, HelpCircle, Heart, Star, Compass } from 'lucide-react';
import { Product, BrowsingHistoryItem, AIStylingResponse } from '../types';
import { getLocalStylingAdvice } from '../lib/clientStylist';

interface AIStylistPanelProps {
  products: Product[];
  history: BrowsingHistoryItem[];
  onSelectProduct: (product: Product) => void;
}

export default function AIStylistPanel({
  products,
  history,
  onSelectProduct,
}: AIStylistPanelProps) {
  const [loading, setLoading] = useState(false);
  const [stylingResult, setStylingResult] = useState<AIStylingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to get historical information to display
  const viewedProducts = history.map((h) => {
    const prod = products.find((p) => p.id === h.productId);
    return { ...h, product: prod };
  }).filter((h) => h.product !== undefined) as Array<BrowsingHistoryItem & { product: Product }>;

  const totalViews = viewedProducts.reduce((sum, item) => sum + item.viewCount, 0);

  // Aggregate favorite category
  const categoryCounts: Record<string, number> = {};
  viewedProducts.forEach((item) => {
    const cat = item.product.category;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + item.viewCount;
  });

  let topCategory = 'None';
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([cat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  });

  const generateStylingAdvice = async () => {
    if (history.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      // Package the user's local history logs to send to Gemini
      const simplifiedHistory = viewedProducts.map((v) => ({
        title: v.product.title,
        category: v.product.category,
        condition: v.product.condition,
        views: v.viewCount,
        tags: v.product.tags,
      }));

      // Gather current catalog titles to let Gemini suggest actual matching outfits from the store
      const catalogInfo = products.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        tags: p.tags,
      }));

      let response;
      try {
        response = await fetch('/api/ai/stylist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            history: simplifiedHistory,
            catalog: catalogInfo,
            topCategory,
          }),
        });
      } catch (fetchErr) {
        console.warn('API endpoint unavailable (possibly hosted on static site like Netlify). Activating local client-side stylist fallback.', fetchErr);
        const fallbackData = getLocalStylingAdvice(simplifiedHistory, catalogInfo, topCategory);
        setStylingResult(fallbackData);
        return;
      }

      if (!response.ok) {
        console.warn(`API responded with code ${response.status}. Activating local client-side stylist fallback.`);
        const fallbackData = getLocalStylingAdvice(simplifiedHistory, catalogInfo, topCategory);
        setStylingResult(fallbackData);
        return;
      }

      try {
        const data = await response.json();
        if (data && data.advice) {
          setStylingResult(data);
        } else {
          throw new Error('Invalid data schema from API');
        }
      } catch (jsonErr) {
        console.warn('Failed to parse API JSON. Activating local client-side stylist fallback.', jsonErr);
        const fallbackData = getLocalStylingAdvice(simplifiedHistory, catalogInfo, topCategory);
        setStylingResult(fallbackData);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Automatically trigger if history changes and we don't have advice yet
  useEffect(() => {
    if (history.length > 0 && !stylingResult && !loading) {
      generateStylingAdvice();
    }
  }, [history]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Analytics dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-stone-900 p-6 rounded-none border-2 border-stone-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
            ⚡ STYLE ENGINE STATUS
          </span>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-3xl font-black text-white font-mono uppercase tracking-tight">
              {history.length > 0 ? 'ACTIVE' : 'CALIBRATING'}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2 font-mono">
            {history.length > 0
              ? `// TRACKING ${history.length} ACTIVE CATALOG VIEW LOGS`
              : '// SELECT PRODUCTS IN CATALOG TO BOOT VIBE ENGINE'}
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-stone-900 p-6 rounded-none border-2 border-stone-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
            🔥 YOUR TOP CATEGORY
          </span>
          <div className="mt-2">
            <span className="text-2xl font-black text-white uppercase font-mono tracking-tight">
              {topCategory === 'tee' ? 'Tees & Tops 👕' : topCategory === 'cap' ? 'Caps & Hats 🧢' : topCategory === 'jeans' ? 'Denim & Cargo 👖' : topCategory === 'accessories' ? 'Accessories 🕶️' : topCategory}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2 font-mono">
            // ACCUMULATED {totalViews} VIEWS FROM LOCAL BROWSING
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-stone-900 p-6 rounded-none border-2 border-stone-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
            ✨ COHESIVE ESTHETIC MATCH
          </span>
          <div className="mt-2">
            <span className="text-xl font-black text-white uppercase tracking-tight">
              {stylingResult ? stylingResult.vibeName : 'CALIBRATING...'}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2 font-mono">
            // GENERATED REAL-TIME BY GEMINI 3.5 FLASH
          </p>
        </div>
      </div>

      {/* Main Stylist interface card */}
      <div className="bg-stone-900 border-2 border-stone-800 p-6 sm:p-8 rounded-none relative overflow-hidden shadow-2xl">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-stone-850">
          <div>
            <span className="px-3 py-1 bg-[#CCFF00] text-black text-[10px] font-black font-mono tracking-widest rounded-none uppercase">
              AI OUTFIT CONCIERGE // VIBE CHECK
            </span>
            <h3 className="font-serif text-3xl font-black text-white mt-3 uppercase tracking-tighter">
              The GenZ Outfit Matcher ★
            </h3>
            <p className="text-xs text-stone-400 mt-1 font-mono uppercase tracking-wider">
              Real-time deep parsing of your local thrift browsing history logs
            </p>
          </div>

          {history.length > 0 && (
            <button
              id="btn-re-stylist"
              onClick={generateStylingAdvice}
              disabled={loading}
              className="px-5 py-2.5 bg-[#CCFF00] hover:bg-[#b2dd00] text-black border-2 border-[#CCFF00] rounded-none text-xs font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Consulting Gemini...' : 'Recalibrate Vibe'}</span>
            </button>
          )}
        </div>

        {/* Dynamic States */}
        <div className="pt-6 relative z-10">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center space-y-4"
              >
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-stone-800 border-t-[#CCFF00] animate-spin"></div>
                  <Sparkles className="w-5 h-5 text-[#CCFF00] absolute animate-pulse" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-black text-white uppercase tracking-widest">
                    DRAFTING STYLE SLATE...
                  </h4>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto mt-2 font-mono">
                    Gemini 3.5 is analyzing product textures, tags, and condition scores to match your Lucknow street fit perfectly, no cap.
                  </p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center text-rose-500 space-y-3 text-xs font-mono"
              >
                <Flame className="w-8 h-8 mx-auto text-rose-500 animate-bounce" />
                <p className="font-bold uppercase tracking-wider">{error}</p>
                <button
                  onClick={generateStylingAdvice}
                  className="px-4 py-2 border-2 border-rose-500 bg-black text-rose-500 hover:bg-rose-500 hover:text-black font-black uppercase transition-colors rounded-none"
                >
                  Retry Stylist
                </button>
              </motion.div>
            ) : history.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center space-y-4"
              >
                <div className="w-14 h-14 bg-stone-950 flex items-center justify-center mx-auto border-2 border-stone-800 text-stone-500">
                  <Compass className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-serif text-xl font-black text-white uppercase tracking-tight">
                    No Browsing History Yet
                  </h4>
                  <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                    Go browse some t-shirts, distressed caps, and baggy skater denim in the catalog first! The styling engine needs some clicks to customize your look, zero cap!
                  </p>
                </div>
              </motion.div>
            ) : stylingResult ? (
              <motion.div
                key="result-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Vibe and slang badge */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center font-mono">
                  <div className="px-4 py-2.5 bg-stone-950 border-2 border-stone-800 rounded-none flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-xs">
                      AESTHETIC: <span className="font-black text-[#CCFF00] uppercase tracking-wider">{stylingResult.vibeName}</span>
                    </span>
                  </div>
                  <div className="px-4 py-2.5 bg-stone-950 border-2 border-stone-800 rounded-none flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#CCFF00]" />
                    <span className="text-xs">
                      SLANG VERDICT: <span className="font-black text-white italic">"{stylingResult.matchedSlang}"</span>
                    </span>
                  </div>
                </div>

                {/* Main advice text block */}
                <div className="bg-stone-950 p-6 rounded-none border-2 border-stone-800 leading-relaxed text-sm text-stone-200">
                  <p className="whitespace-pre-line font-sans font-medium">{stylingResult.advice}</p>
                </div>

                {/* Recommended Outfit layout */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase flex items-center space-x-1.5 font-black">
                    <span>★ RECOMMENDED OUTFIT COMPONENTS FROM LUCKNOW CATALOG</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products
                      .filter((p) => stylingResult.suggestedOutfitIds.includes(p.id))
                      .map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => onSelectProduct(prod)}
                          className="group cursor-pointer flex items-center space-x-3 p-3 bg-stone-950 hover:bg-stone-850 rounded-none border-2 border-stone-800 hover:border-[#CCFF00] transition-colors duration-300"
                        >
                          <div className="w-12 h-12 rounded-none overflow-hidden bg-black flex-shrink-0 border border-stone-800">
                            <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 text-xs">
                            <h5 className="font-serif font-black text-white truncate group-hover:text-[#CCFF00] uppercase transition-colors">
                              {prod.title}
                            </h5>
                            <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                              ₹{prod.price.toLocaleString('en-IN')} • {prod.category}
                            </p>
                          </div>
                        </div>
                      ))}

                    {products.filter((p) => stylingResult.suggestedOutfitIds.includes(p.id)).length === 0 && (
                      <p className="text-xs text-stone-500 italic font-mono col-span-3">
                        Gemini suggested some generic fits. Click other items in the catalog to sync your local store items!
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
