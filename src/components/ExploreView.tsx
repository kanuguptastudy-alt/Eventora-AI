import React from 'react';
import { MicroSlats } from './MicroSlats';
import { TechText } from './TechText';

interface ExploreViewProps {
  onPlanEvent: () => void;
  onOpenDemo: () => void;
  onSelectCategoryQuickstart: (type: 'wedding' | 'birthday' | 'community') => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onPlanEvent,
  onOpenDemo,
  onSelectCategoryQuickstart,
}) => {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ATMOSPHERIC LIVING STAGE & HERO CONTAINER */}
      <section className="relative w-full min-h-[942px] flex flex-col justify-between px-4 sm:px-margin overflow-hidden select-none -mt-20 pt-28">
        <MicroSlats />

        {/* MAIN HERO CONTENT GRID (Split Asymmetric Bento Engine) */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center py-space-xl">
          {/* LEFT PROCLAMATION COLUMN (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
            {/* Next-Gen Engine Spec Badge */}
            <div className="inline-flex items-center gap-space-sm px-4 py-1.5 rounded-full bg-surface-container-high/80 backdrop-blur-xl border border-outline-variant/30 shadow-lg shadow-black/40">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest font-semibold">
                NEXT-GEN AI EVENT ENGINE
              </span>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant tracking-wider">
                v2.4 QUANTUM
              </span>
            </div>

            {/* Expressive Tech Headline with TechText Animated Typography */}
            <TechText primaryText="Plan Less." taglineText="Celebrate More." />

            {/* Architectural Subtitle with Geometric Dashed Accents */}
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl font-normal leading-relaxed">
              Your personal autonomous event co-pilot. Beautiful celebrations, surgical budget optimizations, and zero planning friction—powered by predictive neural timelines.
            </p>

            {/* Dynamic Action Deck */}
            <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
              {/* Primary Glow Trigger */}
              <button
                onClick={onPlanEvent}
                className="group relative inline-flex items-center justify-center gap-space-sm px-8 py-4 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-semibold shadow-[0_0_32px_rgba(183,109,255,0.45)] hover:shadow-[0_0_48px_rgba(183,109,255,0.7)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Plan My Event</span>
                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
                <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>

              {/* Interactive Glassmorphic Play Pill */}
              <button
                onClick={onOpenDemo}
                className="group inline-flex items-center gap-space-sm px-6 py-4 rounded-full bg-surface-container-high/60 backdrop-blur-2xl border border-outline-variant/30 text-on-surface hover:text-white hover:bg-surface-container-highest transition-all duration-300 shadow-md cursor-pointer hover:border-primary/40"
                id="demo-trigger-btn"
              >
                <div className="w-8 h-8 rounded-full bg-secondary-container/80 flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </div>
                <span className="font-body-md text-body-md font-medium">Watch 90s Synthesis</span>
              </button>
            </div>

            {/* Verified Authority Metrics Ribbon */}
            <div className="pt-space-md flex flex-wrap items-center gap-y-2 gap-x-6 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
              <div className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="font-bold text-on-surface">4.9/5</span>
                <span className="text-on-surface-variant font-normal">from 12,000+ galas</span>
              </div>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-bold">₹45Cr+</span>
                <span>Budgets Managed</span>
              </div>
              <span className="hidden sm:inline text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>99.4% On-Time Execution</span>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL COLUMN: FLOATING 3D GLASS AI ENGINE PREVIEW (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Diffuse Backlight Orb */}
            <div className="absolute w-72 h-72 rounded-full bg-primary/20 blur-[80px] pointer-events-none" />

            {/* Master Floating Protocol Glass Card */}
            <div className="relative w-full max-w-lg rounded-xl bg-surface-container-high/70 backdrop-blur-2xl border border-outline-variant/30 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85),0_0_36px_rgba(183,109,255,0.2)] p-space-lg transition-transform duration-500 hover:-translate-y-1">
              {/* Card Header & Algorithmic Telemetry */}
              <div className="flex items-center justify-between pb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#ddb7ff]" />
                  <span className="font-label-mono-sm text-label-mono-sm uppercase text-primary font-semibold tracking-wider">
                    AI AGENT FEED
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-secondary-container/60 text-secondary-fixed font-label-mono-sm text-label-mono-sm">
                  LATENCY: 14ms
                </div>
              </div>

              {/* Protocol Status Highlight */}
              <div className="p-space-md rounded-lg bg-surface-container-lowest/80 border border-outline-variant/20 backdrop-blur-md mb-space-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-label-mono-sm text-label-mono-sm text-primary-fixed uppercase tracking-wider block">
                      Target Initialization
                    </span>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold pt-1">
                      The Royal Lilac Palace Gala
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-label-mono-sm text-label-mono-sm uppercase font-semibold">
                    Active
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant pt-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                  Jaipur Palace Courtyard • 250 Guests • Black-Tie
                </p>
              </div>

              {/* Real-Time Budget Optimization Alert Badge */}
              <div className="flex items-center justify-between p-space-md rounded-lg bg-surface-container-low border border-outline-variant/15 mb-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
                  </div>
                  <div>
                    <span className="font-label-mono-sm text-label-mono-sm text-emerald-400 font-semibold block uppercase">
                      Budget Optimiser Guard
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface">Decor renegotiation applied</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-headline-sm text-headline-sm text-emerald-300 font-bold block">
                    +₹42,000
                  </span>
                  <span className="font-caption text-caption text-on-surface-variant">Arbitraged</span>
                </div>
              </div>

              {/* Visual Venue Snapshot with Scrim */}
              <div className="relative w-full h-36 rounded-lg overflow-hidden mb-space-md group">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt="A breathtaking night view of an opulent royal Jaipur palace courtyard"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmn1Xwuv8HzuEXm07XaGGtYVXGNKDhuK6KG335LpgN-e0Qc_5zcGjto_doAPWVH8q0jQk_SaCeAGF-CdSEeTdy1pILoyK9KGrfRMSYNzohnScZ0o0eM0eXqBO4zZCfwUalJjCXJV6b_a_17_qwAnjUOMvOqZJJYWXE43ADURnEy9aeyVeOvd9P0K_hTYjJ00WpjsOuMsTRBnuUReQ-k0QEcOeEPRRtVZ8pDJGSgW8sIXteYkxhIqVh"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary" /> Live Setup Camera • Jaipur 26.91°N
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high/90 text-primary-fixed font-label-mono-sm text-label-mono-sm">
                    4K Feed
                  </span>
                </div>
              </div>

              {/* Live Copilot Audio Waveform & Voice Prompt Dock */}
              <div className="p-space-sm rounded-lg bg-surface-container-lowest/90 border border-outline-variant/20 flex items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-[0_0_12px_#b76dff]">
                    <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                  </div>
                  <div>
                    <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium block">
                      Voice Orchestrator
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      "Re-route floral truck via Gate 3"
                    </span>
                  </div>
                </div>
                {/* Waveform Sound Visualizer */}
                <div className="flex items-center gap-1 h-6 pr-2">
                  <span className="w-1 bg-primary rounded-full h-2 animate-pulse" />
                  <span className="w-1 bg-primary-fixed rounded-full h-5 animate-pulse [animation-delay:150ms]" />
                  <span className="w-1 bg-primary rounded-full h-3 animate-pulse [animation-delay:300ms]" />
                  <span className="w-1 bg-primary-fixed rounded-full h-6 animate-pulse [animation-delay:75ms]" />
                  <span className="w-1 bg-primary rounded-full h-4 animate-pulse [animation-delay:200ms]" />
                  <span className="w-1 bg-tertiary-fixed rounded-full h-2 animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SUBTLE SCROLL INTERACTION PILL */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center pb-space-sm pt-space-xs text-on-surface-variant">
          <a
            className="flex flex-col items-center gap-2 group transition-opacity hover:opacity-100 opacity-70"
            href="#feature-strip"
          >
            <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
              Scroll to explore Eventora AI
            </span>
            <div className="w-5 h-8 rounded-full bg-surface-container-high border border-outline-variant/30 flex justify-center pt-1.5 shadow-inner">
              <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
            </div>
          </a>
        </div>
      </section>

      {/* QUICK FEATURE CARDS STRIP */}
      <section
        className="relative z-10 w-full bg-surface-container-lowest/90 backdrop-blur-xl py-space-xl px-4 sm:px-margin border-t border-outline-variant/15"
        id="feature-strip"
      >
        <div className="max-w-[1440px] mx-auto">
          {/* Section Header Micro-Tag */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md mb-space-lg">
            <div>
              <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest font-semibold block pb-1">
                PRECISION INFRASTRUCTURE
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                Engineered for Flawless Celebrations
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Three specialized generative pipelines running in parallel to replace weeks of fragmented vendor phone calls.
            </p>
          </div>

          {/* Feature Bento Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {/* Card 1: Timeline Synthesis */}
            <div
              onClick={() => onSelectCategoryQuickstart('wedding')}
              className="p-space-lg rounded-xl bg-surface-container-high/60 backdrop-blur-xl border border-outline-variant/25 hover:bg-surface-container-high hover:border-primary/40 transition-all duration-300 flex flex-col justify-between group shadow-lg cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center mb-space-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">schedule</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
                  Instant Timeline Synthesis
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Auto-generate minute-by-minute run-of-show choreography for 50 to 5,000 guests with auto-adjusting contingency buffers.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                <span>Adaptive Logic: Active</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Card 2: Dynamic Budget Guard */}
            <div
              onClick={() => onSelectCategoryQuickstart('birthday')}
              className="p-space-lg rounded-xl bg-surface-container-high/60 backdrop-blur-xl border border-outline-variant/25 hover:bg-surface-container-high hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between group shadow-lg cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-secondary-container/30 text-secondary-fixed flex items-center justify-center mb-space-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">currency_rupee</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
                  Dynamic Rupee Budget Guard
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Real-time contract scanning and city-wide vendor benchmark arbitrations. Never face hidden caterer or sound system surcharges.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                <span>Avg. Savings: 18.4%</span>
                <span className="material-symbols-outlined text-secondary-fixed group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Card 3: Vendor Matchmaker */}
            <div
              onClick={() => onSelectCategoryQuickstart('community')}
              className="p-space-lg rounded-xl bg-surface-container-high/60 backdrop-blur-xl border border-outline-variant/25 hover:bg-surface-container-high hover:border-tertiary/40 transition-all duration-300 flex flex-col justify-between group shadow-lg cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 text-tertiary flex items-center justify-center mb-space-md group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">handshake</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
                  Curated Vendor Matchmaker
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Proprietary compatibility scoring that pairs your aesthetic palette and culinary specs with verified high-caliber artisans.
                </p>
              </div>
              <div className="mt-space-lg pt-space-md border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                <span>Verified Network: 4,800+</span>
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
