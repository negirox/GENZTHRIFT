/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, Image as ImageIcon, Sparkles, RefreshCw, Check, AlertCircle, HelpCircle, Eye } from 'lucide-react';
import { Product } from '../types';

interface PhotoShuffleHubProps {
  products: Product[];
  onUpdateProducts: (updatedProducts: Product[]) => void;
  onResetToDefault: () => void;
}

export default function PhotoShuffleHub({ products, onUpdateProducts, onResetToDefault }: PhotoShuffleHubProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

  // 1. Local Image Shuffle: Scrambles existing product image URLs randomly across the products
  const handleLocalShuffle = () => {
    setLoading(true);
    setStatusMessage('');
    try {
      if (products.length < 2) {
        throw new Error("Add at least 2 products to shuffle images, no cap!");
      }

      // Collect all current image URLs
      const imageUrls = products.map((p) => p.imageUrl);

      // Fisher-Yates Shuffle algorithm
      const shuffledUrls = [...imageUrls];
      for (let i = shuffledUrls.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledUrls[i], shuffledUrls[j]] = [shuffledUrls[j], shuffledUrls[i]];
      }

      // Map shuffled URLs back to products
      const updatedProducts = products.map((p, idx) => ({
        ...p,
        imageUrl: shuffledUrls[idx],
      }));

      onUpdateProducts(updatedProducts);
      setStatusType('success');
      setStatusMessage('⚡ Photos scrambled! Instant streetwear mashup complete.');
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage(err.message || 'Something went cooked during shuffle.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 5000);
    }
  };

  // 2. Free API Integration: Fetch dynamic clothing images from FakeStoreAPI and apply them
  const handleFetchFakeStoreAPI = async () => {
    setLoading(true);
    setStatusMessage('Fetching fresh images from FakeStoreAPI...');
    setStatusType('');
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
        throw new Error('Failed to reach FakeStoreAPI server');
      }

      const apiProducts = await response.json();
      if (!Array.isArray(apiProducts) || apiProducts.length === 0) {
        throw new Error('Received empty or invalid data from FakeStoreAPI');
      }

      // Filter and organize API images by categories that match our stock (clothing/jewelry)
      const clothingImages = apiProducts
        .filter((item: any) => 
          item.category?.includes("clothing") || 
          item.category?.includes("jewelery")
        )
        .map((item: any) => item.image);

      if (clothingImages.length === 0) {
        throw new Error('No appropriate clothing photos found in API feed');
      }

      // Randomize the API images pool
      const shuffledApiImages = [...clothingImages].sort(() => Math.random() - 0.5);

      // Assign API photos to our local products list
      const updatedProducts = products.map((p, idx) => {
        const apiImg = shuffledApiImages[idx % shuffledApiImages.length];
        return {
          ...p,
          imageUrl: apiImg || p.imageUrl, // Fallback if undefined
        };
      });

      onUpdateProducts(updatedProducts);
      setStatusType('success');
      setStatusMessage('💎 Pulled authentic product images from FakeStoreAPI! Real drippy.');
    } catch (err: any) {
      console.error(err);
      setStatusType('error');
      setStatusMessage('Fakestore API timed out. No cap, loading premium Unsplash Streetwear backup feed instead! ⚡');
      
      // Fallback: Apply a curated list of premium streetwear Unsplash URLs
      setTimeout(() => {
        handleLoadUnsplashPremiumFeed();
      }, 1500);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 6000);
    }
  };

  // 3. Unsplash Dynamic Premium Streetwear Feed (Query-based high resolution fashion)
  const handleLoadUnsplashPremiumFeed = () => {
    setLoading(true);
    setStatusMessage('Connecting to premium Unsplash Fashion Feed...');
    try {
      // High-quality fashion/streetwear queries for each category
      const queryPools: Record<string, string[]> = {
        tee: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
        ],
        cap: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&auto=format&fit=crop&q=80'
        ],
        jeans: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1511105612662-2dc3d06e2778?w=600&auto=format&fit=crop&q=80'
        ],
        accessories: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
        ]
      };

      const updatedProducts = products.map((p) => {
        const pool = queryPools[p.category] || queryPools['accessories'];
        // Pick a random image from the pool to shuffle uniquely
        const randomImg = pool[Math.floor(Math.random() * pool.length)];
        return {
          ...p,
          imageUrl: randomImg,
        };
      });

      onUpdateProducts(updatedProducts);
      setStatusType('success');
      setStatusMessage('✨ Curated premium high-fashion feeds injected into catalog!');
    } catch (err: any) {
      setStatusType('error');
      setStatusMessage('Could not load Unsplash feed. Try local shuffle instead!');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatusMessage('');
        setStatusType('');
      }, 5000);
    }
  };

  return (
    <div className="bg-stone-900 border-2 border-stone-850 p-4 sm:p-5 rounded-none relative overflow-hidden shadow-md">
      {/* Dynamic Background Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none"></div>

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 z-10">
        
        {/* Info header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#CCFF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#CCFF00]"></span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#CCFF00] uppercase font-black flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DRIFT IMAGE ENGINE</span>
            </span>
          </div>
          <h3 className="font-serif text-xl font-black text-white uppercase tracking-tight">
            SHUFFLE & PHOTO API CONSOLE
          </h3>
          <p className="text-xs text-stone-400 font-mono">
            Scramble product photos locally or fetch real live apparel images from free APIs!
          </p>
        </div>

        {/* Console Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 1. Shuffle Button */}
          <button
            onClick={handleLocalShuffle}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-stone-950 border-2 border-stone-800 hover:border-[#CCFF00] text-stone-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Suffle photos among current items"
          >
            <Shuffle className={`w-4 h-4 text-[#CCFF00] ${loading ? 'animate-spin' : ''}`} />
            <span>Shuffle Local Photos</span>
          </button>

          {/* 2. Free API Import */}
          <button
            onClick={handleFetchFakeStoreAPI}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-stone-950 border-2 border-stone-800 hover:border-[#CCFF00] text-stone-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Import real apparel photos from free Fakestore API"
          >
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Sync FakeStoreAPI Photos</span>
          </button>

          {/* 3. Unsplash Premium Feed */}
          <button
            onClick={handleLoadUnsplashPremiumFeed}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2.5 bg-stone-950 border-2 border-stone-800 hover:border-[#CCFF00] text-stone-300 hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50"
            title="Reset & apply Unsplash high fashion photo feed"
          >
            <RefreshCw className="w-4 h-4 text-lime-400" />
            <span>High-Fashion Feed</span>
          </button>
        </div>
      </div>

      {/* Dynamic Status Ticker */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-3 border font-mono text-xs uppercase font-semibold flex items-center space-x-2.5 ${
              statusType === 'success'
                ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400'
                : 'bg-stone-950/20 border-stone-800 text-amber-400'
            }`}
          >
            {statusType === 'success' ? (
              <Check className="w-4 h-4 text-[#CCFF00]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
