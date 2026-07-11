/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileText, Info, Mail, AlertTriangle, Send, CheckCircle } from 'lucide-react';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'privacy' | 'terms' | 'about' | 'contact' | 'disclaimer';
}

export default function ComplianceModal({ isOpen, onClose, initialTab = 'privacy' }: ComplianceModalProps) {
  const [activeTab, setActiveTab] = useState<typeof initialTab>(initialTab);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API request to support endpoint
    setTimeout(() => {
      setSubmitting(false);
      setIsSubmitted(true);
      setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 1200);
  };

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'about', label: 'About Our Shop', icon: Info },
    { id: 'contact', label: 'Contact Support', icon: Mail },
    { id: 'disclaimer', label: 'Disclaimer & Policies', icon: AlertTriangle },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-4xl bg-stone-900 border-2 border-stone-800 rounded-none shadow-2xl flex flex-col md:flex-row h-[85vh] md:h-[70vh] overflow-hidden"
      >
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 bg-stone-950 border-b md:border-b-0 md:border-r border-stone-850 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-[#CCFF00]"></span>
              <span className="text-[10px] font-mono tracking-widest text-[#CCFF00] uppercase font-black">
                LEGAL & COMPLIANCE HUB
              </span>
            </div>
            
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsSubmitted(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-xs font-mono uppercase font-bold tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-[#CCFF00] text-black border border-[#CCFF00]'
                        : 'text-stone-400 hover:text-white hover:bg-stone-900 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:block pt-4 border-t border-stone-850 text-[10px] font-mono text-stone-500">
            <p>AdSense Network Ready</p>
            <p className="text-stone-600 mt-1">v2.1 Compliance Standard</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1 bg-stone-950 border border-stone-800 text-stone-400 hover:text-white hover:border-[#CCFF00] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-stone-900 text-stone-300">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-4 h-full"
            >
              {activeTab === 'privacy' && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-black text-white uppercase tracking-tight">Privacy Policy</h2>
                  <p className="text-xs font-mono text-[#CCFF00]">Effective Date: July 11, 2026</p>
                  
                  <div className="space-y-3 text-xs leading-relaxed font-sans text-stone-400">
                    <p>
                      At <strong>The GenZ's Thrift</strong>, accessible from our development and production servers, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by us and how we use it.
                    </p>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">1. Google AdSense & Cookies Policy</h3>
                    <p>
                      Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#CCFF00] underline hover:no-underline">https://policies.google.com/technologies/ads</a>.
                    </p>
                    <p>
                      These third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on The GenZ's Thrift, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                    </p>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">2. Information We Collect</h3>
                    <p>
                      The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><strong>Browsing Data:</strong> We record products you view in your local browser storage to power the AI Match Suggestion Engine.</li>
                      <li><strong>Favorites:</strong> Your saved clothes are stored in local storage and never sent to external advertisement trackers.</li>
                      <li><strong>Form Inquiries:</strong> Contact information is strictly used to answer support queries.</li>
                    </ul>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">3. CCPA & GDPR Rights</h3>
                    <p>
                      We fully support your data rights under the CCPA (California Consumer Privacy Act) and GDPR (General Data Protection Regulation). Visitors can request to clear all local cookies and browsing state instantly inside the settings section of this app. We do not sell any personal or browsing history to data brokers.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-black text-white uppercase tracking-tight">Terms of Service</h2>
                  <p className="text-xs font-mono text-[#CCFF00]">Last Updated: July 11, 2026</p>

                  <div className="space-y-3 text-xs leading-relaxed font-sans text-stone-400">
                    <p>
                      Welcome to <strong>The GenZ's Thrift</strong>. These terms and conditions outline the rules and regulations for the use of our interactive thrift store platform.
                    </p>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">1. Acceptance of Terms</h3>
                    <p>
                      By accessing this website, we assume you accept these terms and conditions. Do not continue to use The GenZ's Thrift if you do not agree to take all of the terms and conditions stated on this page.
                    </p>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">2. Intellectual Property & AI Usage</h3>
                    <p>
                      Unless otherwise stated, The GenZ's Thrift owns the intellectual property rights for all material on this site. You may access this for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>
                    <p>
                      Our AI features, including the Gemini-powered styling advisor and low stock triggers, are designed for interactive entertainment and fashion exploration. They do not constitute certified legal, financial, or custom medical advice.
                    </p>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">3. User Contributed Products</h3>
                    <p>
                      Users may add customized thrift items using the "Manage Catalog" panel. You agree not to upload items that violate patent laws, trademarks, or contain offensive content. We reserve the right to remove non-compliant virtual products from local databases.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-black text-white uppercase tracking-tight">About Our Shop</h2>
                  <p className="text-xs font-mono text-[#CCFF00]">THE STREETWEAR REVOLUTION // LUCKNOW, INDIA</p>

                  <div className="space-y-3 text-xs leading-relaxed font-sans text-stone-400">
                    <p>
                      Born in the vibrant markets of <strong>Lucknow (Gole Market, Sector-D)</strong>, The GenZ's Thrift is a conceptual platform dedicated to making vintage streetwear, distressed tees, caps, and baggy cargo jeans accessible to the next generation of style rebels.
                    </p>
                    <p>
                      We believe that sustainability is sexy, no cap. Fast fashion is cooked. Giving pre-loved clothing a second life not only lowers our carbon footprint but helps you stand out as a main character in every vibe check.
                    </p>
                    
                    <div className="p-3 bg-stone-950 border border-stone-850 rounded-none space-y-1 mt-4">
                      <p className="font-mono text-[#CCFF00] uppercase font-black text-[10px]">WHY WE STAND OUT:</p>
                      <ul className="list-disc list-inside font-mono text-[9px] text-stone-400 space-y-1">
                        <li><strong>AI Styling Companion:</strong> Leveraging Gemini 3.5 Flash to construct outfit pairs instantly.</li>
                        <li><strong>Genuine API Imagery:</strong> Fully connected to real, live product feeds from FakeStoreAPI.</li>
                        <li><strong>Fair-Ad Policy:</strong> Google AdSense ready placements aligned with highest publisher guidelines.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-black text-white uppercase tracking-tight">Contact Us</h2>
                  <p className="text-xs font-mono text-[#CCFF00]">HAVE QUESTIONS? DROP US A LINE // NO CAP</p>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-stone-950 border-2 border-emerald-800 text-center space-y-3"
                    >
                      <CheckCircle className="w-12 h-12 text-[#CCFF00] mx-auto animate-bounce" />
                      <h3 className="font-serif text-lg font-black text-white uppercase">MESSAGE SENT SUCCESSFULLY!</h3>
                      <p className="text-xs text-stone-400 font-mono">
                        No cap, our crew will do a quick vibe check and get back to your email inbox within 24 hours.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="px-4 py-2 bg-[#CCFF00] text-black font-mono font-black text-[10px] uppercase tracking-wider"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono uppercase text-stone-400">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mukesh Srivastava"
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full p-2.5 bg-stone-950 border border-stone-850 text-white text-xs font-mono focus:border-[#CCFF00] focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-mono uppercase text-stone-400">Your Email Address</label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. mukesh@gmail.com"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full p-2.5 bg-stone-950 border border-stone-850 text-white text-xs font-mono focus:border-[#CCFF00] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono uppercase text-stone-400">Inquiry Subject</label>
                        <select
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          className="w-full p-2.5 bg-stone-950 border border-stone-850 text-white text-xs font-mono focus:border-[#CCFF00] focus:outline-none"
                        >
                          <option value="General Inquiry">General Store Inquiry</option>
                          <option value="AdSense Sponsorship">AdSense & Sponsorship Partner</option>
                          <option value="Product Sourcing">Thrift Sourcing Lucknow</option>
                          <option value="Technical Glitch">Stylist AI Glitch report</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-mono uppercase text-stone-400">Your Message</label>
                        <textarea
                          required
                          rows={4}
                          placeholder="What's the word? Share your query with us..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full p-2.5 bg-stone-950 border border-stone-850 text-white text-xs font-sans focus:border-[#CCFF00] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-2.5 bg-[#CCFF00] hover:bg-white text-black font-mono font-black text-xs uppercase tracking-wider transition-colors duration-200 flex items-center justify-center space-x-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submitting ? 'SENDING INQUIRY...' : 'SUBMIT CONTACT FORM'}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === 'disclaimer' && (
                <div className="space-y-4">
                  <h2 className="font-serif text-2xl font-black text-white uppercase tracking-tight">Disclaimers & Advertising Policy</h2>
                  <p className="text-xs font-mono text-[#CCFF00]">LEGAL TRANSPARENCY REQUIREMENT</p>

                  <div className="space-y-3 text-xs leading-relaxed font-sans text-stone-400">
                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm">1. Advertising Material Disclosure</h3>
                    <p>
                      This website serves advertisements through the <strong>Google AdSense Network</strong>. The ads displayed are selected and optimized dynamically by third parties based on privacy policies outlined in our Legal Hub. We maintain absolute compliance with the Google AdSense Publisher Policies:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-stone-500">
                      <li>We do not encourage click-baiting or force clicks.</li>
                      <li>All ad containers are clearly marked with an "ADVERTISEMENT" header.</li>
                      <li>We guarantee that ad elements never overlay clickable site components.</li>
                    </ul>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">2. AI-Engine Recommendations Liability</h3>
                    <p>
                      The styling advice, match suggestions, and vibe indicators provided by the Gemini AI system are computed programmatically for entertainment purposes. We make no guarantees about absolute accuracy or real-world matching results.
                    </p>

                    <h3 className="font-mono text-[#CCFF00] uppercase font-bold text-sm mt-4">3. Dynamic Images Disclaimer</h3>
                    <p>
                      All pictures imported dynamically using FakeStoreAPI or Unsplash remain the intellectual property of their respective creators. This open integration simulates a production e-commerce API flow.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
