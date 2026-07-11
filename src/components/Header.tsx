/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, Phone, MapPin, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  openManageModal: () => void;
  activeTab: 'browse' | 'recommendations';
  setActiveTab: (tab: 'browse' | 'recommendations') => void;
}

export default function Header({
  isDarkMode,
  toggleDarkMode,
  openManageModal,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-800/80 bg-[#050505]/95 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Hanger emblem */}
          <div className="flex items-center space-x-3">
            <div className="flex flex-col">
              <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-tighter italic text-white uppercase hover:text-[#CCFF00] transition-colors cursor-pointer">
                GENZ•THRIFT
              </h1>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#CCFF00] font-mono font-semibold">
                Lucknow Gole Market
              </span>
            </div>
          </div>

          {/* Navigation / Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="flex space-x-1 sm:space-x-2 mr-2">
              <button
                id="tab-browse"
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 border-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === 'browse'
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00] hover:bg-[#CCFF00]/90 shadow-md'
                    : 'text-stone-300 border-transparent hover:border-stone-700 hover:text-white'
                }`}
              >
                Browse Catalog
              </button>
              <button
                id="tab-recommendations"
                onClick={() => setActiveTab('recommendations')}
                className={`px-4 py-2 border-2 text-[11px] font-black uppercase tracking-widest flex items-center space-x-1.5 transition-all duration-300 ${
                  activeTab === 'recommendations'
                    ? 'bg-[#CCFF00] text-black border-[#CCFF00] hover:bg-[#CCFF00]/90 shadow-md'
                    : 'text-stone-300 border-transparent hover:border-stone-700 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>My GZ Match</span>
              </button>
            </nav>

            {/* Manage Inventory button */}
            <button
              id="btn-manage-inventory"
              onClick={openManageModal}
              title="Manage local clothing inventory"
              className="p-2.5 border-2 border-stone-800 text-stone-300 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors bg-stone-900/40"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Dark mode switch */}
            <button
              id="btn-toggle-dark-mode"
              onClick={toggleDarkMode}
              className="p-2.5 border-2 border-stone-800 text-stone-300 hover:text-[#CCFF00] hover:border-[#CCFF00] transition-colors bg-stone-900/40"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Floating details banner (Lucknow Gole Market & phone) */}
        <div className="py-2 border-t border-stone-850 flex flex-col xs:flex-row items-center justify-between text-[10px] text-stone-400 font-mono gap-1 tracking-wider uppercase">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>Gole Market, Sector-D, LDA Colony, Lucknow.</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>LET'S CONNECT: <span className="font-bold text-white">9151246609</span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
