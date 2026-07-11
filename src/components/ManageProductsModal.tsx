/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, RotateCcw, AlertTriangle, Check, RefreshCw } from 'lucide-react';
import { Product } from '../types';

interface ManageProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'viewCount'>) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onResetToDefault: () => void;
}

export default function ManageProductsModal({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onResetToDefault,
}: ManageProductsModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'tee' | 'cap' | 'jeans' | 'accessories' | 'other'>('tee');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(999);
  const [sizes, setSizes] = useState<string[]>(['M', 'L']);
  const [imageUrl, setImageUrl] = useState('');
  const [condition, setCondition] = useState<'brand-new' | 'like-new' | 'gently-used' | 'vintage'>('brand-new');
  const [conditionScore, setConditionScore] = useState<number>(9);
  const [tags, setTags] = useState('');
  const [stock, setStock] = useState<number>(3);
  const [featured, setFeatured] = useState(false);

  // Quick image preset links for user convenience
  const imagePresets = [
    { label: 'Oversized Black Tee', url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80' },
    { label: 'Anime Pink Tee', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=80' },
    { label: 'Denim Cargo Jeans', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80' },
    { label: 'Sage Bucket Hat', url: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&auto=format&fit=crop&q=80' },
  ];

  if (!isOpen) return null;

  const handleEditClick = (prod: Product) => {
    setEditingId(prod.id);
    setTitle(prod.title);
    setCategory(prod.category);
    setDescription(prod.description);
    setPrice(prod.price);
    setSizes(prod.sizes);
    setImageUrl(prod.imageUrl);
    setCondition(prod.condition);
    setConditionScore(prod.conditionScore);
    setTags(prod.tags.join(', '));
    setStock(prod.stock);
    setFeatured(!!prod.featured);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    clearForm();
  };

  const clearForm = () => {
    setTitle('');
    setCategory('tee');
    setDescription('');
    setPrice(299);
    setSizes(['M', 'L']);
    setImageUrl('');
    setCondition('brand-new');
    setConditionScore(9);
    setTags('');
    setStock(3);
    setFeatured(false);
  };

  // Automatically adjust recommended price when category changes during new creation
  useEffect(() => {
    if (!editingId) {
      if (category === 'tee') setPrice(299);
      else if (category === 'cap') setPrice(99);
      else if (category === 'jeans') setPrice(499);
      else if (category === 'accessories') setPrice(349);
    }
  }, [category, editingId]);

  const handleToggleSize = (sz: string) => {
    if (sizes.includes(sz)) {
      setSizes(sizes.filter((s) => s !== sz));
    } else {
      setSizes([...sizes, sz]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) {
      alert('Please fill out Title, Description, and Image URL!');
      return;
    }

    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (editingId) {
      // Editing
      const originalProduct = products.find((p) => p.id === editingId);
      onUpdateProduct({
        id: editingId,
        title,
        category,
        description,
        price,
        sizes: sizes.length > 0 ? sizes : ['One Size'],
        imageUrl,
        condition,
        conditionScore,
        tags: parsedTags,
        stock,
        featured,
        viewCount: originalProduct ? originalProduct.viewCount : 0,
      });
      setEditingId(null);
    } else {
      // Adding new
      onAddProduct({
        id: 'user-prod-' + Date.now(),
        title,
        category,
        description,
        price,
        sizes: sizes.length > 0 ? sizes : ['One Size'],
        imageUrl,
        condition,
        conditionScore,
        tags: parsedTags,
        stock,
        featured,
        createdAt: Date.now(),
      });
    }

    clearForm();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-stone-900 border-2 border-stone-800 w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-none animate-scaleIn">
        {/* Header */}
        <div className="p-6 border-b-2 border-stone-850 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-black text-white uppercase tracking-tight">
              Inventory Manager ★
            </h2>
            <p className="text-[10px] text-[#CCFF00] font-mono uppercase tracking-widest mt-1">
              Add, edit, or delete local Lucknow apparel products in the mock database
            </p>
          </div>
          <button
            id="close-manage-modal"
            onClick={onClose}
            className="p-2 bg-stone-950 border-2 border-stone-800 text-stone-300 hover:text-[#CCFF00] hover:border-[#CCFF00] rounded-none cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form to Add/Edit (Left side, 5 cols) */}
          <div className="lg:col-span-5 bg-stone-950 p-5 rounded-none border-2 border-stone-800 space-y-4">
            <h3 className="font-serif text-lg font-black text-white border-b-2 border-stone-850 pb-2 flex items-center justify-between uppercase tracking-tight">
              <span>{editingId ? '⚡ Edit Apparel' : '✨ Add Product'}</span>
              {editingId && (
                <button
                  onClick={handleCancelEdit}
                  className="text-xs text-rose-500 font-mono uppercase font-black hover:underline flex items-center space-x-0.5"
                >
                  <span>Cancel Edit</span>
                </button>
              )}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Acid Wash Cropped Hoodie"
                  className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-sans font-medium"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono font-bold uppercase cursor-pointer"
                  >
                    <option value="tee">Tee</option>
                    <option value="cap">Cap</option>
                    <option value="jeans">Jeans</option>
                    <option value="accessories">Accessories</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">
                    Price (₹) <span className="text-[#CCFF00] lowercase font-normal">({category === 'accessories' ? '299-600' : category === 'tee' ? '299' : category === 'cap' ? '99' : category === 'jeans' ? '499' : '299-600'})</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell the vibe of this thrifted wear..."
                  className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-sans font-medium"
                />
              </div>

              {/* Condition & Condition Score */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono font-bold uppercase cursor-pointer"
                  >
                    <option value="brand-new">Brand New</option>
                    <option value="like-new">Like New</option>
                    <option value="gently-used">Gently Used</option>
                    <option value="vintage">Vintage</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Score /10</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={10}
                    value={conditionScore}
                    onChange={(e) => setConditionScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono font-bold"
                  />
                </div>
              </div>

              {/* Sizes (Multi-select toggles) */}
              <div className="space-y-1.5">
                <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Available Sizes</label>
                <div className="flex flex-wrap gap-1">
                  {['S', 'M', 'L', 'XL', 'One Size', '28', '30', '32', '34'].map((sz) => {
                    const isSelected = sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => handleToggleSize(sz)}
                        className={`px-2.5 py-1 text-[10px] font-mono font-black border-2 transition-colors rounded-none cursor-pointer ${
                          isSelected
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                            : 'bg-black border-stone-850 text-stone-400 hover:border-stone-700'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL & Presets */}
              <div className="space-y-1">
                <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono"
                />
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {imagePresets.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImageUrl(preset.url)}
                      className="text-[9px] px-2 py-0.5 bg-stone-900 border border-stone-800 text-stone-300 rounded-none hover:border-[#CCFF00] hover:text-white cursor-pointer font-mono"
                    >
                      Preset: {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock count */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Stock Qty</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded-none accent-[#CCFF00] cursor-pointer"
                  />
                  <label htmlFor="featured-checkbox" className="font-mono text-stone-300 cursor-pointer font-black uppercase text-[9px] tracking-wider select-none">
                    Grail Item ★
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1">
                <label className="block font-mono text-stone-400 uppercase tracking-widest text-[9px] font-black">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="baggy, vintage, skater, graphic"
                  className="w-full px-3 py-2 bg-black border-2 border-stone-850 text-white rounded-none focus:border-[#CCFF00] outline-none font-mono"
                />
              </div>

              {/* Action Trigger */}
              <button
                type="submit"
                id="btn-inventory-submit"
                className="w-full py-3 bg-[#CCFF00] hover:bg-[#b2dd00] text-black border-2 border-[#CCFF00] rounded-none font-black uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
              >
                {editingId ? <RefreshCw className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{editingId ? 'Save Product Changes' : 'Publish Product'}</span>
              </button>
            </form>
          </div>

          {/* List of current products (Right side, 7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4 h-full overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-stone-850 pb-2">
              <h3 className="font-serif text-lg font-black text-white flex items-center space-x-2 uppercase tracking-tight">
                <span>Current Catalog</span>
                <span className="px-2 py-0.5 bg-stone-950 border border-stone-800 text-stone-400 rounded-none text-xs font-mono font-black">
                  {products.length} Items
                </span>
              </h3>
              <button
                id="btn-reset-default-inventory"
                onClick={onResetToDefault}
                className="bg-stone-950 border-2 border-stone-850 text-stone-300 hover:text-[#CCFF00] hover:border-[#CCFF00] px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 rounded-none cursor-pointer transition-colors"
                title="Reset local inventory to original curated list"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Curated</span>
              </button>
            </div>

            {/* List scroll wrapper */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[50vh] lg:max-h-[58vh] pr-1.5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 bg-stone-950 hover:bg-stone-900 rounded-none border-2 border-stone-850 hover:border-[#CCFF00] transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-11 h-11 rounded-none overflow-hidden bg-black border border-stone-800 flex-shrink-0">
                      <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 text-xs">
                      <h4 className="font-serif font-black text-white truncate uppercase tracking-tight">
                        {prod.title}
                      </h4>
                      <p className="text-[10px] text-stone-450 font-mono flex items-center space-x-2 mt-0.5">
                        <span className="uppercase text-[#CCFF00] font-black">{prod.category}</span>
                        <span>•</span>
                        <span>₹{prod.price.toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>Qty: {prod.stock}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <button
                      id={`btn-edit-${prod.id}`}
                      onClick={() => handleEditClick(prod)}
                      className="p-1.5 bg-stone-900 border border-stone-850 text-stone-300 hover:text-[#CCFF00] hover:border-[#CCFF00] rounded-none cursor-pointer transition-colors"
                      title="Edit item details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-${prod.id}`}
                      onClick={() => onDeleteProduct(prod.id)}
                      className="p-1.5 bg-stone-900 border border-stone-850 text-rose-500 hover:text-rose-400 hover:border-rose-500 rounded-none cursor-pointer transition-colors"
                      title="Delete apparel item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-stone-800 rounded-none bg-stone-950 font-mono">
                  <AlertTriangle className="w-8 h-8 text-stone-600 mx-auto mb-2" />
                  <p className="text-stone-500 text-xs">No local items found. Add some GenZ clothes above!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
