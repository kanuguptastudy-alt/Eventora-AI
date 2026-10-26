import React, { useState } from 'react';
import { EventProject } from '../types';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
  activeEvent: EventProject;
  allEvents: EventProject[];
  onSelectEvent: (id: string) => void;
  onOpenNewEventModal: () => void;
  aiActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onNavigate,
  activeEvent,
  allEvents,
  onSelectEvent,
  onOpenNewEventModal,
  aiActive,
}) => {
  const [showProjectPicker, setShowProjectPicker] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'my-events', label: 'My Events & Readiness', icon: 'event_note' },
    { id: 'plan-event', label: 'Plan Event Wizard', icon: 'auto_awesome' },
    { id: 'budget', label: 'Smart Budget Optimizer', icon: 'payments' },
    { id: 'timeline', label: 'Timeline & Run-of-Show', icon: 'schedule' },
    { id: 'theme-studio', label: 'AI Theme Studio', icon: 'palette' },
    { id: 'simulator', label: 'Plan Simulator', icon: 'insights' },
    { id: 'ai-copilot', label: 'AI Copilot', icon: 'psychology' },
    { id: 'explore', label: 'Explore Inspirations', icon: 'explore' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest z-50 flex flex-col shadow-[1px_0_16px_rgba(0,0,0,0.4)] border-r border-outline-variant/15">
      {/* Brand header */}
      <div
        className="h-20 px-space-md flex items-center justify-between gap-space-sm border-b border-outline-variant/10 cursor-pointer"
        onClick={() => onNavigate('explore')}
      >
        <div className="flex items-center gap-space-sm">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-[0_0_12px_rgba(183,109,255,0.4)]">
            <span className="material-symbols-outlined text-on-primary text-[18px]">auto_awesome</span>
          </div>
          <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">
            Eventora<span className="text-primary">.ai</span>
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-mono-sm text-[10px] font-semibold">
          Pro
        </span>
      </div>

      {/* Active Project Card with Dropdown Switcher */}
      <div className="px-space-md py-space-sm relative">
        <div
          onClick={() => setShowProjectPicker(!showProjectPicker)}
          className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 flex flex-col gap-1 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-[10px] uppercase">
            <span>Active Project</span>
            <span className="material-symbols-outlined text-[16px] text-primary group-hover:rotate-180 transition-transform">
              expand_more
            </span>
          </div>
          <span className="font-headline-sm text-[15px] text-on-surface truncate font-semibold">
            {activeEvent.title}
          </span>
          <div className="flex items-center justify-between">
            <span className="font-label-mono-md text-label-mono-md text-primary font-bold">
              ₹{activeEvent.totalBudget.toLocaleString('en-IN')} Budget
            </span>
            <span className="text-caption font-label-mono-sm text-on-surface-variant">
              {activeEvent.guestCount} guests
            </span>
          </div>
        </div>

        {/* Project Picker Popover */}
        {showProjectPicker && (
          <div className="absolute top-full left-space-md right-space-md z-50 mt-1 bg-surface-container-high rounded-xl border border-outline-variant/40 shadow-2xl p-2 flex flex-col gap-1">
            <div className="text-caption font-label-mono-sm text-on-surface-variant px-2 py-1 uppercase">
              All Celebrations
            </div>
            {allEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => {
                  onSelectEvent(ev.id);
                  setShowProjectPicker(false);
                }}
                className={`p-2 rounded-lg text-left flex items-center justify-between transition-colors cursor-pointer ${
                  ev.id === activeEvent.id
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface hover:bg-surface-container-highest'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="text-[13px] truncate">{ev.title}</div>
                  <div className="text-[11px] opacity-80">₹{ev.totalBudget.toLocaleString('en-IN')}</div>
                </div>
                {ev.id === activeEvent.id && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>
            ))}
            <div className="border-t border-outline-variant/30 pt-1 mt-1">
              <button
                onClick={() => {
                  setShowProjectPicker(false);
                  onOpenNewEventModal();
                }}
                className="w-full p-2 rounded-lg bg-surface-container text-primary hover:bg-primary/20 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Create New Celebration</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-space-md py-space-sm flex flex-col gap-1.5 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_16px_rgba(183,109,255,0.35)]'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-body-md text-body-md'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer telemetry */}
      <div className="p-space-md bg-surface-container-low/50 border-t border-outline-variant/10">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-high border border-outline-variant/20">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                aiActive ? 'bg-primary opacity-75' : 'bg-emerald-400 opacity-75'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                aiActive ? 'bg-primary' : 'bg-emerald-400'
              }`}
            />
          </span>
          <span className="font-label-mono-sm text-[11px] text-on-surface-variant truncate">
            {aiActive ? 'Gemini 3.8 Flash Neural Engine' : 'Algorithmic Mode Active'}
          </span>
        </div>
      </div>
    </aside>
  );
};
