import React, { useState, useEffect } from 'react';
import { EventProject } from './types';
import { loadEvents, saveEvents, getActiveEventId, setActiveEventId, initialDreamWedding } from './services/storage';
import { checkAIStatus } from './services/aiService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExploreView } from './components/ExploreView';
import { PlanEventView } from './components/PlanEventView';
import { DashboardView } from './components/DashboardView';
import { BudgetTrackerView } from './components/BudgetTrackerView';
import { TimelineView } from './components/TimelineView';
import { AICopilotView } from './components/AICopilotView';
import { ThemeStudioView } from './components/ThemeStudioView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { EventsManagerView } from './components/EventsManagerView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PlannerMenuSheet } from './components/PlannerMenuSheet';
import { QuickOnboardingModal } from './components/QuickOnboardingModal';
import { DemoModal } from './components/DemoModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  const [events, setEvents] = useState<EventProject[]>(() => loadEvents());
  const [activeEventId, setActiveEventIdState] = useState<string>(() => getActiveEventId());
  const [activeTab, setActiveTab] = useState<string>('explore');
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [plannerMenuSheetOpen, setPlannerMenuSheetOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [aiActive, setAiActive] = useState(false);
  const [copilotPrompt, setCopilotPrompt] = useState<string>('');
  const [preselectedCategory, setPreselectedCategory] = useState<
    'wedding' | 'birthday' | 'community' | 'anniversary' | 'school' | 'festival'
  >('wedding');

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Escrow disbursement prepared',
      description: '₹75,000 pending second verification for Jagmandir Palace Venue.',
      time: '18 mins ago',
      type: 'info' as const,
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Guest RSVP milestone unlocked',
      description: '238 attendees reached. Dietary preferences logged into caterer sheet.',
      time: '2 hours ago',
      type: 'success' as const,
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Saved ₹32,000 via Brass Guild',
      description: 'AI model arbitraged direct artisan rates over corporate booking agencies.',
      time: '5 hours ago',
      type: 'success' as const,
      unread: false,
    },
    {
      id: 'notif-4',
      title: 'Golden Hour Sunset Advisory',
      description: 'Sunset calculated at 5:48 PM in Jaipur. Pheras schedule aligned with golden hour.',
      time: '1 day ago',
      type: 'alert' as const,
      unread: false,
    },
  ]);

  // Check AI Status on mount
  useEffect(() => {
    checkAIStatus().then((status) => {
      setAiActive(status.active);
    });
  }, []);

  // Save events whenever updated
  const handleUpdateEvents = (newEvents: EventProject[]) => {
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  const activeEvent =
    events.find((e) => e.id === activeEventId) || events[0] || initialDreamWedding;

  const handleUpdateActiveEvent = (updated: EventProject) => {
    const updatedList = events.map((e) => (e.id === updated.id ? updated : e));
    handleUpdateEvents(updatedList);
  };

  const handleSelectEvent = (id: string) => {
    setActiveEventIdState(id);
    setActiveEventId(id);
    showToast(`Switched active project to "${events.find((e) => e.id === id)?.title || 'Selected Event'}"`);
  };

  const handlePlanCreated = (newEvent: EventProject) => {
    const updatedList = [newEvent, ...events];
    handleUpdateEvents(updatedList);
    setActiveEventIdState(newEvent.id);
    setActiveEventId(newEvent.id);
    setActiveTab('dashboard');
    showToast(`🎉 "${newEvent.title}" blueprint synthesized and loaded!`);
  };

  const handleExploreSampleEvent = () => {
    const exists = events.find((e) => e.id === initialDreamWedding.id);
    if (!exists) {
      handleUpdateEvents([initialDreamWedding, ...events]);
    }
    setActiveEventIdState(initialDreamWedding.id);
    setActiveEventId(initialDreamWedding.id);
    setActiveTab('dashboard');
    showToast('Loaded clearly labeled Sample Event: Dream Wedding 2027 (Jaipur Palace)');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveTab('ai-copilot');
        showToast('AI Copilot search activated');
      } else if (e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setOnboardingModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isExplore = activeTab === 'explore';

  return (
    <div className="bg-background text-on-surface min-h-screen relative font-body-md selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* Background ambient radial glow */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(183,109,255,0.08)_0%,rgba(21,18,26,0)_70%)]" />

      {/* Render top Navbar if in Explore mode, otherwise Sidebar on lg + mobile header */}
      {isExplore ? (
        <Navbar
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          hasUnreadNotifications={notifications.some((n) => n.unread)}
          onOpenNewEventModal={() => setOnboardingModalOpen(true)}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />
      ) : (
        <>
          {/* Sidebar on desktop */}
          <div className="hidden lg:block">
            <Sidebar
              activeTab={activeTab}
              onNavigate={(tab) => setActiveTab(tab)}
              activeEvent={activeEvent}
              allEvents={events}
              onSelectEvent={handleSelectEvent}
              onOpenNewEventModal={() => setOnboardingModalOpen(true)}
              aiActive={aiActive}
            />
          </div>

          {/* Top Header for Workflow Views */}
          <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 sm:h-20 bg-surface-container-lowest/90 backdrop-blur-2xl shadow-[0_1px_16px_rgba(0,0,0,0.3)] z-40 flex items-center justify-between px-3 sm:px-space-xl border-b border-outline-variant/15">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-surface-container text-on-surface hover:text-primary transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                aria-label="Open Navigation Drawer"
              >
                <span className="material-symbols-outlined text-[20px]">menu</span>
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <div
                  onClick={() => setActiveTab('explore')}
                  className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-on-primary text-[16px]">auto_awesome</span>
                </div>
                <span
                  onClick={() => setActiveTab('explore')}
                  className="font-headline-sm text-headline-sm tracking-tight text-on-surface cursor-pointer hidden sm:inline"
                >
                  Eventora<span className="text-primary">.ai</span>
                </span>
              </div>

              {/* Currency badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface-variant font-label-mono-sm text-[11px] shrink-0">
                <span className="text-primary font-bold">₹</span>
                <span className="hidden xs:inline">INR Active</span>
              </div>

              {/* Active Event title badge */}
              <span className="hidden md:inline font-headline-sm text-[13px] text-on-surface-variant truncate max-w-[180px]">
                {activeEvent.title}
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-space-md shrink-0">
              {/* 60s Onboarding Quick Trigger */}
              <button
                onClick={() => setOnboardingModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary font-body-sm text-[12px] hover:bg-surface-container-highest transition-colors cursor-pointer"
                title="60-Second Onboarding Wizard"
              >
                <span className="material-symbols-outlined text-[15px]">timer</span>
                <span>60s Quick Start</span>
              </button>

              {/* Notifications */}
              <button
                onClick={() => setNotificationsOpen(true)}
                aria-label="Notifications"
                className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {notifications.some((n) => n.unread) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#b76dff]" />
                )}
              </button>

              {/* Create Event Button */}
              <button
                onClick={() => setActiveTab('plan-event')}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[12px] sm:text-[13px] font-semibold shadow-[0_0_20px_rgba(183,109,255,0.35)] hover:shadow-[0_0_30px_rgba(183,109,255,0.6)] min-h-[44px] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span className="hidden xs:inline">New Plan</span>
              </button>

              {/* Profile Avatar */}
              <button
                onClick={() => setActiveTab('my-events')}
                title="My Events & Profile"
                className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary cursor-pointer hover:scale-105 transition-transform"
                aria-label="View My Events"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>
            </div>
          </header>
        </>
      )}

      {/* Main Content Viewport */}
      <main
        className={`relative z-10 w-full pt-16 sm:pt-20 pb-28 lg:pb-16 bg-background ${
          isExplore ? '' : 'lg:pl-72 px-3 sm:px-space-xl pt-20 sm:pt-24'
        }`}
      >
        {activeTab === 'explore' && (
          <ExploreView
            onPlanEvent={() => setOnboardingModalOpen(true)}
            onOpenDemo={() => setDemoModalOpen(true)}
            onSelectCategoryQuickstart={(cat) => {
              setPreselectedCategory(cat);
              setActiveTab('plan-event');
            }}
          />
        )}

        {activeTab === 'plan-event' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <PlanEventView
              onPlanCreated={handlePlanCreated}
              preselectedCategory={preselectedCategory}
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <DashboardView
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onQuickCopilotPrompt={(prompt) => {
                setCopilotPrompt(prompt);
                setActiveTab('ai-copilot');
              }}
              onShowToast={showToast}
            />
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <BudgetTrackerView
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              onShowToast={showToast}
              onOpenCopilotWithPrompt={(prompt) => {
                setCopilotPrompt(prompt);
                setActiveTab('ai-copilot');
              }}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <TimelineView
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              onShowToast={showToast}
              onNavigateToCopilot={(prompt) => {
                setCopilotPrompt(prompt);
                setActiveTab('ai-copilot');
              }}
            />
          </div>
        )}

        {activeTab === 'theme-studio' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <ThemeStudioView
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              onShowToast={showToast}
              onNavigateToCopilot={(prompt) => {
                setCopilotPrompt(prompt);
                setActiveTab('ai-copilot');
              }}
            />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <WhatIfSimulator
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              onShowToast={showToast}
            />
          </div>
        )}

        {activeTab === 'my-events' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <EventsManagerView
              events={events}
              activeEventId={activeEventId}
              onSelectEvent={handleSelectEvent}
              onOpenNewEventModal={() => setActiveTab('plan-event')}
              onOpenOnboarding={() => setOnboardingModalOpen(true)}
              onShowToast={showToast}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'ai-copilot' && (
          <div className="max-w-[1440px] mx-auto py-space-md">
            <AICopilotView
              event={activeEvent}
              onUpdateEvent={handleUpdateActiveEvent}
              onShowToast={showToast}
              initialPrompt={copilotPrompt}
            />
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        activeTab={activeTab}
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenQuickMenu={() => setPlannerMenuSheetOpen(true)}
        unreadCount={notifications.filter((n) => n.unread).length}
      />

      {/* MOBILE PLANNER BOTTOM SHEET */}
      <PlannerMenuSheet
        isOpen={plannerMenuSheetOpen}
        onClose={() => setPlannerMenuSheetOpen(false)}
        onNavigate={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
      />

      {/* QUICK 60-SECOND ONBOARDING MODAL */}
      <QuickOnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onPlanCreated={handlePlanCreated}
        onExploreSampleEvent={handleExploreSampleEvent}
        onShowToast={showToast}
      />

      {/* Consistent Stitch Footer (Desktop & Tablet) */}
      <footer
        className={`hidden lg:block relative z-10 w-full bg-surface-container-lowest py-space-xl border-t border-outline-variant/15 shadow-[0_-1px_16px_rgba(0,0,0,0.3)] ${
          isExplore ? '' : 'lg:pl-72'
        }`}
      >
        <div className="w-full px-4 sm:px-margin flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="flex items-center gap-space-md">
            <span
              className="font-headline-sm text-headline-sm tracking-tight text-on-surface cursor-pointer"
              onClick={() => setActiveTab('explore')}
            >
              Eventora<span className="text-primary">.ai</span>
            </span>
            <span className="font-caption text-caption text-on-surface-variant">
              © 2027 Eventora AI Inc. Plan Less. Celebrate More.
            </span>
          </div>

          <div className="flex items-center gap-space-sm px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#ddb7ff]" />
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface">
              {aiActive ? 'Gemini 3.8 Flash Neural Pipeline Active' : 'Autonomous Local Reasoning Engine Active'}
            </span>
          </div>

          <div className="flex items-center gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <button
              onClick={() => {
                setActiveTab('ai-copilot');
                showToast('AI Copilot search activated');
              }}
              className="font-label-mono-sm text-label-mono-sm px-2 py-1 rounded bg-surface-container-high border border-outline-variant/30 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              ⌘K Copilot
            </button>
            <button
              onClick={() => setOnboardingModalOpen(true)}
              className="font-label-mono-sm text-label-mono-sm px-2 py-1 rounded bg-surface-container-high border border-outline-variant/30 text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Shift+N Quick 60s
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="relative w-72 h-full bg-surface-container-lowest shadow-2xl">
            <Sidebar
              activeTab={activeTab}
              onNavigate={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              activeEvent={activeEvent}
              allEvents={events}
              onSelectEvent={(id) => {
                handleSelectEvent(id);
                setMobileSidebarOpen(false);
              }}
              onOpenNewEventModal={() => {
                setOnboardingModalOpen(true);
                setMobileSidebarOpen(false);
              }}
              aiActive={aiActive}
            />
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-surface-container text-on-surface hover:text-primary z-50 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close Mobile Navigation"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close backdrop"
          />
        </div>
      )}

      {/* 90s Synthesis Demo Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onStartPlanning={() => {
          setDemoModalOpen(false);
          setOnboardingModalOpen(true);
        }}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
          showToast('All notifications marked as read.');
        }}
        onClear={() => {
          setNotifications([]);
          showToast('Alerts cleared.');
        }}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm px-4 py-3 rounded-2xl bg-surface-container-highest border border-primary/40 text-on-surface font-label-mono-sm text-[12px] shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <span className="w-2 h-2 rounded-full bg-primary shrink-0 animate-ping" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
