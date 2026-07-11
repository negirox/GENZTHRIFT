/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from '../types';

interface SimpleHistoryItem {
  title: string;
  category: string;
  condition: string;
  views: number;
  tags: string[];
}

interface SimpleCatalogItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
}

const LUCKNOW_SLANGS = [
  { slang: "No cap 🧢", exp: "Used to declare 100% absolute truth, especially when you spot that Lucknow thrift grail." },
  { slang: "Drippy 💧", exp: "When your Lucknow Hazratganj street style is so clean it's practically overflowing." },
  { slang: "Cooked 🔥", exp: "When a style combination is so hot, the local Lucknow street fashion rivals are literally finished." },
  { slang: "Hazratganj Rizz ✨", exp: "The elite Lucknow charm you display while taking a gedi down Hazratganj, looking absolutely main character." },
  { slang: "Living Rent Free 🧠", exp: "This specific vintage outfit is occupying 100% of everyone's mental capacity at Gole Market." },
  { slang: "Slay 💅", exp: "Dominating Lucknow's streetwear scene with absolute effortless elegance." },
  { slang: "Main Character Energy 🌟", exp: "Feeling like the only person who matters while walking past Sharma Ji Ki Chai." }
];

const LUCKNOW_VIBES = [
  {
    name: "Hazratganj Y2K Skater",
    tips: [
      "This fit is going insanely hard, no cap! Perfect for cruising down Hazratganj. Pair that baggy thrift tee with low-top sneakers and oversized shades to channel ultimate main character energy.",
      "Vibe check: Approved. To complete this Y2K skater silhouette, layer your vintage tees and throw on some distressed cargo or baggy denim. Grab some Sharma Chai while looking drippy."
    ]
  },
  {
    name: "Gole Market Gorpcore Utility",
    tips: [
      "We're looking at peak Lucknow utility here. Layer that high-grade vintage piece with heavy-duty cargo jeans or a utility cap. It's giving outdoor explorer but make it extremely Lucknow-streetwise.",
      "This gorpcore vibe is living rent free in our heads. Perfect for Lucknow monsoon gedi or shopping sprints in Aminabad. Combine multiple textures and earth tones to slay the room."
    ]
  },
  {
    name: "Chowk Street Cyberpunk",
    tips: [
      "A futuristic, retro-cyber blend that is absolutely cooked in style. The contrast between high-vis tags and minimal thrift pieces is pure Lucknow rizz. Grab some heavy boots and pull off the ultimate graphic streetwear statement.",
      "Pure main character aesthetic. The technical tags combined with Lucknow's legacy alleys creates a gorgeous cyberpunk contrast. Pair with sleek metallic accessories and look absolutely drippy."
    ]
  },
  {
    name: "Awadhi Heritage Grunge",
    tips: [
      "Blending Lucknow's royal elegance with distressed retro grunge. This vintage piece is vintage gold. Style it with oversized outerwear and silver statement jewelry for that premium Hazratganj grunge look.",
      "Ultimate thrift grail alert. This is how you pay tribute to Lucknow's legacy while keeping it absolute GenZ streetwear. Distressed denim + graphic vintage tee = effortless rizz."
    ]
  }
];

// Fallback for full styling advice
export function getLocalStylingAdvice(
  history: SimpleHistoryItem[],
  catalog: SimpleCatalogItem[],
  topCategory: string
) {
  // Select a vibe based on history topCategory
  let selectedVibe = LUCKNOW_VIBES[0];
  if (topCategory.toLowerCase().includes('jeans') || topCategory.toLowerCase().includes('cargo')) {
    selectedVibe = LUCKNOW_VIBES[1]; // Gorpcore Utility
  } else if (topCategory.toLowerCase().includes('cap')) {
    selectedVibe = LUCKNOW_VIBES[2]; // Cyberpunk
  } else if (topCategory.toLowerCase().includes('accessories')) {
    selectedVibe = LUCKNOW_VIBES[3]; // Heritage Grunge
  } else {
    // Randomize or pick first
    const randIndex = Math.floor(Math.random() * LUCKNOW_VIBES.length);
    selectedVibe = LUCKNOW_VIBES[randIndex];
  }

  // Select random slang
  const slangObj = LUCKNOW_SLANGS[Math.floor(Math.random() * LUCKNOW_SLANGS.length)];
  
  // Pick dynamic advice text
  const adviceTextTemplate = selectedVibe.tips[Math.floor(Math.random() * selectedVibe.tips.length)];
  
  const viewedTitles = history.map(h => h.title).slice(0, 2).join(" and ");
  const historyRef = viewedTitles 
    ? `Since you checked out ${viewedTitles} in your session, this styling combination acts as the ultimate upgrade. `
    : `We analyzed your taste tags and we're ready to deploy the drip. `;

  const advice = `${historyRef}

${adviceTextTemplate}

Lucknow Fashion Council standard: Check out the curated outfit pieces from our Lucknow Gole Market local catalog below to lock down this exact vibe today!`;

  // Filter catalog items of matching vibes
  // Let's suggest 1 to 3 items that are not in history if possible, or just interesting ones
  const historyTitlesSet = new Set(history.map(h => h.title.toLowerCase()));
  const eligibleItems = catalog.filter(item => !historyTitlesSet.has(item.title.toLowerCase()));
  const backupItems = catalog;
  
  const selectedItems = eligibleItems.length >= 2 ? eligibleItems : backupItems;
  // Shuffled and taken top 2 or 3
  const suggestedOutfitIds = selectedItems
    .map(x => ({ x, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .slice(0, 3)
    .map(item => item.x.id);

  return {
    advice,
    vibeName: selectedVibe.name,
    matchedSlang: `${slangObj.slang} - ${slangObj.exp}`,
    suggestedOutfitIds
  };
}

// Fallback for single product styling suggestion
export function getLocalSingleSuggestion(product: Product, historyProducts: Product[]) {
  // Generate customized comment
  const slangs = ["no cap", "drippy", "rizz", "slay", "cooked", "rent free", "main character", "ate and left no crumbs"];
  const randomSlang = () => slangs[Math.floor(Math.random() * slangs.length)];

  const templates = [
    `This ${product.title} is absolutely ${randomSlang()}, no cap! Perfect for a Hazratganj gedi with your squad. Pair it with baggy bottoms and clean retro sneakers to lock down the look.`,
    `Vibe check: APPROVED. This vintage piece brings serious main character energy to Lucknow Gole Market. Combine it with some silver rings or a distressed utility cap to completely slay.`,
    `A total thrift grail! The texture on this is pure gold. It would go insanely hard with oversized baggy cargos, no doubt. Absolutely renting space in our minds rent free.`,
    `Lucknow streetwear elite tier. It's giving effortless rizz. Wear it slightly oversized for that premium vintage skate aesthetic. You'll literally have the Hazratganj crowd cooked.`
  ];

  let suggestion = templates[Math.floor(Math.random() * templates.length)];

  // If there's browsing history, make a direct reference
  if (historyProducts && historyProducts.length > 0) {
    const historicalProd = historyProducts[0];
    suggestion = `Since you checked out the "${historicalProd.title}" earlier, this "${product.title}" would go insanely hard with it for a cohesive Lucknow street outfit. The contrast in tags makes it pure rizz, no cap! Pair them together to give off ultimate main character energy during your Hazratganj gedi.`;
  }

  // Create vibe name
  let vibeName = "Hazratganj Grail";
  if (product.category === "tee") {
    vibeName = "Skater Vintage";
  } else if (product.category === "jeans") {
    vibeName = "Gorpcore Utility";
  } else if (product.category === "cap") {
    vibeName = "Cyberpunk Street";
  } else if (product.category === "accessories") {
    vibeName = "Y2K Accent";
  }

  return {
    suggestion,
    vibeName
  };
}
