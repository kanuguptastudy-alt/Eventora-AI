import React, { useState, useEffect } from 'react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlanning: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onStartPlanning,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: 'Phase 01: Multi-Dimensional Specification Ingestion',
      subtitle: 'Gemini 3.8 Flash parses aesthetic briefs, guest attendance caps, and regional INR constraints.',
      icon: 'neurology',
      detail: 'Jaipur Palace Courtyard • 350 Guests • ₹5,00,000 Target Ceiling • Royal Violet & Gold Theme',
      metrics: 'Tokenized in 14ms • 99.4% Constraint Validation',
      progress: 25,
    },
    {
      title: 'Phase 02: Predictive Neural Run-of-Show Choreography',
      subtitle: 'Constructing minute-by-minute timeline schedules with dynamic sunset golden-hour synchronization.',
      icon: 'schedule',
      detail: '03:30 PM Waterfront arrival → 04:30 PM Baraat → 05:36 PM Sunset Mandap Vows → 09:00 PM Sufi Concert',
      metrics: '3 Contingency Buffers Embedded • Weather Advisory Calibrated',
      progress: 55,
    },
    {
      title: 'Phase 03: Dynamic Rupee Budget Guard & Arbitrage',
      subtitle: 'Deterministic allocation algorithms audit vendor quotes against local verified market benchmarks.',
      icon: 'currency_rupee',
      detail: 'Arbitraged ₹32,000 savings on acoustic brass troupe via Jaipur Artisan Guild direct contracting.',
      metrics: '₹2,85,000 Liquid Reserve Vault Protected • Zero Surprise Fees',
      progress: 80,
    },
    {
      title: 'Phase 04: Continuous Autonomous Copilot Ready',
      subtitle: 'Natural language negotiation, schedule auto-rebalancing, and guest dietary registers live.',
      icon: 'verified',
      detail: 'Active Escrow Security • Real-time Voice & Prompt Re-optimization Ready for Orchestrators.',
      metrics: '100% Blueprint Ready • Ready to Celebrate',
      progress: 100,
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
    }, 3500);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.9),0_0_40px_rgba(183,109,255,0.25)] p-6 sm:p-8 flex flex-col gap-6 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/25 text-primary flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-[24px]">movie</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-mono-sm text-primary uppercase tracking-widest text-[11px] font-semibold">
                  Interactive Demo
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[10px]">
                  90s Synthesis Stream
                </span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Eventora AI Autonomous Pipeline
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between items-center text-on-surface-variant font-label-mono-sm text-[12px]">
            <span>Simulation Step {currentStep + 1} of {steps.length}</span>
            <span className="text-primary font-bold">{current.progress}% Processed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary-container to-tertiary rounded-full transition-all duration-700 shadow-[0_0_12px_#b76dff]"
              style={{ width: `${current.progress}%` }}
            />
          </div>
        </div>

        {/* Active Stage Card */}
        <div className="p-6 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/25 backdrop-blur-md relative z-10 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">{current.icon}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-headline-sm text-[17px] text-on-surface font-bold">
                {current.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {current.subtitle}
              </p>
            </div>
          </div>

          {/* Telemetry pill */}
          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5 font-label-mono-sm text-[12px]">
            <span className="text-primary font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">terminal</span>
              Active Blueprint Stream:
            </span>
            <p className="text-on-surface font-body-sm text-[13px]">{current.detail}</p>
          </div>

          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-[11px] pt-1 border-t border-outline-variant/15">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {current.metrics}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 relative z-10">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentStep ? 'w-8 bg-primary shadow-[0_0_8px_#ddb7ff]' : 'w-2 bg-surface-container-highest hover:bg-outline'
              }`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-outline-variant/20 relative z-10">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer"
          >
            Close Demo
          </button>
          <button
            onClick={() => {
              onClose();
              onStartPlanning();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container via-primary to-tertiary text-on-primary-container font-headline-sm text-[14px] font-bold shadow-[0_0_20px_rgba(183,109,255,0.45)] hover:shadow-[0_0_30px_rgba(183,109,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Plan My Own Event Now</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
