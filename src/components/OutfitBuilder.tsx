/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Shirt, 
  Crown, 
  Smile, 
  HelpCircle, 
  Check, 
  Trash2, 
  RefreshCw, 
  Maximize2, 
  Flame, 
  Heart, 
  ShieldCheck, 
  User, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';
import { Product, SavedOutfit } from '../types';

interface OutfitBuilderProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  savedOutfits: SavedOutfit[];
  onToggleSavedOutfit: (outfit: Omit<SavedOutfit, 'createdAt' | 'id'> & { id?: string }) => void;
  loadedOutfit?: SavedOutfit | null;
  onClearLoadedOutfit?: () => void;
}

// Predefined styling recipes based on Lucknow Gole Market inventory
interface OutfitRecipe {
  name: string;
  vibe: string;
  slang: string;
  description: string;
  capId: string;
  teeId: string;
  jeansId: string;
  accId: string;
  discountPercent: number;
}

const PRESET_RECIPES: OutfitRecipe[] = [
  {
    name: "Hazratganj Skater",
    vibe: "Retro Skateboarder Rizz",
    slang: "No Cap 🧢 • Drippy 💧",
    description: "The classic loose skater outline designed for high-heat cruising around Gole Market. Pure comfort meets street-wise credentials.",
    capId: "cap-hat",
    teeId: "tee-boxy-fit",
    jeansId: "jeans-baggy",
    accId: "acc-wallet",
    discountPercent: 15
  },
  {
    name: "Gole Market Gorpcore",
    vibe: "Tactical Utility Explorer",
    slang: "Living Rent Free 🧠 • Slay 💅",
    description: "Multiple pockets, weather-hardened textures, and heavyweight fabrics. Built to handle standard Lucknow monsoon gedi sessions in peak style.",
    capId: "cap-hat",
    teeId: "tee-oversized-shirt",
    jeansId: "jeans-cargo",
    accId: "acc-wallet",
    discountPercent: 10
  },
  {
    name: "Awadhi Heritage Grunge",
    vibe: "Classic Royalty meets Rock-and-Roll",
    slang: "Cooked 🔥 • Hazratganj Rizz ✨",
    description: "An elegant contrast. Blends classy knit polo details with legendary flared bell bottoms for that ultimate high-fashion GenZ silhouette.",
    capId: "cap-hat",
    teeId: "tee-polo",
    jeansId: "jeans-bell-bottom",
    accId: "other-gym-wears",
    discountPercent: 12
  },
  {
    name: "Bloccore Stadium Drip",
    vibe: "Retro Athletic Streetwear",
    slang: "Ate and Left No Crumbs 🍽️ • Main Character 🌟",
    description: "A gorgeous retro sport statement. Combine vintage football kit weaves with timeless straight indigo denim for maximum main character energy.",
    capId: "cap-hat",
    teeId: "tee-jersey-football",
    jeansId: "jeans-straight",
    accId: "acc-wallet",
    discountPercent: 15
  }
];

export default function OutfitBuilder({ products, onSelectProduct, savedOutfits, onToggleSavedOutfit, loadedOutfit, onClearLoadedOutfit }: OutfitBuilderProps) {
  // Current active selections in slots
  const [selectedCap, setSelectedCap] = useState<Product | null>(null);
  const [selectedTee, setSelectedTee] = useState<Product | null>(null);
  const [selectedJeans, setSelectedJeans] = useState<Product | null>(null);
  const [selectedAcc, setSelectedAcc] = useState<Product | null>(null);

  // Active slot we are editing/browsing options for
  const [activeSlotSelection, setActiveSlotSelection] = useState<'cap' | 'tee' | 'jeans' | 'accessories' | null>(null);

  // Try-On Fitting Room Modal State
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [avatarGender, setAvatarGender] = useState<'neutral' | 'retro' | 'wireframe'>('neutral');
  const [showWebcamMirror, setShowWebcamMirror] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationName, setReservationName] = useState('');

  // Toast notifications for user experience
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automatically trigger a toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Group our inventory into matching slots
  const capsList = products.filter(p => p.category === 'cap' && p.stock > 0);
  const teesList = products.filter(p => p.category === 'tee' && p.stock > 0);
  const jeansList = products.filter(p => p.category === 'jeans' && p.stock > 0);
  const accList = products.filter(p => (p.category === 'accessories' || p.category === 'other') && p.stock > 0);

  // Set default initial state: load the first recipe
  useEffect(() => {
    loadRecipe(PRESET_RECIPES[0], false);
  }, [products.length]);

  // Load a deep linked/saved outfit combo
  useEffect(() => {
    if (loadedOutfit) {
      const cap = products.find(p => p.id === loadedOutfit.capId) || null;
      const tee = products.find(p => p.id === loadedOutfit.teeId) || null;
      const jeans = products.find(p => p.id === loadedOutfit.jeansId) || null;
      const acc = products.find(p => p.id === loadedOutfit.accId) || null;
      
      setSelectedCap(cap);
      setSelectedTee(tee);
      setSelectedJeans(jeans);
      setSelectedAcc(acc);

      triggerToast(`Loaded "${loadedOutfit.name}" Outfit! ⚡`);
      
      if (onClearLoadedOutfit) {
        onClearLoadedOutfit();
      }
    }
  }, [loadedOutfit, products, onClearLoadedOutfit]);

  // Load a preset recipe
  const loadRecipe = (recipe: OutfitRecipe, showToast = true) => {
    const cap = products.find(p => p.id === recipe.capId) || null;
    const tee = products.find(p => p.id === recipe.teeId) || null;
    const jeans = products.find(p => p.id === recipe.jeansId) || null;
    const acc = products.find(p => p.id === recipe.accId) || null;

    setSelectedCap(cap);
    setSelectedTee(tee);
    setSelectedJeans(jeans);
    setSelectedAcc(acc);

    if (showToast) {
      triggerToast(`Loaded "${recipe.name}" Preset Combo!`);
    }
  };

  // Auto-randomize/shuffle pieces
  const handleRandomizeOutfit = () => {
    const cap = capsList.length > 0 ? capsList[Math.floor(Math.random() * capsList.length)] : null;
    const tee = teesList.length > 0 ? teesList[Math.floor(Math.random() * teesList.length)] : null;
    const jeans = jeansList.length > 0 ? jeansList[Math.floor(Math.random() * jeansList.length)] : null;
    const acc = accList.length > 0 ? accList[Math.floor(Math.random() * accList.length)] : null;

    setSelectedCap(cap);
    setSelectedTee(tee);
    setSelectedJeans(jeans);
    setSelectedAcc(acc);

    triggerToast("Randomized Outfit! Pure Lucknow Rizz generated. ✨");
  };

  // Reset all slots
  const handleClearOutfit = () => {
    setSelectedCap(null);
    setSelectedTee(null);
    setSelectedJeans(null);
    setSelectedAcc(null);
    triggerToast("Cleared Outfit Slots. Build your own drip!");
  };

  // Active items sum & metrics calculations
  const selectedItems = [selectedCap, selectedTee, selectedJeans, selectedAcc].filter((item): item is Product => item !== null);
  const basePriceSum = selectedItems.reduce((acc, item) => acc + item.price, 0);
  
  // Calculate a bundle discount: 10% off for 2 items, 15% off for 3, 20% off for 4 items
  const getBundleDiscountPercent = () => {
    const count = selectedItems.length;
    if (count === 4) return 20;
    if (count === 3) return 15;
    if (count === 2) return 10;
    return 0;
  };
  const discountPercent = getBundleDiscountPercent();
  const discountAmount = Math.round(basePriceSum * (discountPercent / 100));
  const finalPrice = basePriceSum - discountAmount;

  // Average condition score for quality gauge
  const avgConditionScore = selectedItems.length > 0 
    ? Math.round((selectedItems.reduce((acc, item) => acc + item.conditionScore, 0) / selectedItems.length) * 10) / 10
    : 0;

  // Styling Synergy Index based on tag overlaps and conditions
  const calculateSynergyIndex = () => {
    if (selectedItems.length === 0) return 0;
    let base = 50; // default start
    
    // Add points for matching tags
    const allTags = selectedItems.flatMap(item => item.tags);
    const uniqueTags = new Set(allTags);
    const duplicatesCount = allTags.length - uniqueTags.size;
    base += duplicatesCount * 12; // Tag match bonus!

    // Balance score based on average condition score
    base += (avgConditionScore - 7) * 8;

    // Vintage/Retro tag synergy
    const vintageCount = selectedItems.filter(item => item.condition === 'vintage').length;
    if (vintageCount >= 2) base += 15;

    // Cap the value between 40 and 100
    return Math.min(100, Math.max(40, Math.round(base)));
  };
  const synergyIndex = calculateSynergyIndex();

  // Personalized verbal rating from Lucknow local street council
  const getDripVerdict = (score: number) => {
    if (selectedItems.length === 0) return "Choose items to begin styling.";
    if (score >= 90) return "ELITE LUCKNOW RIZZ! This fit has Hazratganj staring in awe. No cap, you literally ate and left absolutely zero crumbs! 💅💧";
    if (score >= 75) return "drippy aesthetic! Extremely clean alignment. The local streetwear rivalries are officially cooked. 🧢🔥";
    if (score >= 60) return "Respectable streetwear drape. Balanced comfort. Sits nicely for an evening Sharma Ji Ki Chai stroll.";
    return "A bit chaotic, but fashion is about breaking rules! Consider swapping for a baggy cargo or distressed vintage tee to secure the rizz.";
  };

  // Trigger try on simulation
  const handleTryOn = () => {
    if (selectedItems.length === 0) {
      triggerToast("Please add at least one piece to try on the fit!");
      return;
    }
    setIsTryOnOpen(true);
    setIsScanning(true);
    setReservationSuccess(false);
    
    // Simulate active scan for 1.6 seconds
    setTimeout(() => {
      setIsScanning(false);
    }, 1600);
  };

  // Confirm booking reservation
  const handleReserveOutfit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationName.trim()) return;
    setReservationSuccess(true);
    triggerToast(`Drip Reserved for ${reservationName}! ⚡`);
  };

  // Check if current active selection is favorited
  const isActiveFitFavorite = selectedItems.length > 0 && savedOutfits && savedOutfits.some((o) => {
    return o.capId === (selectedCap?.id || '') &&
           o.teeId === (selectedTee?.id || '') &&
           o.jeansId === (selectedJeans?.id || '') &&
           o.accId === (selectedAcc?.id || '');
  });

  const handleToggleRecipeFavorite = (recipe: OutfitRecipe, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent loading the recipe
    
    // Find the products for this recipe to compute price & synergy
    const cap = products.find(p => p.id === recipe.capId) || null;
    const tee = products.find(p => p.id === recipe.teeId) || null;
    const jeans = products.find(p => p.id === recipe.jeansId) || null;
    const acc = products.find(p => p.id === recipe.accId) || null;
    
    const items = [cap, tee, jeans, acc].filter((item): item is Product => item !== null);
    const basePrice = items.reduce((accPrice, item) => accPrice + item.price, 0);
    const discount = recipe.discountPercent;
    const finalPrice = basePrice - Math.round(basePrice * (discount / 100));
    
    // Compute synergy index
    let synergy = 50;
    if (items.length > 0) {
      const avgCond = items.reduce((accC, item) => accC + item.conditionScore, 0) / items.length;
      const allTags = items.flatMap(item => item.tags);
      const uniqueTags = new Set(allTags);
      const duplicatesCount = allTags.length - uniqueTags.size;
      synergy += duplicatesCount * 12;
      synergy += (avgCond - 7) * 8;
      const vintageCount = items.filter(item => item.condition === 'vintage').length;
      if (vintageCount >= 2) synergy += 15;
      synergy = Math.min(100, Math.max(40, Math.round(synergy)));
    }

    onToggleSavedOutfit({
      name: recipe.name,
      vibe: recipe.vibe,
      slang: recipe.slang,
      description: recipe.description,
      capId: recipe.capId,
      teeId: recipe.teeId,
      jeansId: recipe.jeansId,
      accId: recipe.accId,
      discountPercent: recipe.discountPercent,
      synergyIndex: synergy,
      price: finalPrice
    });
  };

  const handleToggleActiveFitFavorite = () => {
    if (selectedItems.length === 0) return;

    // Check if it exactly matches a preset recipe
    const matchingPreset = PRESET_RECIPES.find(recipe => 
      recipe.capId === (selectedCap?.id || '') &&
      recipe.teeId === (selectedTee?.id || '') &&
      recipe.jeansId === (selectedJeans?.id || '') &&
      recipe.accId === (selectedAcc?.id || '')
    );

    if (matchingPreset) {
      // Toggle using the preset recipe details
      onToggleSavedOutfit({
        name: matchingPreset.name,
        vibe: matchingPreset.vibe,
        slang: matchingPreset.slang,
        description: matchingPreset.description,
        capId: matchingPreset.capId,
        teeId: matchingPreset.teeId,
        jeansId: matchingPreset.jeansId,
        accId: matchingPreset.accId,
        discountPercent: matchingPreset.discountPercent,
        synergyIndex: synergyIndex,
        price: finalPrice
      });
      return;
    }

    // Otherwise, toggle as a custom outfit combination
    const existingCustom = savedOutfits && savedOutfits.find(o => 
      o.capId === (selectedCap?.id || '') &&
      o.teeId === (selectedTee?.id || '') &&
      o.jeansId === (selectedJeans?.id || '') &&
      o.accId === (selectedAcc?.id || '')
    );

    if (existingCustom) {
      onToggleSavedOutfit(existingCustom);
    } else {
      // Generate a nice Gen Z custom style name
      const teeWord = selectedTee ? selectedTee.title.split(' ')[0] : 'Street';
      const jeansWord = selectedJeans ? selectedJeans.title.split(' ')[0] : 'Cargo';
      const name = `${teeWord} x ${jeansWord} Custom Combo`;
      const vibe = "Personalized Custom Layering";
      const slang = "No Cap 🧢 • Flexing 💪";
      const description = `A custom Gole Market look featuring ${selectedTee ? selectedTee.title : 'no upper'}, paired with ${selectedJeans ? selectedJeans.title : 'no bottoms'}, and accessorized with ${selectedAcc ? selectedAcc.title : 'no accessories'}.`;

      onToggleSavedOutfit({
        name,
        vibe,
        slang,
        description,
        capId: selectedCap?.id,
        teeId: selectedTee?.id,
        jeansId: selectedJeans?.id,
        accId: selectedAcc?.id,
        discountPercent: discountPercent,
        synergyIndex: synergyIndex,
        price: finalPrice
      });
    }
  };

  return (
    <div className="space-y-8 bg-stone-50 dark:bg-[#080a09] py-8 border-t border-stone-200 dark:border-stone-900 transition-colors duration-300">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#CCFF00] text-black px-6 py-3 font-mono font-bold text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000000] flex items-center space-x-2"
          >
            <Sparkles className="w-4.5 h-4.5 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Module Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-stone-200 dark:border-stone-850 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#CCFF00] text-black text-[9px] font-mono font-bold uppercase tracking-wider">
                Interactive Lab
              </span>
              <span className="text-stone-500 font-mono text-[10px]">LUCKNOW SECTOR-D</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-stone-900 dark:text-white uppercase tracking-tight flex items-center space-x-3">
              <Crown className="w-8 h-8 text-[#CCFF00] animate-pulse" />
              <span>Gole Market Outfit Builder</span>
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-3xl">
              Assemble high-vis thrift grails together. Swap pieces dynamically, calculate stackable combo discounts up to 20%, verify your match score, and step into the Virtual Try-On Mirror!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRandomizeOutfit}
              className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-850 hover:bg-[#CCFF00] hover:text-black transition-all border border-stone-800 font-mono text-[11px] font-bold uppercase tracking-wider flex items-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Randomize Fit</span>
            </button>
            <button
              onClick={handleClearOutfit}
              className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 transition-all font-mono text-[11px] font-bold uppercase tracking-wider flex items-center space-x-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Grid</span>
            </button>
          </div>
        </div>

        {/* 1. Preset Style Recipes Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#CCFF00]" />
            <h3 className="font-serif text-lg font-black uppercase tracking-tight text-stone-900 dark:text-white">
              Curated Style Recipes (Quick Load)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_RECIPES.map((recipe) => {
              const isRecipeFavorited = savedOutfits && savedOutfits.some((o) => o.name === recipe.name);
              return (
                <div
                  key={recipe.name}
                  onClick={() => loadRecipe(recipe)}
                  className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-850 hover:border-[#CCFF00] p-4 cursor-pointer transition-all duration-300 group flex flex-col justify-between animate-fadeIn"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-[#CCFF00] bg-stone-950 px-2 py-0.5 uppercase">
                        {recipe.slang}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-stone-400 font-mono">
                          -{recipe.discountPercent}% Off
                        </span>
                        <button
                          id={`fav-recipe-${recipe.name.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={(e) => handleToggleRecipeFavorite(recipe, e)}
                          className="p-1 text-stone-400 hover:text-rose-500 transition-colors duration-200"
                          title={isRecipeFavorited ? "Remove from Saved Outfits" : "Save Outfit"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isRecipeFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-serif text-base font-black text-stone-900 dark:text-white uppercase tracking-tight group-hover:text-[#CCFF00] transition-colors">
                      {recipe.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-mono tracking-wider uppercase text-[#CCFF00]/90">
                      {recipe.vibe}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-850 flex items-center justify-between">
                    <span className="text-[9px] font-mono font-black text-stone-400 uppercase tracking-widest group-hover:text-white">
                      SELECT COMBO →
                    </span>
                    <div className="w-6 h-6 rounded-none bg-stone-100 dark:bg-stone-850 border border-stone-300 dark:border-stone-800 flex items-center justify-center group-hover:bg-[#CCFF00] group-hover:text-black transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Interactive Workshop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Live Flat-lay & Synergy Board (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-850 p-6 space-y-6">
            
            <div className="border-b border-stone-200 dark:border-stone-850 pb-4">
              <h3 className="font-serif text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
                Outfit Flat-Lay Preview
              </h3>
              <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                Visualizing active combination layers
              </p>
            </div>

            {/* Collage Canvas Representation */}
            <div className="aspect-[4/5] bg-stone-100 dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-850 relative p-6 flex flex-col justify-between overflow-hidden">
              
              {/* Retro high tech grids */}
              <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
              
              {/* Overlay stats badges */}
              <div className="absolute top-4 left-4 z-15 flex flex-col gap-1 items-start font-mono text-[9px] font-bold">
                <span className="bg-black/90 text-[#CCFF00] px-2 py-0.5 border border-stone-800 uppercase tracking-wider">
                  Synergy: {synergyIndex}%
                </span>
                <span className="bg-black/90 text-white px-2 py-0.5 border border-stone-800 uppercase tracking-wider">
                  Quality: {avgConditionScore}/10
                </span>
              </div>

              {selectedItems.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <Shirt className="w-12 h-12 text-stone-300 dark:text-stone-700 animate-bounce" />
                  <p className="font-serif text-base font-black uppercase text-stone-400 dark:text-stone-600">
                    Your styling board is bare!
                  </p>
                  <p className="text-[10px] font-mono text-stone-500 max-w-xs uppercase tracking-wider">
                    Select fits from the slot drawer on the right or randomize to begin.
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col justify-between relative z-10 py-4">
                  
                  {/* Layer 1: Headwear */}
                  <div className="flex justify-center h-20 relative">
                    {selectedCap ? (
                      <motion.div 
                        layoutId="board-cap"
                        onClick={() => onSelectProduct(selectedCap)}
                        className="w-20 h-20 bg-stone-900 border-2 border-stone-800 hover:border-[#CCFF00] transition-colors p-1 cursor-pointer relative shadow-md"
                        title={selectedCap.title}
                      >
                        <img src={selectedCap.imageUrl} alt={selectedCap.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black text-[#CCFF00] text-[7px] px-1 font-mono">
                          CAP
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed border-stone-300 dark:border-stone-800 flex items-center justify-center text-stone-500 font-mono text-[9px] uppercase tracking-wider">
                        No Cap
                      </div>
                    )}
                  </div>

                  {/* Layer 2: Top / Shirt */}
                  <div className="flex justify-center h-28 relative">
                    {selectedTee ? (
                      <motion.div 
                        layoutId="board-tee"
                        onClick={() => onSelectProduct(selectedTee)}
                        className="w-28 h-28 bg-stone-900 border-2 border-stone-800 hover:border-[#CCFF00] transition-colors p-1 cursor-pointer relative shadow-md"
                        title={selectedTee.title}
                      >
                        <img src={selectedTee.imageUrl} alt={selectedTee.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black text-[#CCFF00] text-[7px] px-1 font-mono">
                          TOP
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-28 h-28 border-2 border-dashed border-stone-300 dark:border-stone-800 flex items-center justify-center text-stone-500 font-mono text-[9px] uppercase tracking-wider">
                        No Top
                      </div>
                    )}
                  </div>

                  {/* Layer 3: Bottom / Jeans */}
                  <div className="flex justify-center h-32 relative">
                    {selectedJeans ? (
                      <motion.div 
                        layoutId="board-jeans"
                        onClick={() => onSelectProduct(selectedJeans)}
                        className="w-28 h-32 bg-stone-900 border-2 border-stone-800 hover:border-[#CCFF00] transition-colors p-1 cursor-pointer relative shadow-md"
                        title={selectedJeans.title}
                      >
                        <img src={selectedJeans.imageUrl} alt={selectedJeans.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black text-[#CCFF00] text-[7px] px-1 font-mono">
                          BOTTOM
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-28 h-32 border-2 border-dashed border-stone-300 dark:border-stone-800 flex items-center justify-center text-stone-500 font-mono text-[9px] uppercase tracking-wider">
                        No Jeans
                      </div>
                    )}
                  </div>

                  {/* Layer 4: Accessory */}
                  <div className="absolute bottom-4 right-4">
                    {selectedAcc ? (
                      <motion.div 
                        layoutId="board-acc"
                        onClick={() => onSelectProduct(selectedAcc)}
                        className="w-16 h-16 bg-stone-900 border-2 border-stone-800 hover:border-[#CCFF00] transition-colors p-1 cursor-pointer relative shadow-md"
                        title={selectedAcc.title}
                      >
                        <img src={selectedAcc.imageUrl} alt={selectedAcc.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black text-[#CCFF00] text-[7px] px-1 font-mono">
                          ACC
                        </span>
                      </motion.div>
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-stone-300 dark:border-stone-800 flex items-center justify-center text-stone-500 font-mono text-[9px] uppercase tracking-wider">
                        No Acc
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Calculations and Try-On trigger */}
            <div className="space-y-4 bg-stone-100 dark:bg-stone-950 p-4 border border-stone-200 dark:border-stone-850">
              
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-500">BASE PRICE</span>
                <span className="font-bold text-stone-900 dark:text-stone-200">
                  ₹{basePriceSum.toLocaleString('en-IN')}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-lime-400 font-bold">
                  <span>COMBO BUNDLE DISCOUNT (-{discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between pt-2 border-t border-stone-300 dark:border-stone-800">
                <span className="font-serif text-sm font-black text-stone-900 dark:text-white uppercase">
                  TOTAL BUNDLE COST
                </span>
                <span className="font-mono text-xl font-black text-[#CCFF00]">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Style Feedback speech-bubble */}
              {selectedItems.length > 0 && (
                <div className="bg-white dark:bg-stone-900 p-3 text-xs border-l-2 border-[#CCFF00] leading-relaxed">
                  <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-stone-400 font-mono">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>LUCKNOW STYLE VERDICT</span>
                  </div>
                  <p className="text-stone-800 dark:text-stone-200">
                    {getDripVerdict(synergyIndex)}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  id="btn-trigger-tryon"
                  onClick={handleTryOn}
                  disabled={selectedItems.length === 0}
                  className={`flex-1 py-3.5 font-mono text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 flex items-center justify-center space-x-2 ${
                    selectedItems.length > 0
                      ? 'bg-[#CCFF00] border-[#CCFF00] text-black hover:bg-black hover:text-[#CCFF00] hover:border-white shadow-md'
                      : 'bg-stone-200 dark:bg-stone-850 border-transparent text-stone-400 dark:text-stone-650 cursor-not-allowed'
                  }`}
                >
                  <Maximize2 className="w-4 h-4 animate-pulse" />
                  <span>TRY ON THIS FIT ✨</span>
                </button>

                <button
                  id="btn-favorite-active-fit"
                  onClick={handleToggleActiveFitFavorite}
                  disabled={selectedItems.length === 0}
                  className={`px-4 py-3.5 border-2 transition-all duration-300 flex items-center justify-center ${
                    selectedItems.length > 0
                      ? isActiveFitFavorite
                        ? 'bg-rose-500 border-rose-500 text-white hover:bg-rose-600 shadow-md'
                        : 'bg-stone-900 border-stone-800 text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black hover:border-white shadow-md'
                      : 'bg-stone-200 dark:bg-stone-850 border-transparent text-stone-400 dark:text-stone-650 cursor-not-allowed'
                  }`}
                  title={isActiveFitFavorite ? "Remove from Saved Outfits" : "Favorite this Outfit Combo"}
                >
                  <Heart className={`w-4.5 h-4.5 ${isActiveFitFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

          </div>

          {/* RIGHT: Category Slot Selectors (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-850 p-6">
              
              <div className="border-b border-stone-200 dark:border-stone-850 pb-4 mb-6">
                <h3 className="font-serif text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
                  Outfit Component Slots
                </h3>
                <p className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                  Tap edit on any slot to browse the active Lucknow Gole Market inventory
                </p>
              </div>

              {/* Slots List */}
              <div className="space-y-4">
                
                {/* 1. Cap Slot */}
                <div className={`border-2 p-3 transition-colors ${
                  activeSlotSelection === 'cap' 
                    ? 'border-[#CCFF00] bg-stone-50 dark:bg-stone-950/40' 
                    : 'border-stone-200 dark:border-stone-850'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-500">
                        {selectedCap ? (
                          <img src={selectedCap.imageUrl} alt={selectedCap.title} className="w-full h-full object-cover" />
                        ) : (
                          'CAP'
                        )}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#CCFF00]">
                          Headwear / Cap
                        </h4>
                        <p className="text-sm font-black text-stone-900 dark:text-white uppercase">
                          {selectedCap ? selectedCap.title : 'No Headwear Selected'}
                        </p>
                        {selectedCap && (
                          <span className="text-xs font-mono font-bold text-[#CCFF00]">
                            ₹{selectedCap.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedCap && (
                        <button
                          onClick={() => setSelectedCap(null)}
                          className="p-2 border border-stone-300 dark:border-stone-800 text-stone-400 hover:text-red-500 hover:border-red-500/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setActiveSlotSelection(activeSlotSelection === 'cap' ? null : 'cap')}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          activeSlotSelection === 'cap'
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                            : 'bg-stone-100 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#CCFF00]'
                        }`}
                      >
                        {activeSlotSelection === 'cap' ? 'CLOSE' : 'CHOOSE'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Selectors Grid */}
                  <AnimatePresence>
                    {activeSlotSelection === 'cap' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 pt-3 border-t border-stone-200 dark:border-stone-800"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {capsList.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedCap(item);
                                setActiveSlotSelection(null);
                                triggerToast(`Selected ${item.title}`);
                              }}
                              className={`p-2 border cursor-pointer transition-colors flex items-center space-x-2 ${
                                selectedCap?.id === item.id 
                                  ? 'border-[#CCFF00] bg-stone-950' 
                                  : 'border-stone-200 dark:border-stone-800 hover:border-[#CCFF00] bg-stone-100 dark:bg-stone-900/30'
                              }`}
                            >
                              <img src={item.imageUrl} alt={item.title} className="w-8 h-8 object-cover" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[10px] uppercase font-bold text-stone-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                                <p className="text-[9px] font-mono text-[#CCFF00]">₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. Tee Slot */}
                <div className={`border-2 p-3 transition-colors ${
                  activeSlotSelection === 'tee' 
                    ? 'border-[#CCFF00] bg-stone-50 dark:bg-stone-950/40' 
                    : 'border-stone-200 dark:border-stone-850'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-500">
                        {selectedTee ? (
                          <img src={selectedTee.imageUrl} alt={selectedTee.title} className="w-full h-full object-cover" />
                        ) : (
                          'TEE'
                        )}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#CCFF00]">
                          Tee / Shirt / Upper
                        </h4>
                        <p className="text-sm font-black text-stone-900 dark:text-white uppercase">
                          {selectedTee ? selectedTee.title : 'No Top Selected'}
                        </p>
                        {selectedTee && (
                          <span className="text-xs font-mono font-bold text-[#CCFF00]">
                            ₹{selectedTee.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedTee && (
                        <button
                          onClick={() => setSelectedTee(null)}
                          className="p-2 border border-stone-300 dark:border-stone-800 text-stone-400 hover:text-red-500 hover:border-red-500/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setActiveSlotSelection(activeSlotSelection === 'tee' ? null : 'tee')}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          activeSlotSelection === 'tee'
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                            : 'bg-stone-100 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#CCFF00]'
                        }`}
                      >
                        {activeSlotSelection === 'tee' ? 'CLOSE' : 'CHOOSE'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Selectors Grid */}
                  <AnimatePresence>
                    {activeSlotSelection === 'tee' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 pt-3 border-t border-stone-200 dark:border-stone-800"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {teesList.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedTee(item);
                                setActiveSlotSelection(null);
                                triggerToast(`Selected ${item.title}`);
                              }}
                              className={`p-2 border cursor-pointer transition-colors flex items-center space-x-2 ${
                                selectedTee?.id === item.id 
                                  ? 'border-[#CCFF00] bg-stone-950' 
                                  : 'border-stone-200 dark:border-stone-800 hover:border-[#CCFF00] bg-stone-100 dark:bg-stone-900/30'
                              }`}
                            >
                              <img src={item.imageUrl} alt={item.title} className="w-8 h-8 object-cover" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[10px] uppercase font-bold text-stone-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                                <p className="text-[9px] font-mono text-[#CCFF00]">₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Jeans Slot */}
                <div className={`border-2 p-3 transition-colors ${
                  activeSlotSelection === 'jeans' 
                    ? 'border-[#CCFF00] bg-stone-50 dark:bg-stone-950/40' 
                    : 'border-stone-200 dark:border-stone-850'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-500">
                        {selectedJeans ? (
                          <img src={selectedJeans.imageUrl} alt={selectedJeans.title} className="w-full h-full object-cover" />
                        ) : (
                          'JEANS'
                        )}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#CCFF00]">
                          Jeans / Cargo / Lower
                        </h4>
                        <p className="text-sm font-black text-stone-900 dark:text-white uppercase">
                          {selectedJeans ? selectedJeans.title : 'No Bottoms Selected'}
                        </p>
                        {selectedJeans && (
                          <span className="text-xs font-mono font-bold text-[#CCFF00]">
                            ₹{selectedJeans.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedJeans && (
                        <button
                          onClick={() => setSelectedJeans(null)}
                          className="p-2 border border-stone-300 dark:border-stone-800 text-stone-400 hover:text-red-500 hover:border-red-500/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setActiveSlotSelection(activeSlotSelection === 'jeans' ? null : 'jeans')}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          activeSlotSelection === 'jeans'
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                            : 'bg-stone-100 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#CCFF00]'
                        }`}
                      >
                        {activeSlotSelection === 'jeans' ? 'CLOSE' : 'CHOOSE'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Selectors Grid */}
                  <AnimatePresence>
                    {activeSlotSelection === 'jeans' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 pt-3 border-t border-stone-200 dark:border-stone-800"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {jeansList.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedJeans(item);
                                setActiveSlotSelection(null);
                                triggerToast(`Selected ${item.title}`);
                              }}
                              className={`p-2 border cursor-pointer transition-colors flex items-center space-x-2 ${
                                selectedJeans?.id === item.id 
                                  ? 'border-[#CCFF00] bg-stone-950' 
                                  : 'border-stone-200 dark:border-stone-800 hover:border-[#CCFF00] bg-stone-100 dark:bg-stone-900/30'
                              }`}
                            >
                              <img src={item.imageUrl} alt={item.title} className="w-8 h-8 object-cover" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[10px] uppercase font-bold text-stone-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                                <p className="text-[9px] font-mono text-[#CCFF00]">₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Accessories Slot */}
                <div className={`border-2 p-3 transition-colors ${
                  activeSlotSelection === 'accessories' 
                    ? 'border-[#CCFF00] bg-stone-50 dark:bg-stone-950/40' 
                    : 'border-stone-200 dark:border-stone-850'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 flex items-center justify-center font-mono text-xs font-bold text-stone-500">
                        {selectedAcc ? (
                          <img src={selectedAcc.imageUrl} alt={selectedAcc.title} className="w-full h-full object-cover" />
                        ) : (
                          'ACC'
                        )}
                      </div>
                      <div>
                        <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#CCFF00]">
                          Accessories / Other
                        </h4>
                        <p className="text-sm font-black text-stone-900 dark:text-white uppercase">
                          {selectedAcc ? selectedAcc.title : 'No Accessories Selected'}
                        </p>
                        {selectedAcc && (
                          <span className="text-xs font-mono font-bold text-[#CCFF00]">
                            ₹{selectedAcc.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {selectedAcc && (
                        <button
                          onClick={() => setSelectedAcc(null)}
                          className="p-2 border border-stone-300 dark:border-stone-800 text-stone-400 hover:text-red-500 hover:border-red-500/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setActiveSlotSelection(activeSlotSelection === 'accessories' ? null : 'accessories')}
                        className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          activeSlotSelection === 'accessories'
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                            : 'bg-stone-100 dark:bg-stone-850 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-[#CCFF00]'
                        }`}
                      >
                        {activeSlotSelection === 'accessories' ? 'CLOSE' : 'CHOOSE'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Item Selectors Grid */}
                  <AnimatePresence>
                    {activeSlotSelection === 'accessories' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-3 pt-3 border-t border-stone-200 dark:border-stone-800"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {accList.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setSelectedAcc(item);
                                setActiveSlotSelection(null);
                                triggerToast(`Selected ${item.title}`);
                              }}
                              className={`p-2 border cursor-pointer transition-colors flex items-center space-x-2 ${
                                selectedAcc?.id === item.id 
                                  ? 'border-[#CCFF00] bg-stone-950' 
                                  : 'border-stone-200 dark:border-stone-800 hover:border-[#CCFF00] bg-stone-100 dark:bg-stone-900/30'
                              }`}
                            >
                              <img src={item.imageUrl} alt={item.title} className="w-8 h-8 object-cover" />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-[10px] uppercase font-bold text-stone-900 dark:text-white truncate">
                                  {item.title}
                                </h5>
                                <p className="text-[9px] font-mono text-[#CCFF00]">₹{item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </div>

            {/* Quick Styling Guide Banner */}
            <div className="bg-stone-900 border-2 border-stone-800 p-5 font-mono text-xs text-stone-400 space-y-3 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10">
                <Crown className="w-32 h-32 text-[#CCFF00]" />
              </div>
              <h4 className="font-serif text-sm font-black text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-[#CCFF00]" />
                <span>HOW TO LAYER LUCKNOW DRIP</span>
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-stone-300">
                <li><strong className="text-white">Proportional Drape:</strong> Go baggy on bottoms to match cropped boxy tops perfectly.</li>
                <li><strong className="text-white">Synergy bonus:</strong> Get high tags similarity to raise the Outfit Synergy score above 90.</li>
                <li><strong className="text-white">Thrift condition:</strong> Try blending <span className="text-[#CCFF00]">Vintage</span> pieces with <span className="text-[#CCFF00]">Brand New</span> accessories.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>

      {/* 3. VIRTUAL TRY-ON FITTING ROOM OVERLAY MODAL */}
      <AnimatePresence>
        {isTryOnOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-stone-900 border-4 border-stone-800 shadow-[8px_8px_0px_#CCFF00] p-6 md:p-8 space-y-6 overflow-hidden max-h-[92vh] flex flex-col justify-between"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setIsTryOnOpen(false)}
                className="absolute top-4 right-4 z-20 p-2 border-2 border-stone-850 hover:border-[#CCFF00] bg-black text-stone-400 hover:text-white uppercase font-mono text-[9px] font-bold"
              >
                CLOSE [X]
              </button>

              {/* Modal Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch overflow-y-auto pr-1">
                
                {/* Visual Fitting Mirror (Left 6 cols) */}
                <div className="md:col-span-6 bg-black border-2 border-stone-850 relative aspect-[4/5] md:aspect-auto flex flex-col justify-between p-6 overflow-hidden min-h-[380px]">
                  
                  {/* Neon active scan indicator */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        exit={{ top: '0%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute left-0 right-0 h-1 bg-[#CCFF00]/80 shadow-[0_0_15px_#CCFF00] z-20 pointer-events-none"
                      />
                    )}
                  </AnimatePresence>

                  {/* Top Mirror Header */}
                  <div className="relative z-10 flex items-center justify-between font-mono text-[9px] text-[#CCFF00] bg-black/80 px-2 py-1">
                    <span className="flex items-center space-x-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>LIVE TRY-ON STREAM</span>
                    </span>
                    <span>RESOLUTION: 1080P PRO</span>
                  </div>

                  {/* Avatar stage */}
                  <div className="flex-1 flex items-center justify-center relative">
                    
                    {/* Background webcam simulation or standard silhouette */}
                    {showWebcamMirror ? (
                      <div className="absolute inset-0 z-0 bg-stone-950 flex flex-col items-center justify-center text-center p-4">
                        <Camera className="w-12 h-12 text-[#CCFF00] animate-pulse mb-2" />
                        <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-wider">
                          [ MOCK CAMERA FEED SIMULATION ACTIVE ]
                        </span>
                        <p className="text-[9px] font-mono text-stone-500 mt-1 max-w-xs uppercase">
                          Camera permissions routed to iframe proxy sandbox. Smile, looking absolute drippy!
                        </p>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-25 z-0">
                        {avatarGender === 'neutral' && <User className="w-56 h-56 text-stone-700" />}
                        {avatarGender === 'retro' && <Smile className="w-56 h-56 text-stone-700 animate-bounce" />}
                        {avatarGender === 'wireframe' && (
                          <div className="w-48 h-48 border-4 border-dashed border-stone-800 rounded-full animate-spin" />
                        )}
                      </div>
                    )}

                    {/* Composite layout mapping selected pieces over mannequin */}
                    <div className="relative z-10 w-full h-full max-w-[280px] flex flex-col justify-between py-6">
                      
                      {/* 1. Cap positioned on top */}
                      <div className="h-16 flex items-center justify-center">
                        {selectedCap ? (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 bg-stone-900 border-2 border-[#CCFF00] rounded-full p-1 overflow-hidden shadow-lg"
                          >
                            <img src={selectedCap.imageUrl} alt="" className="w-full h-full object-cover rounded-full" />
                          </motion.div>
                        ) : (
                          <div className="text-[9px] font-mono text-stone-600 bg-black/50 px-2 py-0.5">NO CAP WEAR</div>
                        )}
                      </div>

                      {/* 2. Tee positioned on torso */}
                      <div className="h-24 flex items-center justify-center">
                        {selectedTee ? (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 bg-stone-900 border-2 border-[#CCFF00] p-1 overflow-hidden shadow-lg"
                          >
                            <img src={selectedTee.imageUrl} alt="" className="w-full h-full object-cover" />
                          </motion.div>
                        ) : (
                          <div className="text-[9px] font-mono text-stone-600 bg-black/50 px-2 py-0.5">NO TOP WEAR</div>
                        )}
                      </div>

                      {/* 3. Jeans positioned on legs */}
                      <div className="h-28 flex items-center justify-center">
                        {selectedJeans ? (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-28 bg-stone-900 border-2 border-[#CCFF00] p-1 overflow-hidden shadow-lg"
                          >
                            <img src={selectedJeans.imageUrl} alt="" className="w-full h-full object-cover" />
                          </motion.div>
                        ) : (
                          <div className="text-[9px] font-mono text-stone-600 bg-black/50 px-2 py-0.5">NO BOTTOM WEAR</div>
                        )}
                      </div>

                    </div>

                  </div>

                  {/* Interactive mannequin/mirror toggle controls */}
                  <div className="relative z-10 flex flex-wrap gap-1.5 items-center justify-between border-t border-stone-850 pt-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setAvatarGender('neutral'); setShowWebcamMirror(false); }}
                        className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider font-bold border ${
                          avatarGender === 'neutral' && !showWebcamMirror
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                            : 'bg-stone-950 text-stone-400 border-stone-800'
                        }`}
                      >
                        Model 3D
                      </button>
                      <button
                        onClick={() => { setAvatarGender('retro'); setShowWebcamMirror(false); }}
                        className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider font-bold border ${
                          avatarGender === 'retro' && !showWebcamMirror
                            ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                            : 'bg-stone-950 text-stone-400 border-stone-800'
                        }`}
                      >
                        Vibe Check
                      </button>
                    </div>

                    <button
                      onClick={() => setShowWebcamMirror(!showWebcamMirror)}
                      className={`px-2 py-1 text-[8px] font-mono uppercase tracking-wider font-bold border flex items-center space-x-1 ${
                        showWebcamMirror
                          ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                          : 'bg-stone-950 text-stone-400 border-stone-800'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      <span>{showWebcamMirror ? 'Webcam On' : 'Simulate Mirror'}</span>
                    </button>
                  </div>

                </div>

                {/* Fit Analytics & Booking (Right 6 cols) */}
                <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-widest font-black block">
                        FITTING ROOM REPORT
                      </span>
                      <h3 className="font-serif text-2xl font-black text-white uppercase tracking-tight">
                        Drip Silhouette Summary
                      </h3>
                    </div>

                    {/* Diagnostic list */}
                    <div className="space-y-2.5">
                      
                      {/* Active items tags strip */}
                      <div className="bg-stone-950 p-3 border border-stone-850">
                        <span className="text-[9px] font-mono text-stone-400 block mb-1">SELECTED GRAILS:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedItems.map(item => (
                            <span key={item.id} className="text-[9px] font-mono px-2 py-0.5 bg-stone-900 border border-stone-800 text-white">
                              {item.title} (₹{item.price})
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Score Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-stone-950 p-3 border border-stone-850">
                          <span className="text-[9px] font-mono text-stone-500 block">SYNERGY INDEX</span>
                          <span className="font-mono text-2xl font-black text-[#CCFF00]">{synergyIndex}%</span>
                        </div>
                        <div className="bg-stone-950 p-3 border border-stone-850">
                          <span className="text-[9px] font-mono text-stone-500 block">TOTAL PIECES</span>
                          <span className="font-mono text-2xl font-black text-white">{selectedItems.length} Items</span>
                        </div>
                      </div>

                      {/* Verbal verification */}
                      <div className="bg-[#CCFF00]/5 p-3 border border-[#CCFF00]/15 space-y-1.5">
                        <div className="flex items-center space-x-1.5 font-mono text-[9px] font-bold text-[#CCFF00]">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>LUCKNOW STREET COUNCIL ACCREDITATION</span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          {getDripVerdict(synergyIndex)}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Pricing / Booking Section */}
                  <div className="space-y-4 pt-4 border-t border-stone-800">
                    
                    <div className="flex items-baseline justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-stone-500 uppercase">BUNDLE PRICE (-{discountPercent}%)</span>
                        {discountAmount > 0 && (
                          <span className="text-[10px] font-mono text-stone-400 line-through">
                            ₹{basePriceSum}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-3xl font-black text-[#CCFF00]">
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Reservation Form */}
                    {!reservationSuccess ? (
                      <form onSubmit={handleReserveOutfit} className="space-y-3 bg-stone-950 p-4 border border-stone-850">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block">
                            Reserve this entire fit for in-person pickup:
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your name (e.g. Rahul)"
                            value={reservationName}
                            onChange={(e) => setReservationName(e.target.value)}
                            className="w-full bg-stone-900 border border-stone-800 focus:border-[#CCFF00] outline-none text-white px-3 py-2 font-mono text-xs"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#CCFF00] text-black hover:bg-black hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors border border-transparent font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reserve Curated Fit Now</span>
                        </button>
                      </form>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-950/40 border border-emerald-500 p-4 text-center space-y-2 text-emerald-300 font-mono"
                      >
                        <CheckCircle2 className="w-8 h-8 mx-auto text-[#CCFF00] animate-bounce" />
                        <h4 className="text-xs font-black uppercase tracking-wider">FIT RESERVED SUCCESSFULLY!</h4>
                        <p className="text-[10px] leading-relaxed">
                          No cap, <strong>{reservationName}</strong>! We've put these exact {selectedItems.length} items aside in our Lucknow Gole Market physical showroom closet. Simply visit Sector-D LDA Colony, mention your name, and take home the drippiest combination today!
                        </p>
                      </motion.div>
                    )}

                    <div className="text-[9.5px] font-mono text-stone-500 leading-normal flex items-start space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-500 mt-0.5" />
                      <span>Note: Reservation locks items for 48 hours only. Stock counts are physical and verified. Claim yours low-key!</span>
                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
