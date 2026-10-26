import React, { useState } from 'react';
import { EventProject } from '../types';

interface WhatIfSimulatorProps {
  event: EventProject;
  onUpdateEvent: (updated: EventProject) => void;
  onShowToast: (message: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  event,
  onUpdateEvent,
  onShowToast,
}) => {
  // Base values from active event
  const baseBudget = event.totalBudget || 500000;
  const baseGuests = event.guestCount || 350;

  // Simulator controls
  const [simGuestDelta, setSimGuestDelta] = useState<number>(0); // e.g. -50 to +150
  const [simVenueTier, setSimVenueTier] = useState<'current' | 'heritage' | 'lawn' | 'banquet'>('current');
  const [simTimelineCompression, setSimTimelineCompression] = useState<'normal' | 'rushed' | 'relaxed'>('normal');
  const [simBudgetAdjustmentPct, setSimBudgetAdjustmentPct] = useState<number>(0); // -30% to +30%
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  // Computed simulation
  const simulatedGuests = Math.max(10, baseGuests + simGuestDelta);
  const guestRatio = simulatedGuests / baseGuests;

  // Venue multiplier
  const venueMultiplier =
    simVenueTier === 'heritage'
      ? 1.25
      : simVenueTier === 'lawn'
      ? 0.85
      : simVenueTier === 'banquet'
      ? 0.70
      : 1.0;

  // Budget adjustment
  const budgetMultiplier = 1 + simBudgetAdjustmentPct / 100;
  const simulatedTotalBudget = Math.round(baseBudget * budgetMultiplier * (0.5 + 0.5 * guestRatio));
  const budgetDelta = simulatedTotalBudget - baseBudget;

  // Cost per guest
  const basePerGuest = Math.round(baseBudget / baseGuests);
  const simPerGuest = Math.round(simulatedTotalBudget / simulatedGuests);

  // Complexity & Stress Index (1-10)
  const complexityIndex = Math.min(
    10,
    Math.max(
      2,
      Math.round(
        5 +
          (simTimelineCompression === 'rushed' ? 3 : simTimelineCompression === 'relaxed' ? -2 : 0) +
          (simGuestDelta > 100 ? 2 : simGuestDelta < -50 ? -1 : 0) +
          (simVenueTier === 'heritage' ? 1 : simVenueTier === 'banquet' ? -1 : 0)
      )
    )
  );

  const handleApplyScenario = () => {
    // Apply simulated numbers to event
    const updated = {
      ...event,
      guestCount: simulatedGuests,
      totalBudget: simulatedTotalBudget,
      specialNotes: `${event.specialNotes || ''} [Applied Simulator Scenario: ${simulatedGuests} guests, budget ₹${simulatedTotalBudget.toLocaleString('en-IN')}]`,
    };

    onUpdateEvent(updated);
    setShowApplyConfirm(false);
    onShowToast(`Applied simulation! Guest count set to ${simulatedGuests}, Budget set to ₹${simulatedTotalBudget.toLocaleString('en-IN')}`);
  };

  const handleReset = () => {
    setSimGuestDelta(0);
    setSimVenueTier('current');
    setSimTimelineCompression('normal');
    setSimBudgetAdjustmentPct(0);
    onShowToast('Simulator parameters reset to current event baseline.');
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] uppercase tracking-wider">
              Deterministic Scenario Modeling
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-primary">
              Zero Destructive Impact Until Applied
            </span>
          </div>
          <h1 className="font-display-hero text-headline-xl sm:text-headline-xl text-on-surface tracking-tight">
            Plan Comparison &amp; "What If?" Simulator
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Explore how modifying headcount, venue tiers, or date urgency alters overall costs, task volume, and planning stress.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface text-[12px] font-label-mono-sm hover:bg-surface-container-high transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          <span>Reset Baseline</span>
        </button>
      </div>

      {/* DUAL COMPARISON COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        {/* COLUMN 1: BASELINE PLAN (A) */}
        <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/15">
              <div>
                <span className="font-label-mono-sm text-[11px] text-on-surface-variant uppercase tracking-wider block">
                  Scenario A (Saved Baseline)
                </span>
                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">
                  {event.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-mono-sm text-[11px]">
                Active Blueprint
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/15">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Total Budget Ceiling
                </span>
                <span className="font-headline-sm text-[20px] font-bold text-on-surface">
                  ₹{baseBudget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/15">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Guest Count
                </span>
                <span className="font-headline-sm text-[20px] font-bold text-on-surface">
                  {baseGuests} Patrons
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/15">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Est. Per Guest Spend
                </span>
                <span className="font-headline-sm text-[18px] font-bold text-primary">
                  ₹{basePerGuest.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/15">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Complexity Index
                </span>
                <span className="font-headline-sm text-[18px] font-bold text-emerald-400">
                  5 / 10 (Moderate)
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-[13px] font-body-sm text-on-surface-variant">
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span>Venue Specification:</span>
                <span className="text-on-surface font-medium">{event.venueName || 'Jagmandir Palace'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span>Active Milestones:</span>
                <span className="text-on-surface font-medium">{event.tasks.length} Action Items</span>
              </div>
              <div className="flex justify-between py-1 border-b border-outline-variant/10">
                <span>Vendor Shortlists:</span>
                <span className="text-on-surface font-medium">{event.vendors.length} Partners</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container-low text-[12px] font-body-sm text-on-surface-variant">
            ℹ️ Your saved event state is protected. Experiment with variables on the right to see projected financial impact.
          </div>
        </div>

        {/* COLUMN 2: SIMULATED SCENARIO (B) */}
        <div className="rounded-2xl bg-surface-container-high border-2 border-primary/40 p-space-lg shadow-2xl flex flex-col justify-between gap-4 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
              <div>
                <span className="font-label-mono-sm text-[11px] text-primary uppercase tracking-wider block">
                  Scenario B (Simulated Delta)
                </span>
                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">
                  Dynamic "What If" Model
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full font-label-mono-sm text-[11px] font-bold ${
                  budgetDelta > 0
                    ? 'bg-amber-950 text-amber-300'
                    : budgetDelta < 0
                    ? 'bg-emerald-950 text-emerald-300'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                {budgetDelta > 0
                  ? `+₹${budgetDelta.toLocaleString('en-IN')}`
                  : budgetDelta < 0
                  ? `-₹${Math.abs(budgetDelta).toLocaleString('en-IN')}`
                  : 'Parity'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Projected Budget
                </span>
                <span
                  className={`font-headline-sm text-[20px] font-bold ${
                    budgetDelta > 0 ? 'text-amber-300' : 'text-emerald-400'
                  }`}
                >
                  ₹{simulatedTotalBudget.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Simulated Guests
                </span>
                <span className="font-headline-sm text-[20px] font-bold text-on-surface">
                  {simulatedGuests} Patrons
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Projected Spend / Guest
                </span>
                <span className="font-headline-sm text-[18px] font-bold text-primary">
                  ₹{simPerGuest.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-[11px] font-label-mono-sm text-on-surface-variant block uppercase">
                  Projected Complexity
                </span>
                <span
                  className={`font-headline-sm text-[18px] font-bold ${
                    complexityIndex >= 8
                      ? 'text-error'
                      : complexityIndex >= 6
                      ? 'text-amber-300'
                      : 'text-emerald-400'
                  }`}
                >
                  {complexityIndex} / 10 ({complexityIndex >= 8 ? 'High Stress' : complexityIndex >= 6 ? 'Demanding' : 'Comfortable'})
                </span>
              </div>
            </div>

            {/* CONTROLS AREA */}
            <div className="flex flex-col gap-4 pt-2">
              {/* SLIDER 1: Guest Delta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[12px] font-label-mono-sm">
                  <span className="text-on-surface-variant uppercase">
                    Guest Count Delta: {simGuestDelta >= 0 ? `+${simGuestDelta}` : simGuestDelta}
                  </span>
                  <span className="text-primary font-bold">{simulatedGuests} Total</span>
                </div>
                <input
                  type="range"
                  min="-150"
                  max="250"
                  step="10"
                  value={simGuestDelta}
                  onChange={(e) => setSimGuestDelta(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* SLIDER 2: Budget Delta */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[12px] font-label-mono-sm">
                  <span className="text-on-surface-variant uppercase">
                    Budget Variance: {simBudgetAdjustmentPct >= 0 ? `+${simBudgetAdjustmentPct}%` : `${simBudgetAdjustmentPct}%`}
                  </span>
                  <span className="text-secondary font-bold">₹{simulatedTotalBudget.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  step="5"
                  value={simBudgetAdjustmentPct}
                  onChange={(e) => setSimBudgetAdjustmentPct(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* SELECTOR: Venue Tier */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Venue Tier Modeling
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'current', label: 'Current Venue' },
                    { id: 'heritage', label: 'Royal Palace (+25%)' },
                    { id: 'lawn', label: 'Open Lawn (-15%)' },
                    { id: 'banquet', label: 'Banquet (-30%)' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSimVenueTier(v.id as any)}
                      className={`p-2 rounded-xl border text-center text-[11px] font-label-mono-sm transition-all cursor-pointer ${
                        simVenueTier === v.id
                          ? 'bg-primary-container text-on-primary-container font-bold border-primary'
                          : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SELECTOR: Timeline Urgency */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Timeline Compression
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'relaxed', label: 'Relaxed (6+ Mo)' },
                    { id: 'normal', label: 'Balanced (60 Days)' },
                    { id: 'rushed', label: 'Urgent (14 Days)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSimTimelineCompression(t.id as any)}
                      className={`p-2 rounded-xl border text-center text-[11px] font-label-mono-sm transition-all cursor-pointer ${
                        simTimelineCompression === t.id
                          ? 'bg-primary-container text-on-primary-container font-bold border-primary'
                          : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
            <span className="text-[11px] font-body-sm text-on-surface-variant">
              Changes stay in simulator until applied.
            </span>

            <button
              onClick={() => setShowApplyConfirm(true)}
              className="px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold shadow-[0_0_20px_rgba(183,109,255,0.4)] hover:shadow-[0_0_30px_rgba(183,109,255,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Apply Scenario to Event
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showApplyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-surface-container-high border border-outline-variant/30 p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-primary">
              <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
              <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">
                Apply Simulated Plan?
              </h3>
            </div>
            <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
              This will update <strong className="text-on-surface">"{event.title}"</strong> to{' '}
              <strong className="text-primary">{simulatedGuests} guests</strong> and a target budget of{' '}
              <strong className="text-primary">₹{simulatedTotalBudget.toLocaleString('en-IN')}</strong>. Existing expense records will be preserved.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                onClick={() => setShowApplyConfirm(false)}
                className="px-4 py-2 rounded-full bg-surface-container text-on-surface text-[13px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyScenario}
                className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold cursor-pointer shadow-md"
              >
                Confirm &amp; Update Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
