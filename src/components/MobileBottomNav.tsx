import React from 'react';

interface MobileBottomNavProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenQuickMenu: () => void;
  unreadCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onNavigate,
  onOpenQuickMenu,
  unreadCount = 0,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/20 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 px-2 lg:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto">
        {/* TAB 1: Explore / Home */}
        <button
          onClick={() => onNavigate('explore')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-all cursor-pointer ${
            activeTab === 'explore'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Explore Home"
        >
          <span className="material-symbols-outlined text-[22px]">
            {activeTab === 'explore' ? 'explore' : 'explore'}
          </span>
          <span className="text-[10px] font-label-mono-sm tracking-tight mt-0.5">Home</span>
        </button>

        {/* TAB 2: Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'dashboard'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Event Dashboard"
        >
          <span className="material-symbols-outlined text-[22px]">
            {activeTab === 'dashboard' ? 'dashboard' : 'dashboard'}
          </span>
          <span className="text-[10px] font-label-mono-sm tracking-tight mt-0.5">Dash</span>
          {activeTab === 'dashboard' && (
            <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
          )}
        </button>

        {/* TAB 3: AI Copilot (Center Elevated Action) */}
        <button
          onClick={() => onNavigate('ai-copilot')}
          className="flex flex-col items-center justify-center -mt-3 min-h-[48px] min-w-[48px] cursor-pointer group"
          aria-label="AI Copilot Assistant"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg ${
              activeTab === 'ai-copilot'
                ? 'bg-gradient-to-tr from-primary to-primary-container text-on-primary ring-2 ring-primary/40 shadow-[0_0_16px_rgba(183,109,255,0.6)]'
                : 'bg-surface-container-high text-primary border border-outline-variant/40 group-hover:bg-primary-container group-hover:text-on-primary-container'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
          </div>
          <span
            className={`text-[10px] font-label-mono-sm tracking-tight mt-0.5 ${
              activeTab === 'ai-copilot' ? 'text-primary font-bold' : 'text-on-surface-variant'
            }`}
          >
            Copilot
          </span>
        </button>

        {/* TAB 4: Planner Tools (Budget, Timeline, Studio) */}
        <button
          onClick={onOpenQuickMenu}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-all cursor-pointer ${
            ['budget', 'timeline', 'theme-studio', 'simulator'].includes(activeTab)
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="Planner Tools Menu"
        >
          <span className="material-symbols-outlined text-[22px]">tune</span>
          <span className="text-[10px] font-label-mono-sm tracking-tight mt-0.5">Planner</span>
        </button>

        {/* TAB 5: My Events & Switcher */}
        <button
          onClick={() => onNavigate('my-events')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'my-events'
              ? 'text-primary font-bold'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
          aria-label="My Events and Readiness"
        >
          <span className="material-symbols-outlined text-[22px]">event_note</span>
          <span className="text-[10px] font-label-mono-sm tracking-tight mt-0.5">Events</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-primary" />
          )}
        </button>
      </div>
    </nav>
  );
};
