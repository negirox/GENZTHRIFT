/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  category: 'tee' | 'cap' | 'jeans' | 'accessories' | 'other';
  description: string;
  price: number;
  originalPrice?: number;
  sizes: string[];
  imageUrl: string;
  condition: 'brand-new' | 'like-new' | 'gently-used' | 'vintage';
  conditionScore: number; // 1 to 10
  tags: string[];
  stock: number;
  featured?: boolean;
  viewCount: number;
  favorite?: boolean;
  createdAt?: number;
}

export interface BrowsingHistoryItem {
  productId: string;
  timestamp: number;
  viewCount: number;
}

export interface FilterState {
  search: string;
  category: string; // 'all' or specific
  size: string; // 'all' or specific
  condition: string; // 'all' or specific
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'popular' | 'condition' | 'newest';
}

export interface AIStylingResponse {
  advice: string;
  vibeName: string;
  matchedSlang: string;
  suggestedOutfitIds: string[];
}
