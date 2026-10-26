import React from 'react';

interface NavbarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  onOpenNotifications: () => void;
  hasUnreadNotifications: boolean;
  onOpenNewEventModal: () => void;
  onOpenMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onNavigate,
  onOpenNotifications,
  hasUnreadNotifications,
  onOpenNewEventModal,
  onOpenMobileMenu,
}) => {
  const navItems = [
    { id: 'explore', label: 'Explore' },
    { id: 'plan-event', label: 'Plan Event' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'budget', label: 'Budget' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'ai-copilot', label: 'AI Copilot' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_1px_16px_rgba(0,0,0,0.4)] border-b border-outline-variant/20">
      <div className="h-20 w-full px-4 sm:px-margin flex items-center justify-between gap-space-lg">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="xl:hidden p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface hover:text-primary transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>
          )}

          <div
            className="flex items-center gap-space-md shrink-0 cursor-pointer group"
            onClick={() => onNavigate('explore')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center shadow-[0_0_16px_rgba(183,109,255,0.4)]">
              <span className="material-symbols-outlined text-on-primary-container text-[20px] font-bold">
                auto_awesome
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
              Eventora<span className="text-primary">.ai</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] uppercase tracking-wider">
              v2.4 Pro
            </span>
          </div>
        </div>

        {/* Central Pill Navigation */}
        <nav className="hidden xl:flex items-center gap-space-xs p-1.5 rounded-full bg-surface-container-low border border-outline-variant/25 shadow-inner">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-space-md py-1.5 rounded-full font-body-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_14px_rgba(183,109,255,0.4)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-2 sm:gap-space-md shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-label-mono-sm text-[12px]">
            <span className="text-primary font-bold">₹</span>
            <span>INR</span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {hasUnreadNotifications && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#b76dff] animate-pulse" />
            )}
          </button>

          {/* Quick Create Event */}
          <button
            onClick={onOpenNewEventModal}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[14px] font-semibold shadow-[0_0_24px_rgba(183,109,255,0.35)] hover:shadow-[0_0_32px_rgba(183,109,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Event</span>
          </button>

          {/* Profile Badge */}
          <div className="flex items-center gap-2 pl-1">
            <div
              title="Autonomous Orchestrator Profile"
              className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/30 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
