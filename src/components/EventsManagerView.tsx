import React from 'react';
import { EventProject } from '../types';
import { initialDreamWedding } from '../services/storage';

interface EventsManagerViewProps {
  events: EventProject[];
  activeEventId: string;
  onSelectEvent: (id: string) => void;
  onOpenNewEventModal: () => void;
  onOpenOnboarding: () => void;
  onShowToast: (message: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const EventsManagerView: React.FC<EventsManagerViewProps> = ({
  events,
  activeEventId,
  onSelectEvent,
  onOpenNewEventModal,
  onOpenOnboarding,
  onShowToast,
  onNavigateToTab,
}) => {
  // Explainable Readiness Score Calculation Helper
  const calculateReadiness = (event: EventProject) => {
    // 1. Task Milestones (40 pts max)
    const totalTasks = event.tasks.length;
    const completedTasks = event.tasks.filter((t) => t.completed).length;
    const taskScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 40) : 0;

    // 2. Budget Discipline (30 pts max)
    const totalBudget = event.totalBudget || 500000;
    const spentBudget = event.expenses.reduce((sum, e) => sum + e.amount, 0);
    const hasExpenses = event.expenses.length > 0;
    const underCeiling = spentBudget <= totalBudget;
    let budgetScore = 0;
    if (event.budgetCategories.length > 0) budgetScore += 15;
    if (hasExpenses) budgetScore += 10;
    if (underCeiling) budgetScore += 5;

    // 3. Vendors & Venue Status (20 pts max)
    const totalVendors = event.vendors.length;
    const confirmedVendors = event.vendors.filter((v) => v.status === 'Confirmed').length;
    const vendorScore = totalVendors > 0 ? Math.round((confirmedVendors / totalVendors) * 20) : 10;

    // 4. Guest RSVPs (10 pts max)
    const totalGuests = event.guestCount || 350;
    const confirmedGuests = event.guests
      .filter((g) => g.status === 'confirmed')
      .reduce((sum, g) => sum + g.partySize, 0);
    const guestScore = Math.min(10, Math.round((confirmedGuests / (totalGuests * 0.7)) * 10));

    const totalScore = Math.min(100, taskScore + budgetScore + vendorScore + guestScore);

    // Missing critical items
    const missingItems: string[] = [];
    if (completedTasks < totalTasks) {
      const topPending = event.tasks.find((t) => !t.completed && t.priority === 'High');
      if (topPending) missingItems.push(`Critical Task: ${topPending.title}`);
    }
    const unconfirmedVendor = event.vendors.find((v) => v.status !== 'Confirmed');
    if (unconfirmedVendor) missingItems.push(`Unconfirmed Vendor: ${unconfirmedVendor.name} (${unconfirmedVendor.role})`);
    if (confirmedGuests < totalGuests * 0.5) missingItems.push(`Pending RSVPs: Only ${confirmedGuests} of ${totalGuests} confirmed`);

    return {
      totalScore,
      taskScore,
      budgetScore,
      vendorScore,
      guestScore,
      completedTasks,
      totalTasks,
      confirmedVendors,
      totalVendors,
      confirmedGuests,
      totalGuests,
      missingItems,
    };
  };

  const activeEvent = events.find((e) => e.id === activeEventId) || events[0];
  const readiness = calculateReadiness(activeEvent);

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Celebration Ready', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-500/30' };
    if (score >= 50) return { label: 'On Track (Active Stage)', color: 'text-primary', bg: 'bg-primary-container/20 border-primary/40' };
    return { label: 'Needs Immediate Attention', color: 'text-amber-300', bg: 'bg-amber-950/80 border-amber-500/30' };
  };

  const status = getScoreStatus(readiness.totalScore);

  const handleDownloadBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `Eventora_AI_All_Events_Backup.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    onShowToast('All events downloaded as JSON backup.');
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] uppercase tracking-wider">
              Project Registry &amp; Readiness
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-primary">
              {events.length} Events Managed
            </span>
          </div>
          <h1 className="font-display-hero text-headline-xl sm:text-headline-xl text-on-surface tracking-tight">
            My Events &amp; Readiness Audit
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Switch between events, monitor deterministic readiness math, and create new celebrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary font-body-sm text-body-sm hover:bg-surface-container-highest transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">timer</span>
            <span>60s Quick Start</span>
          </button>

          <button
            onClick={onOpenNewEventModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold shadow-[0_0_24px_rgba(183,109,255,0.4)] hover:shadow-[0_0_32px_rgba(183,109,255,0.65)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Event Wizard</span>
          </button>
        </div>
      </div>

      {/* FEATURE F: EXPLAINABLE READINESS SCORECARD */}
      <section className="rounded-2xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high border border-outline-variant/25 p-space-lg shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
            <div>
              <span className="text-[11px] font-label-mono-sm text-primary uppercase tracking-wider block">
                Feature F: Explainable Readiness Indicator
              </span>
              <h2 className="font-headline-sm text-[18px] sm:text-[20px] font-bold text-on-surface flex items-center gap-2">
                <span>{activeEvent.title}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-label-mono-sm text-[11px] border ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </h2>
            </div>

            {/* Score Ring */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-highest"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${readiness.totalScore}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline-sm text-[16px] font-bold text-on-surface">
                    {readiness.totalScore}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant uppercase block">
                  Readiness Math
                </span>
                <span className="font-headline-sm text-[14px] text-on-surface">
                  {readiness.totalScore} / 100 Points
                </span>
              </div>
            </div>
          </div>

          {/* 4 Score Pillars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
              <span className="text-[10px] font-label-mono-sm text-on-surface-variant uppercase block">
                1. Milestones (Max 40)
              </span>
              <span className="font-headline-sm text-[18px] font-bold text-primary">
                {readiness.taskScore} pts
              </span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {readiness.completedTasks}/{readiness.totalTasks} tasks cleared
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
              <span className="text-[10px] font-label-mono-sm text-on-surface-variant uppercase block">
                2. Budget (Max 30)
              </span>
              <span className="font-headline-sm text-[18px] font-bold text-primary">
                {readiness.budgetScore} pts
              </span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Categories &amp; escrow active
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
              <span className="text-[10px] font-label-mono-sm text-on-surface-variant uppercase block">
                3. Vendors (Max 20)
              </span>
              <span className="font-headline-sm text-[18px] font-bold text-primary">
                {readiness.vendorScore} pts
              </span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {readiness.confirmedVendors}/{readiness.totalVendors} locked
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20">
              <span className="text-[10px] font-label-mono-sm text-on-surface-variant uppercase block">
                4. RSVPs (Max 10)
              </span>
              <span className="font-headline-sm text-[18px] font-bold text-primary">
                {readiness.guestScore} pts
              </span>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                {readiness.confirmedGuests}/{readiness.totalGuests} confirmed
              </p>
            </div>
          </div>

          {/* Missing items & Recommended next actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="text-[11px] font-label-mono-sm text-amber-300 uppercase block mb-1">
                ⚠️ Critical Gaps to Address
              </span>
              {readiness.missingItems.length === 0 ? (
                <p className="text-[12px] text-emerald-300">All critical foundations are locked!</p>
              ) : (
                <ul className="flex flex-col gap-1 text-[12px] text-on-surface">
                  {readiness.missingItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <span className="text-[11px] font-label-mono-sm text-primary uppercase block mb-1">
                ⚡ Top 3 Next Actions (+18% Boost)
              </span>
              <ul className="flex flex-col gap-1.5 text-[12px] text-on-surface">
                <li className="flex items-center justify-between">
                  <span>1. Mark pending High Priority task complete</span>
                  <span className="font-label-mono-sm text-emerald-400 text-[11px]">+6 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>2. Confirm draft catering quote with chef</span>
                  <span className="font-label-mono-sm text-emerald-400 text-[11px]">+7 pts</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>3. Send digital invitations via WhatsApp Drafter</span>
                  <span className="font-label-mono-sm text-emerald-400 text-[11px]">+5 pts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ALL EVENTS LIST & SWITCHER */}
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-sm text-[18px] font-bold text-on-surface">
            All Planned Projects ({events.length})
          </h2>
          <button
            onClick={handleDownloadBackup}
            className="text-[12px] font-label-mono-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export JSON Backup</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {events.map((evt) => {
            const isSelected = evt.id === activeEventId;
            const evtReadiness = calculateReadiness(evt);

            return (
              <div
                key={evt.id}
                className={`p-space-md rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-md ${
                  isSelected
                    ? 'bg-surface-container-high border-primary ring-2 ring-primary/40'
                    : 'bg-surface-container-low border-outline-variant/20 hover:border-outline-variant/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-[10px] uppercase">
                      {evt.type}
                    </span>
                    {evt.id === initialDreamWedding.id && (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[10px] font-bold">
                        Sample Event
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline-sm text-[16px] font-bold text-on-surface mt-2 truncate">
                    {evt.title}
                  </h3>
                  <p className="text-[12px] font-body-sm text-on-surface-variant mt-0.5">
                    {evt.date} • {evt.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] font-label-mono-sm py-2 border-y border-outline-variant/15">
                  <div>
                    <span className="text-on-surface-variant block uppercase text-[10px]">Budget</span>
                    <span className="font-bold text-on-surface">
                      ₹{evt.totalBudget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block uppercase text-[10px]">Readiness</span>
                    <span className="font-bold text-primary">{evtReadiness.totalScore}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      onSelectEvent(evt.id);
                      onNavigateToTab('dashboard');
                    }}
                    className={`px-4 py-2 rounded-full font-headline-sm text-[12px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface'
                    }`}
                  >
                    {isSelected ? '✓ Active Plan' : 'Select Project'}
                  </button>

                  <button
                    onClick={() => {
                      onSelectEvent(evt.id);
                      onNavigateToTab('simulator');
                    }}
                    className="text-[12px] font-label-mono-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    Simulate →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
