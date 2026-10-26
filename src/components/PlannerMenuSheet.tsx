import React from 'react';

interface PlannerMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
}

export const PlannerMenuSheet: React.FC<PlannerMenuSheetProps> = ({
  isOpen,
  onClose,
  onNavigate,
  activeTab,
}) => {
  if (!isOpen) return null;

  const tools = [
    {
      id: 'dashboard',
      label: 'Event Dashboard',
      desc: 'Central overview, readiness math & critical alerts',
      icon: 'dashboard',
      badge: 'Main',
    },
    {
      id: 'budget',
      label: 'Smart Budget Optimizer',
      desc: 'Category allocations, contingency reserve & INR ledger',
      icon: 'account_balance_wallet',
      badge: '₹ INR',
    },
    {
      id: 'timeline',
      label: 'Adaptive Timeline & Run-of-Show',
      desc: 'Milestones, minute-by-minute day schedule & guest RSVP',
      icon: 'alarm_on',
      badge: 'Adaptive',
    },
    {
      id: 'theme-studio',
      label: 'AI Theme & Moodboard Studio',
      desc: 'Scenography concepts, lighting setups & color swatches',
      icon: 'palette',
      badge: 'New',
    },
    {
      id: 'simulator',
      label: 'Plan Comparison & What-If',
      desc: 'Model headcount changes & venue tiers in real-time',
      icon: 'insights',
      badge: 'Simulation',
    },
    {
      id: 'plan-event',
      label: 'New Event Wizard',
      desc: 'Guided 5-step event creation with AI synthesis',
      icon: 'add_circle',
      badge: 'Wizard',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden bg-black/75 backdrop-blur-md animate-in fade-in">
      {/* Tap backdrop to dismiss */}
      <div className="flex-1 cursor-pointer" onClick={onClose} aria-label="Dismiss sheet" />

      {/* Sheet Container */}
      <div className="relative w-full rounded-t-3xl bg-surface-container-high border-t border-outline-variant/30 shadow-[0_-12px_40px_rgba(0,0,0,0.8)] p-5 pb-[max(env(safe-area-inset-bottom),1.5rem)] animate-in slide-in-from-bottom duration-300">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-outline-variant/50 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/15 mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h3 className="font-headline-sm text-[17px] font-bold text-on-surface">
              Eventora Planning Suite
            </h3>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="Close sheet"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* List of tools */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[65vh] overflow-y-auto">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onNavigate(t.id);
                onClose();
              }}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-primary-container/20 border-primary text-on-surface shadow-md'
                  : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[22px]">{t.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-headline-sm text-[14px] font-bold text-on-surface truncate">
                    {t.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-mono-sm text-[10px] shrink-0 font-semibold">
                    {t.badge}
                  </span>
                </div>
                <p className="text-[11px] font-body-sm text-on-surface-variant line-clamp-1 mt-0.5">
                  {t.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
