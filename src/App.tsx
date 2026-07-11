/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, PlusCircle, LayoutGrid, Heart, Eye } from 'lucide-react';
import { Product, BrowsingHistoryItem, FilterState } from './types';
import { DEFAULT_PRODUCTS } from './data/defaultProducts';

// Components
import Header from './components/Header';
import Banner from './components/Banner';
import ProductFilter from './components/ProductFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ManageProductsModal from './components/ManageProductsModal';
import AIStylistPanel from './components/AIStylistPanel';
import PersonalizedPanel from './components/PersonalizedPanel';
import PhotoShuffleHub from './components/PhotoShuffleHub';
import ComplianceModal from './components/ComplianceModal';
import AdSenseBanner from './components/AdSenseBanner';
import { Shield, FileText, Info, Mail, AlertTriangle } from 'lucide-react';

export default function App() {
  // Theme state (Dark Mode by default to give a high-fashion, premium GenZ vibe)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Core products list state (backed by localStorage)
  const [products, setProducts] = useState<Product[]>([]);

  // Browsing history log state (backed by localStorage)
  const [history, setHistory] = useState<BrowsingHistoryItem[]>([]);

  // Filtering state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    size: 'all',
    condition: 'all',
    priceRange: [0, 5000], // default max boundary
    sortBy: 'popular',
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'browse' | 'recommendations'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // AdSense & Compliance states
  const [showAdSensePreview, setShowAdSensePreview] = useState<boolean>(true);
  const [complianceModalTab, setComplianceModalTab] = useState<'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer'>('privacy');
  const [isComplianceOpen, setIsComplianceOpen] = useState<boolean>(false);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('gz-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  // Sync theme class to root document body
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('gz-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('gz-theme', 'light');
    }
  }, [isDarkMode]);

  // Load products and history from local storage or defaults on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('gz-thrift-products');
    if (storedProducts) {
      try {
        const loaded: Product[] = JSON.parse(storedProducts);
        // Migrate default items to the new pricing and discount structure
        const upgraded = loaded.map((p) => {
          const defaultMatch = DEFAULT_PRODUCTS.find((dp) => dp.id === p.id);
          if (defaultMatch) {
            return {
              ...p,
              price: defaultMatch.price,
              originalPrice: defaultMatch.originalPrice,
              category: defaultMatch.category,
            };
          }
          return p;
        });
        setProducts(upgraded);
        localStorage.setItem('gz-thrift-products', JSON.stringify(upgraded));
      } catch (e) {
        setProducts(DEFAULT_PRODUCTS);
      }
    } else {
      setProducts(DEFAULT_PRODUCTS);
    }

    const storedHistory = localStorage.getItem('gz-thrift-history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  // Save products when they change
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('gz-thrift-products', JSON.stringify(newProducts));
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Manage favorite status of an item
  const handleToggleFavorite = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, favorite: !p.favorite };
      }
      return p;
    });
    saveProducts(updated);
  };

  // Track product views for personalized recommendation scoring
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);

    // Record view in browsing history log
    const now = Date.now();
    let updatedHistory = [...history];
    const existingIndex = updatedHistory.findIndex((h) => h.productId === product.id);

    if (existingIndex !== -1) {
      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        timestamp: now,
        viewCount: updatedHistory[existingIndex].viewCount + 1,
      };
    } else {
      updatedHistory.push({
        productId: product.id,
        timestamp: now,
        viewCount: 1,
      });
    }

    setHistory(updatedHistory);
    localStorage.setItem('gz-thrift-history', JSON.stringify(updatedHistory));

    // Increment viewCount on product catalog as well for popular sort
    const updatedProducts = products.map((p) => {
      if (p.id === product.id) {
        return { ...p, viewCount: p.viewCount + 1 };
      }
      return p;
    });
    saveProducts(updatedProducts);
  };

  // Inventory modifications
  const handleAddProduct = (newProduct: Omit<Product, 'viewCount'>) => {
    const fullProduct: Product = {
      ...newProduct,
      viewCount: 0,
    };
    const updated = [fullProduct, ...products];
    saveProducts(updated);
    setIsManageModalOpen(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    const updated = products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct(null);
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset your local store to the curated default inventory? This will overwrite your current inventory modifications.')) {
      saveProducts(DEFAULT_PRODUCTS);
      setHistory([]);
      localStorage.removeItem('gz-thrift-history');
      setIsManageModalOpen(false);
    }
  };

  // 1. Calculations for dynamic filter bounds
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => p.price)) : 3000;

  // Initialize filter limits dynamically if needed
  useEffect(() => {
    if (products.length > 0) {
      setFilters((prev) => ({ ...prev, priceRange: [0, maxPrice] }));
    }
  }, [products.length]);

  // 2. Perform client-side search & filters on local products
  const filteredProducts = products.filter((p) => {
    // Search match
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some((t) => t.toLowerCase().includes(searchLower));

    // Category match
    const matchesCategory = filters.category === 'all' || p.category === filters.category;

    // Size match
    const matchesSize = filters.size === 'all' || p.sizes.includes(filters.size);

    // Condition match
    let matchesCondition = true;
    if (filters.condition !== 'all') {
      if (filters.condition === 'brand-new') matchesCondition = p.condition === 'brand-new';
      else if (filters.condition === 'like-new') matchesCondition = ['brand-new', 'like-new'].includes(p.condition);
      else if (filters.condition === 'gently-used') matchesCondition = ['brand-new', 'like-new', 'gently-used'].includes(p.condition);
      else if (filters.condition === 'vintage') matchesCondition = p.condition === 'vintage';
    }

    // Price range match
    const matchesPrice = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesSize && matchesCondition && matchesPrice;
  });

  // 3. Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'condition':
        return b.conditionScore - a.conditionScore;
      case 'newest':
        return (b.createdAt || 0) - (a.createdAt || 0);
      case 'popular':
      default:
        return b.viewCount - a.viewCount;
    }
  });

  // Calculate recently viewed products based on browsing history logs
  const recentlyViewedProducts = history
    .map((hist) => {
      const prod = products.find((p) => p.id === hist.productId);
      return prod ? { ...prod, lastViewed: hist.timestamp } : null;
    })
    .filter((p): p is Product & { lastViewed: number } => p !== null)
    .sort((a, b) => b.lastViewed - a.lastViewed);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#0C0F0D] text-stone-900 dark:text-stone-100 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Universal Sticky Header */}
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        openManageModal={() => setIsManageModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          {activeTab === 'browse' ? (
            <motion.div
              key="browse-tab"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Rich visual 3D-parallax banner mimicking image */}
              <Banner />

              {/* High Performance Responsive AdSense Leaderboard Slot */}
              {showAdSensePreview && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <AdSenseBanner 
                    slotId="8472935810" 
                    format="horizontal" 
                    isPreviewMode={showAdSensePreview} 
                  />
                </div>
              )}

              {/* Browse Catalog & Filter Layout */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 dark:text-white flex items-center space-x-2">
                      <LayoutGrid className="w-6.5 h-6.5 text-emerald-800 dark:text-lime-400" />
                      <span>Lucknow Store Inventory</span>
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-mono mt-1">
                      Showing {sortedProducts.length} of {products.length} available items
                    </p>
                  </div>
                </div>

                {/* Recently Viewed Fits Horizontal Strip */}
                {recentlyViewedProducts.length > 0 && (
                  <div className="bg-stone-900 border-2 border-stone-800 p-4 sm:p-5 rounded-none relative overflow-hidden shadow-md">
                    <div className="flex items-center justify-between mb-4 border-b border-stone-850 pb-2.5">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4.5 h-4.5 text-[#CCFF00]" />
                        <h3 className="font-serif text-lg font-black text-white uppercase tracking-tight">
                          Recently Viewed Fits
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-black">
                        ★ {recentlyViewedProducts.length} Items
                      </span>
                    </div>
                    <div className="flex space-x-4 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent">
                      {recentlyViewedProducts.map((prod) => (
                        <div
                          key={`recent-${prod.id}`}
                          onClick={() => handleSelectProduct(prod)}
                          className="flex-shrink-0 w-40 bg-stone-950 border-2 border-stone-850 hover:border-[#CCFF00] p-2 transition-all duration-300 cursor-pointer group flex flex-col"
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-black border border-stone-850 mb-2">
                            <img
                              src={prod.imageUrl}
                              alt={prod.title}
                              loading="lazy"
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-350 ease-out"
                            />
                            {prod.stock === 0 && (
                              <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                                <span className="px-1.5 py-0.5 border border-[#CCFF00] text-[#CCFF00] text-[8px] font-black font-mono">
                                  SOLD OUT
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <span className="text-[8px] font-mono text-stone-400 uppercase tracking-wider block">
                                {prod.category}
                              </span>
                              <h4 className="font-serif text-xs font-black text-white group-hover:text-[#CCFF00] transition-colors truncate uppercase tracking-tight">
                                {prod.title}
                              </h4>
                            </div>
                            <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-stone-850">
                              <span className="text-[10px] font-black text-[#CCFF00] font-mono">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[8px] text-stone-500 font-mono group-hover:text-white transition-colors">
                                VIEW →
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Filter Panel */}
                <ProductFilter
                  filters={filters}
                  setFilters={setFilters}
                  maxPrice={maxPrice}
                />

                {/* Photo Shuffle & API Console Hub */}
                <PhotoShuffleHub
                  products={products}
                  onUpdateProducts={saveProducts}
                  onResetToDefault={handleResetToDefault}
                />

                {/* Products Grid */}
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2"
                >
                  <AnimatePresence mode="popLayout">
                    {sortedProducts.slice(0, 4).map((prod) => (
                      <motion.div
                        key={prod.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="h-full"
                      >
                        <ProductCard
                          product={prod}
                          onSelect={handleSelectProduct}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </motion.div>
                    ))}

                    {/* Inline Product Feed Google AdSense Banner after the 4th item (or at the end if fewer) */}
                    {showAdSensePreview && sortedProducts.length > 0 && (
                      <motion.div
                        key="adsense-inline-feed"
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="col-span-1 sm:col-span-2 lg:col-span-4 h-full"
                      >
                        <AdSenseBanner 
                          slotId="4829301822" 
                          format="horizontal" 
                          isPreviewMode={showAdSensePreview} 
                        />
                      </motion.div>
                    )}

                    {sortedProducts.slice(4).map((prod) => (
                      <motion.div
                        key={prod.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="h-full"
                      >
                        <ProductCard
                          product={prod}
                          onSelect={handleSelectProduct}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {sortedProducts.length === 0 && (
                  <div className="p-16 text-center bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-3">
                    <ShoppingBag className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
                    <h3 className="font-serif text-lg font-bold">No fits match your current filter!</h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                      Try resetting your price slider, selecting a different apparel size, or changing category pills.
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          search: '',
                          category: 'all',
                          size: 'all',
                          condition: 'all',
                          priceRange: [0, maxPrice],
                          sortBy: 'popular',
                        })
                      }
                      className="mt-4 px-4 py-2 bg-stone-900 text-white dark:bg-lime-400 dark:text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="match-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8"
            >
              {/* Personalized Dashboard */}
              <div className="space-y-1">
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 dark:text-white tracking-tight">
                  Your Personalized Match Engine
                </h2>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Customized outfit styling and shopping behavior insights backed by Gemini 3.5 Flash
                </p>
              </div>

              {/* Conversational AI stylist (reads from server.ts) */}
              <AIStylistPanel
                products={products}
                history={history}
                onSelectProduct={handleSelectProduct}
              />

              {/* Stand-alone history & favorites viewer */}
              <PersonalizedPanel
                products={products}
                history={history}
                onSelectProduct={handleSelectProduct}
                onToggleFavorite={handleToggleFavorite}
                triggerAIStylist={() => {
                  // Simply scroll up to the stylist panel or keep focus
                  const el = document.getElementById('btn-re-stylist');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                    el.click();
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={(p) => handleSelectProduct(p)}
            relatedProducts={products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id)}
            products={products}
            history={history}
          />
        )}

        {isManageModalOpen && (
          <ManageProductsModal
            isOpen={isManageModalOpen}
            onClose={() => setIsManageModalOpen(false)}
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetToDefault={handleResetToDefault}
          />
        )}

        {isComplianceOpen && (
          <ComplianceModal
            isOpen={isComplianceOpen}
            onClose={() => setIsComplianceOpen(false)}
            initialTab={complianceModalTab}
          />
        )}
      </AnimatePresence>

      {/* Footer & Compliance Hub */}
      <footer className="border-t border-stone-200 dark:border-stone-850 bg-stone-950/40 py-10 text-center font-mono text-stone-400 dark:text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* AdSense Switch Controller & Visual Feed Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px]">ADSENSE CONSOLE:</span>
            <button
              onClick={() => setShowAdSensePreview(!showAdSensePreview)}
              className={`px-3 py-1.5 border font-bold text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center space-x-1.5 ${
                showAdSensePreview 
                  ? 'bg-[#CCFF00] text-black border-[#CCFF00]' 
                  : 'bg-transparent border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
              }`}
            >
              <span>{showAdSensePreview ? '● AdSense Simulation Active' : '○ AdSense Simulation Disabled'}</span>
            </button>
            <span className="text-[10px] text-stone-600">|</span>
            <span className="text-[10px] text-stone-500">Auto-Ads Slot: #8472935810 (Responsive)</span>
          </div>

          {/* Compliance Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
            <button
              onClick={() => { setComplianceModalTab('about'); setIsComplianceOpen(true); }}
              className="hover:underline transition-all"
            >
              About Us
            </button>
            <button
              onClick={() => { setComplianceModalTab('privacy'); setIsComplianceOpen(true); }}
              className="hover:underline transition-all"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => { setComplianceModalTab('terms'); setIsComplianceOpen(true); }}
              className="hover:underline transition-all"
            >
              Terms of Service
            </button>
            <button
              onClick={() => { setComplianceModalTab('disclaimer'); setIsComplianceOpen(true); }}
              className="hover:underline transition-all"
            >
              Liability Disclaimer
            </button>
            <button
              onClick={() => { setComplianceModalTab('contact'); setIsComplianceOpen(true); }}
              className="hover:underline transition-all"
            >
              Contact Support
            </button>
          </div>

          {/* Copyright Info */}
          <div className="space-y-1.5 border-t border-stone-900 pt-6 text-[10px] text-stone-500">
            <p>© 2026 THE GENZ'S THRIFT • Lucknow Gole Market Sector-D. Sustainability is sexy, no cap.</p>
            <p className="text-[9px] text-stone-600">Optimized for Google Search index crawlers & AdSense network integration standards.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
