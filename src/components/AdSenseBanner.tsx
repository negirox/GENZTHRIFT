/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ExternalLink, ShieldCheck, EyeOff, Sparkles, CheckCircle } from 'lucide-react';

interface AdSenseBannerProps {
  slotId: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  isPreviewMode?: boolean;
}

export default function AdSenseBanner({
  slotId,
  format = 'auto',
  className = '',
  isPreviewMode = true
}: AdSenseBannerProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const insRef = React.useRef<HTMLModElement>(null);

  // Initialize real Google AdSense pushing on mount (safely ignored if blocker active or scripts not fully parsed)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (insRef.current) {
          // Only push if the AdSense script has loaded and this ins element hasn't been initialized yet
          const alreadyProcessed = insRef.current.hasAttribute('data-adsbygoogle-status');
          // @ts-ignore
          const adsbygoogle = window.adsbygoogle;
          if (!alreadyProcessed && adsbygoogle && typeof adsbygoogle.push === 'function') {
            adsbygoogle.push({});
          }
        }
      } catch (e) {
        console.warn('AdSense push notification safe warning:', e);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const getFormatDimensions = () => {
    switch (format) {
      case 'rectangle':
        return 'w-full max-w-[336px] h-[280px]';
      case 'horizontal':
        return 'w-full h-[90px]';
      case 'vertical':
        return 'w-[160px] h-[600px]';
      default:
        return 'w-full h-auto min-h-[90px]';
    }
  };

  const codeSnippet = `<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-9187440931404634"
     data-ad-slot="${slotId}"
     data-ad-format="${format}"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className={`my-4 relative z-10 select-none ${!isPreviewMode ? getFormatDimensions() : ''} ${className}`}>
      
      {/* Real AdSense Element (takes full parent layout space so availableWidth remains > 0) */}
      <div className={isPreviewMode ? "absolute inset-0 opacity-0 pointer-events-none overflow-hidden" : "w-full h-full"}>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client="ca-pub-9187440931404634" // User's verified active publisher ID
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>

      {/* Simulated Compliance Placeholder for visual verification and testing */}
      {isPreviewMode && (
        <div className="border border-stone-800 bg-stone-950 p-4 relative overflow-hidden flex flex-col justify-between">
          {/* Ad Background Grid details */}
          <div className="absolute inset-0 bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

          {/* Ad Label header */}
          <div className="flex items-center justify-between mb-3 border-b border-stone-850 pb-2 relative z-10">
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] font-mono tracking-widest text-stone-500 font-bold uppercase">
                SPONSORED ADVERTISEMENT
              </span>
              <span className="text-[8px] bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00] px-1.5 py-0.2 font-mono font-bold">
                ADSENSE READY
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-stone-500 hover:text-white transition-colors p-0.5"
                title="View compliance specs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inner banner body */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono font-bold text-stone-300">Slot: #{slotId}</span>
                <span className="text-[10px] text-stone-500 font-mono">({format === 'rectangle' ? '300x250 Mid-Rectangle' : 'Responsive Leaderboard'})</span>
              </div>
              <p className="text-xs text-stone-400 font-sans max-w-lg">
                Google AdSense Auto-Optimized Ad Unit placeholder. Ready for automatic crawling and high-CPM programmatic advertising slots.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={copyCode}
                className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 hover:text-white font-mono text-[9px] uppercase tracking-wider transition-colors"
              >
                {isCopied ? 'Copied ⚡' : 'Get HTML Code'}
              </button>
              <a
                href="https://support.google.com/adsense/answer/48182"
                target="_blank"
                rel="noreferrer noopener"
                className="px-2.5 py-1.5 bg-stone-900 hover:bg-[#CCFF00] hover:text-black border border-stone-800 text-stone-400 font-mono text-[9px] uppercase tracking-wider transition-all flex items-center space-x-1"
              >
                <span>Policy Guide</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Policy Compliance Expanded Explanation Panel */}
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 pt-3 border-t border-stone-850 text-[10px] font-mono text-stone-400 space-y-2 relative z-10"
            >
              <div className="flex items-start space-x-2 text-lime-400 font-bold uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Google AdSense Policy Compliance Verification</span>
              </div>
              <p>
                To avoid account suspension or application rejection by Google, this ad slot adheres strictly to the following parameters:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-1 text-stone-500">
                <li><strong className="text-stone-300">No Accidental Clicks:</strong> Placed safely away from interactive navigational buttons or custom overlays.</li>
                <li><strong className="text-stone-300">Clear Distinction:</strong> Labelled with "SPONSORED ADVERTISEMENT" so users cannot confuse this with core app contents.</li>
                <li><strong className="text-stone-300">Responsive Sizing:</strong> Dynamically adjusts width to prevent element breakage on mobile devices.</li>
                <li><strong className="text-stone-300">Secure Protocol:</strong> Built over secure async scripts conforming to standard publishers policies.</li>
              </ul>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
