/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, Tag, Shirt } from 'lucide-react';
import { FilterState } from '../types';

interface ProductFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  maxPrice: number;
}

export default function ProductFilter({
  filters,
  setFilters,
  maxPrice,
}: ProductFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: 'all', label: 'All Stuffs' },
    { value: 'tee', label: 'Tees & Tops' },
    { value: 'cap', label: 'Caps & Hats' },
    { value: 'jeans', label: 'Denim & Jeans' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'other', label: 'Gym & Others' },
  ];

  const sizes = ['all', 'S', 'M', 'L', 'XL', 'One Size', 'Adjustable', '28', '30', '32', '34'];
  const conditions = [
    { value: 'all', label: 'Any Condition' },
    { value: 'brand-new', label: 'Brand New (10/10)' },
    { value: 'like-new', label: 'Like New (9/10)' },
    { value: 'gently-used', label: 'Gently Used (8/10)' },
    { value: 'vintage', label: 'Thrift Vintage (<8/10)' },
  ];

  const handleCategorySelect = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setFilters((prev) => ({ ...prev, priceRange: [prev[0] || 0, val] }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      size: 'all',
      condition: 'all',
      priceRange: [0, maxPrice],
      sortBy: 'popular',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.size !== 'all' ||
    filters.condition !== 'all' ||
    filters.priceRange[1] < maxPrice;

  return (
    <div className="bg-stone-900 border-2 border-stone-800 rounded-none p-4 sm:p-6 space-y-4 shadow-xl transition-colors duration-300">
      {/* Category Pills (Touch Target Oriented, Great UX) */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-mono tracking-widest text-stone-500 uppercase font-black">
          CATEGORIES // CHOOSE YOUR VIBE
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                id={`filter-cat-${cat.value}`}
                onClick={() => handleCategorySelect(cat.value)}
                className={`px-4 py-2 border-2 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-none ${
                  isSelected
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00] shadow-md scale-[1.02]'
                    : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-stone-600 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Filter Row: Search & Options Trigger */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
          <input
            id="search-input"
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search retro tees, baggy cargo jeans, trucker hats..."
            className="w-full pl-10 pr-4 py-3 bg-stone-950 border-2 border-stone-800 rounded-none text-sm text-white placeholder-stone-600 focus:outline-hidden focus:border-[#CCFF00] transition-all duration-300 font-mono"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#CCFF00]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Advanced toggle */}
          <button
            id="btn-advanced-filters"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center space-x-1.5 px-4 py-3 border-2 text-sm font-black uppercase tracking-wider transition-all duration-300 rounded-none ${
              showAdvanced
                ? 'bg-white text-black border-white'
                : 'bg-stone-950 border-stone-800 text-stone-300 hover:border-[#CCFF00] hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Quick Sort Dropdown */}
          <div className="relative flex-1 md:flex-initial">
            <select
              id="sort-select"
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full md:w-48 pl-3 pr-8 py-3 bg-stone-950 border-2 border-stone-800 rounded-none text-sm font-bold text-stone-300 focus:outline-hidden focus:border-[#CCFF00] cursor-pointer appearance-none uppercase tracking-wider font-mono"
            >
              <option value="popular">🔥 Most Popular</option>
              <option value="price-asc">💵 Price: Low to High</option>
              <option value="price-desc">💎 Price: High to Low</option>
              <option value="condition">✨ Best Condition</option>
              <option value="newest">⚡ Newest Arrivals</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              id="btn-reset-filters"
              onClick={resetFilters}
              className="flex items-center justify-center p-3 text-rose-500 hover:bg-rose-950/20 rounded-none border-2 border-rose-950 transition-colors"
              title="Reset all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filter Pane */}
      {showAdvanced && (
        <div className="pt-4 border-t-2 border-stone-850 grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fadeIn">
          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-stone-500 uppercase font-black">
              <span>MAX PRICE</span>
              <span className="font-bold text-[#CCFF00]">
                ₹{filters.priceRange[1].toLocaleString('en-IN')}
              </span>
            </div>
            <input
              id="price-range-slider"
              type="range"
              min={0}
              max={maxPrice}
              step={50}
              value={filters.priceRange[1]}
              onChange={handlePriceChange}
              className="w-full h-1.5 bg-stone-800 appearance-none cursor-pointer accent-[#CCFF00]"
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-mono">
              <span>₹0</span>
              <span>₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono tracking-widest text-stone-500 uppercase font-black">
              SELECT SIZE
            </label>
            <div className="flex flex-wrap gap-1">
              {sizes.map((sz) => {
                const isSelected = filters.size === sz;
                return (
                  <button
                    key={sz}
                    id={`filter-size-${sz}`}
                    onClick={() => setFilters((prev) => ({ ...prev, size: sz }))}
                    className={`px-2.5 py-1 border text-xs font-mono font-bold transition-all duration-200 rounded-none uppercase ${
                      isSelected
                        ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-white'
                    }`}
                  >
                    {sz === 'all' ? 'ALL' : sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono tracking-widest text-stone-500 uppercase font-black">
              MIN CLOTHING CONDITION
            </label>
            <div className="grid grid-cols-1 gap-1">
              {conditions.map((cond) => {
                const isSelected = filters.condition === cond.value;
                return (
                  <button
                    key={cond.value}
                    id={`filter-cond-${cond.value}`}
                    onClick={() => setFilters((prev) => ({ ...prev, condition: cond.value }))}
                    className={`text-left px-3 py-1.5 rounded-none text-xs font-bold flex items-center justify-between transition-all duration-200 border-2 ${
                      isSelected
                        ? 'bg-[#CCFF00]/10 text-[#CCFF00] border-[#CCFF00]'
                        : 'bg-stone-950 border-stone-850 text-stone-400 hover:bg-stone-850/50 hover:text-white'
                    }`}
                  >
                    <span>{cond.label}</span>
                    {isSelected && <Tag className="w-3 h-3 text-[#CCFF00]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
