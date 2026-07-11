/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, ArrowDown, Leaf, ShieldAlert, BadgeCheck, DollarSign } from 'lucide-react';

export default function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Parallax / 3D movement effect on mouse hover
  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#050505] border-b-2 border-stone-850 py-16 px-4 sm:px-6 lg:px-8"
      style={{ perspective: 1000 }}
    >
      {/* Massive Typography Background Watermark */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[18vw] leading-[0.75] font-black text-white/[0.02] uppercase tracking-tighter">OVERSIZE</h1>
        <h1 className="text-[18vw] leading-[0.75] font-black text-[#CCFF00]/[0.015] uppercase tracking-tighter">GEN-Z</h1>
      </div>

      {/* Floating neon accent circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <div className="w-[500px] h-[500px] border border-white/5 rounded-full"></div>
        <div className="w-[800px] h-[800px] border border-[#CCFF00]/5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        {/* Left Card: Scrapbook style (Tape on top) */}
        <div className="lg:col-span-3 flex justify-center order-2 lg:order-1" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            initial={{ opacity: 0, rotate: -6, y: 20 }}
            animate={{ opacity: 1, rotate: -4, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative w-56 bg-stone-900 p-6 shadow-2xl border-2 border-stone-800 rounded-none transform -rotate-3 hover:rotate-0 transition-transform duration-300"
          >
            {/* Tape effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-white/10 backdrop-blur-[2px] shadow-sm transform -rotate-1 border border-white/5"></div>
            <div className="font-mono text-[#CCFF00] text-[10px] tracking-widest uppercase font-bold mb-2">LIMITED RELEASES</div>
            <p className="font-sans text-stone-300 text-xs italic leading-relaxed font-bold tracking-tight">
              "SUSTAINABILITY IS SEXY, NO CAP."
            </p>
            <div className="text-right text-[#CCFF00] font-sans text-xl mt-4 font-black">★</div>
          </motion.div>
        </div>

        {/* Center Section: Core Brand Identity */}
        <div className="lg:col-span-6 text-center space-y-6 order-1 lg:order-2" style={{ transform: "translateZ(50px)" }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-stone-900 px-4 py-2 border-2 border-stone-800 rounded-none"
          >
            <Sparkles className="w-4 h-4 text-[#CCFF00] animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#CCFF00]">
              LUCKNOW STREET • DROPS V1.2
            </span>
          </motion.div>

          <div className="space-y-2">
            <h2 className="font-serif text-5xl sm:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              THE GENZ'S
            </h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-[2px] w-16 bg-white/25"></div>
              <span className="font-serif text-3xl sm:text-4xl italic text-[#CCFF00] font-black uppercase tracking-tighter">
                THRIFT
              </span>
              <div className="h-[2px] w-16 bg-white/25"></div>
            </div>
          </div>

          <p className="text-stone-400 max-w-md mx-auto text-xs sm:text-sm leading-relaxed font-medium">
            Curated vintage apparel, oversized graphic tees, baggy cargo denim, and authentic retro hats. Premium sustainable clothing, low prices, zero cap.
          </p>

          {/* Badges in User Image */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
            <div className="flex flex-col items-center p-3 bg-stone-900 border-2 border-stone-850">
              <BadgeCheck className="w-5 h-5 text-[#CCFF00] mb-1" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-300">Curated fits</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-stone-900 border-2 border-stone-850">
              <DollarSign className="w-5 h-5 text-[#CCFF00] mb-1" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-300">Pure Steals</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-[#111] border-2 border-stone-850">
              <Leaf className="w-5 h-5 text-[#CCFF00] mb-1" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-300">100% Eco</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-stone-900 border-2 border-stone-850">
              <Sparkles className="w-5 h-5 text-[#CCFF00] mb-1" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-stone-300">Rizz Level Max</span>
            </div>
          </div>
        </div>

        {/* Right Section: Polaroid frame & Tape */}
        <div className="lg:col-span-3 flex justify-center order-3" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            initial={{ opacity: 0, rotate: 6, y: 20 }}
            animate={{ opacity: 1, rotate: 4, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative w-56 bg-white p-4 shadow-2xl border-2 border-white rounded-none transform rotate-3 hover:rotate-0 transition-transform duration-300"
          >
            {/* Polaroid image placeholder using elegant Unsplash */}
            <div className="relative w-full aspect-square bg-stone-100 rounded-none overflow-hidden mb-3 border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
                alt="GenZ Aesthetic Stack"
                className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* Hand-written look text */}
            <div className="text-center font-mono font-black uppercase text-[10px] tracking-widest text-black">
              NEO•STREET ARCHIVE
            </div>
            {/* Hanging paper tag details */}
            <div className="absolute -bottom-6 -left-2 w-14 h-8 bg-black text-[#CCFF00] text-[9px] font-mono font-bold flex items-center justify-center rounded-none shadow-md border border-[#CCFF00] transform -rotate-12">
              EST. 2026
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bounce indicator down to catalog */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-[9px] font-mono tracking-widest text-stone-500">
        <span>EXPLORE INVENTORY</span>
        <ArrowDown className="w-3.5 h-3.5 mt-0.5 animate-bounce text-[#CCFF00]" />
      </div>
    </div>
  );
}
