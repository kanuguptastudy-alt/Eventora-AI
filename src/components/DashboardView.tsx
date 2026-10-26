import React, { useState } from 'react';
import { EventProject, TimelineTask, VendorItem } from '../types';

interface DashboardViewProps {
  event: EventProject;
  onUpdateEvent: (updated: EventProject) => void;
  onNavigateToTab: (tab: string) => void;
  onQuickCopilotPrompt: (prompt: string) => void;
  onShowToast: (message: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  event,
  onUpdateEvent,
  onNavigateToTab,
  onQuickCopilotPrompt,
  onShowToast,
}) => {
  const [copilotInput, setCopilotInput] = useState('');
  const [inspect3DOpen, setInspect3DOpen] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendorRole, setNewVendorRole] = useState('');
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorQuote, setNewVendorQuote] = useState('');

  // Helper to dynamically calculate days remaining from date string
  const calculateDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return 'Upcoming';
    try {
      const parsed = Date.parse(dateStr);
      if (isNaN(parsed)) return 'Upcoming';
      const diffMs = parsed - Date.now();
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (days > 1) return `${days} Days Remaining`;
      if (days === 1) return 'Tomorrow!';
      if (days === 0) return 'Today!';
      return 'Completed';
    } catch {
      return 'Upcoming';
    }
  };

  // Calculations
  const totalBudget = event.totalBudget || 500000;
  const spentBudget = event.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const remainingBudget = totalBudget - spentBudget;
  const spentPct = Math.min(100, Math.round((spentBudget / totalBudget) * 100));

  const totalTasks = event.tasks.length;
  const completedTasks = event.tasks.filter((t) => t.completed).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalGuests = event.guestCount || 350;
  const confirmedGuests = event.guests
    .filter((g) => g.status === 'confirmed')
    .reduce((acc, g) => acc + g.partySize, 0);
  const pendingGuests = event.guests
    .filter((g) => g.status === 'pending')
    .reduce((acc, g) => acc + g.partySize, 0);
  const declinedGuests = event.guests
    .filter((g) => g.status === 'declined')
    .reduce((acc, g) => acc + g.partySize, 0);
  const acceptedPct = totalGuests > 0 ? Math.min(100, Math.round((confirmedGuests / totalGuests) * 100)) : 0;

  const eventYear = (() => {
    const match = event.date?.match(/\b(20\d\d)\b/);
    return match ? match[1] : 'Planned';
  })();

  // Critical pending tasks
  const pendingCriticalTasks = event.tasks.filter((t) => !t.completed).slice(0, 3);

  const toggleTask = (taskId: string) => {
    const updatedTasks = event.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateEvent({ ...event, tasks: updatedTasks });
    onShowToast('Task status synchronized with event ledger.');
  };

  const handleAuthorizeTask = (task: TimelineTask) => {
    // If it's a deposit task, simulate adding to expenses and marking complete
    const isVenueDeposit = task.title.toLowerCase().includes('jagmandir') || task.title.toLowerCase().includes('deposit');
    const depositAmount = isVenueDeposit ? 75000 : 25000;

    const newExpense = {
      id: `exp-${Date.now()}`,
      categoryId: event.budgetCategories[0]?.id || 'cat-1',
      title: `Escrow Release: ${task.title}`,
      amount: depositAmount,
      date: new Date().toISOString().split('T')[0],
      vendor: 'Escrow Vault',
      status: 'paid' as const,
    };

    const updatedTasks = event.tasks.map((t) =>
      t.id === task.id ? { ...t, completed: true } : t
    );

    const updatedExpenses = [...event.expenses, newExpense];
    const newSpent = updatedExpenses.reduce((sum, e) => sum + e.amount, 0);

    onUpdateEvent({
      ...event,
      tasks: updatedTasks,
      expenses: updatedExpenses,
      spentBudget: newSpent,
    });

    onShowToast(`Authorized ₹${depositAmount.toLocaleString('en-IN')} escrow disbursement! Task completed.`);
  };

  const handleApplyInsight = (insightId: string) => {
    const updatedInsights = event.insights.map((ins) =>
      ins.id === insightId ? { ...ins, applied: true } : ins
    );
    onUpdateEvent({ ...event, insights: updatedInsights });
    onShowToast('Insight optimization delta applied to event schedule!');
  };

  const handleAddVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const newVendor: VendorItem = {
      id: `v-${Date.now()}`,
      role: newVendorRole || 'Specialist Vendor',
      name: newVendorName,
      category: newVendorRole || 'Services',
      estimatedQuote: Number(newVendorQuote) || 50000,
      actualCost: 0,
      status: 'In Review',
      notes: 'Added via Dashboard Quick Entry',
    };

    onUpdateEvent({
      ...event,
      vendors: [...event.vendors, newVendor],
    });
    setNewVendorRole('');
    setNewVendorName('');
    setNewVendorQuote('');
    setShowAddVendorModal(false);
    onShowToast(`Vendor "${newVendor.name}" logged successfully.`);
  };

  const handleExportBlueprint = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(event, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_Blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Blueprint downloaded successfully!');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Co-Planner secure invite link copied to clipboard!');
    } else {
      onShowToast('Share link ready!');
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-xl">
      {/* TOP HEADER / EVENT TELEMETRY STRIP */}
      <section className="relative w-full rounded-xl bg-surface-container-low border border-outline-variant/20 p-space-lg shadow-xl overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Verified AI Blueprint
              </span>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface-variant font-label-mono-sm text-label-mono-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                Gemini 3.8 Flash Neural Sync
              </span>
            </div>

            <h1 className="font-display-hero text-headline-xl sm:text-display-hero tracking-tight text-on-surface flex items-center gap-3">
              {event.title}
            </h1>

            <div className="flex items-center gap-3 text-on-surface-variant font-label-mono-md text-label-mono-md flex-wrap">
              <span className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                {calculateDaysRemaining(event.date)}
              </span>
              <span className="text-outline">/</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                {event.date}
              </span>
              <span className="text-outline">/</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {event.location}
              </span>
            </div>
          </div>

          {/* Quick Action Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportBlueprint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container-highest transition-all group cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
                picture_as_pdf
              </span>
              <span>Export Blueprint</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-body-sm shadow-sm hover:bg-surface-container-highest transition-all group cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary group-hover:rotate-12 transition-transform">
                group_add
              </span>
              <span>Share with Co-Planner</span>
            </button>

            <button
              onClick={() => {
                onQuickCopilotPrompt('Re-optimize budget allocations and check for new vendor savings');
                onNavigateToTab('ai-copilot');
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[14px] font-semibold shadow-[0_0_24px_rgba(183,109,255,0.4)] hover:shadow-[0_0_32px_rgba(183,109,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[44px]"
            >
              <span className="material-symbols-outlined text-[18px] animate-spin" style={{ animationDuration: '6s' }}>
                magic_button
              </span>
              <span>AI Re-Optimize</span>
            </button>
          </div>
        </div>
      </section>

      {/* HIGH-IMPACT FINANCIAL & KPI METRICS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-md w-full">
        {/* CARD 1: Total Budget */}
        <div
          onClick={() => onNavigateToTab('budget')}
          className="relative rounded-xl bg-surface-container border border-outline-variant/20 p-space-md shadow-xl flex flex-col justify-between overflow-hidden group hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            <span>Total Ceiling</span>
            <span className="material-symbols-outlined text-primary text-[18px]">account_balance_wallet</span>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              ₹{totalBudget.toLocaleString('en-IN')}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              Allocated ceiling • ₹{remainingBudget.toLocaleString('en-IN')} Free
            </p>
          </div>
          <div className="w-full pt-2">
            <svg className="w-full h-8 text-primary overflow-visible" fill="none" viewBox="0 0 100 24">
              <path
                d="M0 20 Q 20 18, 40 12 T 70 8 T 100 4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <path
                d="M0 20 Q 20 18, 40 12 T 70 8 T 100 4 L 100 24 L 0 24 Z"
                fill="currentColor"
                fillOpacity="0.12"
              />
            </svg>
          </div>
        </div>

        {/* CARD 2: Actual Spent */}
        <div
          onClick={() => onNavigateToTab('budget')}
          className="relative rounded-xl bg-surface-container border border-outline-variant/20 p-space-md shadow-xl flex flex-col justify-between overflow-hidden group hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            <span>Actual Spent</span>
            <span className="material-symbols-outlined text-primary text-[18px]">credit_card</span>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
              ₹{spentBudget.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-2 h-2 rounded-full ${spentPct > 90 ? 'bg-error' : 'bg-emerald-400'}`} />
              <span className={`font-label-mono-sm text-label-mono-sm ${spentPct > 90 ? 'text-error' : 'text-emerald-300'}`}>
                {spentPct > 90 ? 'High Expenditure Warning' : 'Within Safe Threshold'}
              </span>
            </div>
          </div>
          <div className="w-full bg-surface-container-lowest rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                spentPct > 90 ? 'bg-error' : 'bg-primary-container'
              }`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
          <span className="font-caption text-caption text-on-surface-variant mt-2">
            {spentPct}% disbursed to vendors
          </span>
        </div>

        {/* CARD 3: Remaining Budget */}
        <div
          onClick={() => onNavigateToTab('budget')}
          className="relative rounded-xl bg-surface-container border border-outline-variant/20 p-space-md shadow-xl flex flex-col justify-between overflow-hidden group hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            <span>Available Vault</span>
            <span className="material-symbols-outlined text-primary text-[18px]">savings</span>
          </div>
          <div className="my-3">
            <div className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
              ₹{remainingBudget.toLocaleString('en-IN')}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-1">
              {Math.max(0, 100 - spentPct)}% liquidity available for decor &amp; dining
            </p>
          </div>
          <div className="flex items-center justify-between pt-1 font-label-mono-sm text-label-mono-sm text-on-surface-variant">
            <span>Reserved: ₹{(spentBudget / 100000).toFixed(1)}L</span>
            <span>Liquid: ₹{(remainingBudget / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* CARD 4: Planning Progress */}
        <div
          onClick={() => onNavigateToTab('timeline')}
          className="relative rounded-xl bg-surface-container border border-outline-variant/20 p-space-md shadow-xl flex flex-col justify-between overflow-hidden group hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            <span>Orchestration</span>
            <span className="material-symbols-outlined text-primary text-[18px]">task_alt</span>
          </div>
          <div className="flex items-center justify-between my-2">
            <div>
              <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {progressPct}%
              </div>
              <span className="font-caption text-caption text-on-surface-variant">
                {completedTasks} of {totalTasks} Tasks Done
              </span>
            </div>
            {/* Circular Progress Ring */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <path
                  className="text-primary-container"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={`${progressPct}, 100`}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-label-mono-sm text-[10px] text-on-surface">
                +{completedTasks}
              </div>
            </div>
          </div>
          <div className="font-label-mono-sm text-label-mono-sm text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Ahead of {eventYear} Schedule
          </div>
        </div>

        {/* CARD 5: Guest Confirmations */}
        <div
          onClick={() => onNavigateToTab('timeline')}
          className="relative rounded-xl bg-surface-container border border-outline-variant/20 p-space-md shadow-xl flex flex-col justify-between overflow-hidden group hover:bg-surface-container-high hover:border-primary/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            <span>RSVP Stream</span>
            <span className="material-symbols-outlined text-primary text-[18px]">group</span>
          </div>
          <div className="my-2">
            <div className="font-headline-md text-headline-md font-bold text-on-surface">
              {confirmedGuests} / {totalGuests}
            </div>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5">
              {acceptedPct}% accepted • {pendingGuests} pend • {declinedGuests} decl
            </p>
          </div>
          <div className="flex items-center -space-x-2 pt-1">
            <div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-caption font-bold shadow-md">
              AP
            </div>
            <div className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface text-caption font-bold shadow-md">
              RV
            </div>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-caption font-bold shadow-md">
              SK
            </div>
            <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-caption font-bold shadow-md">
              MJ
            </div>
            <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-label-mono-sm text-[10px] font-bold shadow-md">
              +{totalGuests - 4}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg w-full">
        {/* LEFT COLUMN (8 cols / ~2/3) */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* HERO VISUAL ANCHOR: VENUE MOCKUP & RUN OF SHOW STATE */}
          <div className="relative w-full rounded-xl bg-surface-container border border-outline-variant/25 overflow-hidden shadow-xl">
            <div className="relative h-64 w-full">
              <img
                className="w-full h-full object-cover"
                alt="Venue overview"
                src={event.venueImageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEKGD1p96eWZNR2Ktk0QaLx8dbsuFzYSRMrDFiPmy358n4tTvr-TVMXIZ5EmZFo091VcNnC9D4eK85GiTl3_AIA8TvPGR6bH92JkQbIGDWgi_zX214gQZ3x5RMQDQ06aXhTnO2pdjLRRFpHovzTPsPrIOWkFTFAsOfohOYAoBANBi94z0-uS10TPxpLQjY-gfdGGqgWWK4rtiVR4OpOT-kJdNBgZ1X8NxJObH9HHfM1kixczb_lW4V'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/60 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-mono-sm text-label-mono-sm flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Venue Secured
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-mono-sm text-label-mono-sm shadow-md">
                  {event.venueName || 'Imperial Pavilion'}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="font-label-mono-sm text-label-mono-sm text-primary uppercase tracking-widest">
                    Main Ceremony Venue
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                    The Imperial Mandap Pavilion
                  </h2>
                </div>
                <button
                  onClick={() => setInspect3DOpen(true)}
                  className="px-4 py-2 rounded-full bg-surface-container-highest/90 border border-outline-variant/30 backdrop-blur-md text-on-surface hover:text-primary font-body-sm text-body-sm flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">3d_rotation</span>
                  <span>Inspect 3D CAD Mockup</span>
                </button>
              </div>
            </div>
          </div>

          {/* CRITICAL DEADLINES SECTION */}
          <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">crisis_alert</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Upcoming Critical Deadlines
                </h3>
              </div>
              <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase">
                {pendingCriticalTasks.length} Required Actions
              </span>
            </div>

            <div className="flex flex-col gap-space-sm">
              {pendingCriticalTasks.length === 0 ? (
                <div className="p-6 rounded-xl bg-surface-container-low text-center text-on-surface-variant font-body-sm">
                  🎉 All critical deadlines for this phase are authorized and up to date!
                </div>
              ) : (
                pendingCriticalTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container-high transition-all flex flex-col md:flex-row md:items-center justify-between gap-space-sm shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5 rounded-md border border-outline hover:border-primary flex items-center justify-center cursor-pointer transition-colors"
                      >
                        {task.completed && (
                          <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                        )}
                      </button>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline-sm text-[16px] font-semibold text-on-surface">
                            {task.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-label-mono-sm text-[10px] font-bold uppercase ${
                              task.priority === 'High'
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-secondary-container text-on-secondary-container'
                            }`}
                          >
                            Priority: {task.priority}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-3 font-label-mono-sm text-label-mono-sm text-primary mt-1">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">alarm</span>
                            Due in {task.dueInDays} days
                          </span>
                          <span>•</span>
                          <span>Category: {task.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleAuthorizeTask(task)}
                        className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        Authorize Action
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI OPTIMIZATION HIGHLIGHTS CARD */}
          <div className="rounded-xl bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high border border-outline-variant/25 p-space-lg shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Autonomous Planning Insights
                    </h3>
                    <span className="font-caption text-caption text-on-surface-variant">
                      Continuous calculations updated 4 mins ago
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-primary-container/20 text-primary font-label-mono-sm text-label-mono-sm border border-primary/30">
                  99.4% Confidence
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {event.insights.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-space-md rounded-xl bg-surface-container-lowest/70 border border-outline-variant/20 backdrop-blur-md flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-label-mono-sm text-[11px] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">trending_down</span>
                        {ins.savings ? `Saved ₹${ins.savings.toLocaleString('en-IN')}` : 'Advisory'}
                      </span>
                      <span className="text-caption font-label-mono-sm text-on-surface-variant">
                        {ins.category}
                      </span>
                    </div>

                    <p className="font-body-md text-[14px] text-on-surface leading-snug">
                      {ins.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-outline-variant/15">
                      <span className="font-caption text-caption text-secondary">
                        {ins.applied ? '✓ Applied to event' : 'Pre-approved'}
                      </span>
                      <button
                        disabled={ins.applied}
                        onClick={() => handleApplyInsight(ins.id)}
                        className="font-label-mono-sm text-[11px] text-primary hover:underline cursor-pointer disabled:opacity-40"
                      >
                        {ins.applied ? 'Active' : ins.actionLabel || 'Apply Delta'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-surface-container-high/60 border border-outline-variant/20 flex items-center justify-between text-body-sm text-body-sm text-on-surface-variant">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                  Next scheduled vendor settlement execution in 72 hours via automated escrow.
                </span>
                <button
                  onClick={() => onNavigateToTab('budget')}
                  className="font-label-mono-sm text-label-mono-sm text-primary hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Audit Ledger
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols / ~1/3) */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* VENDOR STATUS TRACKER */}
          <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">storefront</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Vendor Status
                </h3>
              </div>
              <button
                onClick={() => setShowAddVendorModal(true)}
                className="text-caption font-label-mono-sm text-primary hover:underline cursor-pointer"
              >
                + New Vendor
              </button>
            </div>

            <div className="flex flex-col gap-space-xs">
              {event.vendors.map((v) => (
                <div
                  key={v.id}
                  className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/15 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">
                        {v.category.toLowerCase().includes('venue')
                          ? 'castle'
                          : v.category.toLowerCase().includes('catering')
                          ? 'restaurant'
                          : v.category.toLowerCase().includes('decor')
                          ? 'local_florist'
                          : 'photo_camera'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[14px] text-on-surface truncate max-w-[130px]">
                        {v.name}
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant truncate max-w-[130px]">
                        {v.role}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full font-label-mono-sm text-[11px] font-semibold flex items-center gap-1 ${
                      v.status === 'Confirmed'
                        ? 'bg-emerald-950 text-emerald-300'
                        : v.status === '80% Draft'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-amber-950 text-amber-300'
                    }`}
                  >
                    {v.status === 'Confirmed' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK AI COPILOT PROMPT WIDGET */}
          <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl relative overflow-hidden flex flex-col gap-space-md">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Eventora AI Copilot
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Ask generative orchestrator to benchmark vendor proposals, run contract analysis, or adjust tax calculations.
            </p>

            {/* Prompt input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (copilotInput.trim()) {
                  onQuickCopilotPrompt(copilotInput);
                  setCopilotInput('');
                  onNavigateToTab('ai-copilot');
                }
              }}
              className="relative w-full"
            >
              <input
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-outline text-body-sm font-body-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                placeholder="Ask Copilot to negotiate vendor quotes..."
                type="text"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 w-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  onQuickCopilotPrompt('Compare caterer per-plate rate');
                  onNavigateToTab('ai-copilot');
                }}
                className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-mono-sm text-[11px] transition-all cursor-pointer"
              >
                "Compare caterer per-plate rate"
              </button>
              <button
                onClick={() => {
                  onQuickCopilotPrompt('Generate Baraat route timing and sunset coordination');
                  onNavigateToTab('ai-copilot');
                }}
                className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-mono-sm text-[11px] transition-all cursor-pointer"
              >
                "Generate Baraat route timing"
              </button>
            </div>
          </div>

          {/* RECENT ACTIVITY FEED */}
          <div className="rounded-xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Recent Activity
              </h3>
              <span className="material-symbols-outlined text-outline text-[18px]">history</span>
            </div>
            <div className="relative pl-6 flex flex-col gap-space-md">
              <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-surface-container-highest" />

              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container" />
                <span className="font-headline-sm text-[13px] text-on-surface font-medium">
                  Escrow disbursement prepared
                </span>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  ₹75,000 pending second verification for Jagmandir Palace Venue.
                </p>
                <span className="font-label-mono-sm text-[10px] text-outline">
                  18 mins ago • Auto-Trigger
                </span>
              </div>

              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-secondary-container ring-4 ring-surface-container" />
                <span className="font-headline-sm text-[13px] text-on-surface font-medium">
                  Guest RSVP milestone unlocked
                </span>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  238 attendees reached. Dietary preferences logged into caterer sheet.
                </p>
                <span className="font-label-mono-sm text-[10px] text-outline">
                  2 hours ago • Guest Portal
                </span>
              </div>

              <div className="relative flex flex-col gap-0.5">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-surface-container-highest ring-4 ring-surface-container" />
                <span className="font-headline-sm text-[13px] text-on-surface font-medium">
                  AI Model Optimized Brass Band
                </span>
                <p className="font-body-sm text-[12px] text-on-surface-variant">
                  Replaced Agency quote: saved ₹32,000 in total allocation.
                </p>
                <span className="font-label-mono-sm text-[10px] text-outline">
                  5 hours ago • Gemini Engine
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D CAD Mockup Inspector Modal */}
      {inspect3DOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl p-6 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">view_in_ar</span>
                <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
                  3D Venue Spatial Architecture — Jagmandir Island
                </h3>
              </div>
              <button
                onClick={() => setInspect3DOpen(false)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-black/60 border border-outline-variant/30 flex items-center justify-center">
              <img
                src={event.venueImageUrl}
                alt="Venue 3D CAD Mockup"
                className="w-full h-full object-cover filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/70 pointer-events-none" />
              {/* Overlay architectural points */}
              <div className="absolute top-1/4 left-1/3 p-2 rounded-lg bg-surface-container-lowest/80 border border-primary/40 backdrop-blur-md text-[11px] font-label-mono-sm text-primary flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Varmala Sunset Elevation +4.2m
              </div>
              <div className="absolute bottom-1/3 right-1/4 p-2 rounded-lg bg-surface-container-lowest/80 border border-secondary/40 backdrop-blur-md text-[11px] font-label-mono-sm text-secondary flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                Artisanal Dining Counter Zone (350 pax)
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-on-surface font-label-mono-sm text-[11px] bg-black/70 px-3 py-1.5 rounded-md backdrop-blur-md">
                <span>Rendering Engine: WebGL 3D CAD Wireframe</span>
                <span className="text-emerald-400">FPS: 60 • Zero Collision Errors</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-body-sm text-[13px] text-on-surface-variant">
                Includes solar angle calculation for golden-hour sunset vows at 5:48 PM.
              </span>
              <button
                onClick={() => setInspect3DOpen(false)}
                className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold"
              >
                Done Inspecting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="font-headline-sm text-[18px] text-on-surface font-bold">
                Add Vendor to Project
              </h3>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddVendor} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Vendor Name
                </label>
                <input
                  required
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  placeholder="e.g. Royal Soundcraft Artisans"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Service / Category
                </label>
                <input
                  required
                  value={newVendorRole}
                  onChange={(e) => setNewVendorRole(e.target.value)}
                  placeholder="e.g. Acoustic Sufi Band"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Estimated Quotation (₹ INR)
                </label>
                <input
                  type="number"
                  value={newVendorQuote}
                  onChange={(e) => setNewVendorQuote(e.target.value)}
                  placeholder="e.g. 45000"
                  className="w-full px-3 py-2 mt-1 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-body-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold"
                >
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
