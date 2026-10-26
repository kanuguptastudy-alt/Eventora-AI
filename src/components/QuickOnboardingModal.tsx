import React, { useState } from 'react';
import { EventProject } from '../types';
import { requestAIGeneratedPlan } from '../services/aiService';

interface QuickOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (newEvent: EventProject) => void;
  onExploreSampleEvent: () => void;
  onShowToast: (msg: string) => void;
}

export const QuickOnboardingModal: React.FC<QuickOnboardingModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
  onExploreSampleEvent,
  onShowToast,
}) => {
  const [step, setStep] = useState<number>(1);
  const [eventType, setEventType] = useState<'wedding' | 'birthday' | 'anniversary' | 'school' | 'community' | 'festival'>('wedding');
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState<number>(500000);
  const [customBudget, setCustomBudget] = useState('');
  const [dateOption, setDateOption] = useState<string>('3-months');
  const [customDate, setCustomDate] = useState('');
  const [guestCount, setGuestCount] = useState<number>(150);
  const [location, setLocation] = useState<string>('Jaipur, Rajasthan');
  const [customLocation, setCustomLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  if (!isOpen) return null;

  const eventTypes = [
    { id: 'wedding', label: 'Wedding', icon: 'favorite', desc: 'Sangeet, Vows, Reception' },
    { id: 'birthday', label: 'Birthday', icon: 'cake', desc: 'Milestones & Themed Soirees' },
    { id: 'anniversary', label: 'Anniversary', icon: 'stars', desc: 'Silver, Golden, Milestones' },
    { id: 'school', label: 'College / School', icon: 'school', desc: 'Campus Fests & Galas' },
    { id: 'community', label: 'Community', icon: 'groups', desc: 'Cultural Meets & Societies' },
    { id: 'festival', label: 'Festival / Gala', icon: 'festival', desc: 'Public Celebrations & Fairs' },
  ];

  const budgetPresets = [
    { label: '₹15,000', value: 15000, note: 'Intimate Party' },
    { label: '₹50,000', value: 50000, note: 'Chic Gathering' },
    { label: '₹1.5 Lakhs', value: 150000, note: 'Boutique Event' },
    { label: '₹5 Lakhs', value: 500000, note: 'Grand Celebration' },
    { label: '₹15 Lakhs', value: 1500000, note: 'Royal Luxury' },
  ];

  const locationPresets = [
    'Jaipur, Rajasthan',
    'Mumbai, Maharashtra',
    'Delhi-NCR',
    'Bangalore, Karnataka',
    'Goa',
    'Udaipur, Rajasthan',
  ];

  const calculateTargetDate = () => {
    if (customDate) return customDate;
    const now = new Date();
    if (dateOption === '14-days') {
      now.setDate(now.getDate() + 14);
    } else if (dateOption === '1-month') {
      now.setMonth(now.getMonth() + 1);
    } else if (dateOption === '3-months') {
      now.setMonth(now.getMonth() + 3);
    } else if (dateOption === '6-months') {
      now.setMonth(now.getMonth() + 6);
    }
    return now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const resolvedTitle = title.trim() || `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Celebration 2027`;
    const resolvedLocation = customLocation.trim() || location;
    const resolvedDate = calculateTargetDate();

    setGenerationStep('Synthesizing financial allocations...');
    try {
      const generated = await requestAIGeneratedPlan({
        title: resolvedTitle,
        type: eventType,
        date: resolvedDate,
        location: resolvedLocation,
        guestCount,
        budget,
        theme: eventType === 'wedding' ? 'Royal Violet & Gold' : 'Modern Pastel Lilac',
        specialNotes: 'Generated via 60-second onboarding wizard.',
      });

      setGenerationStep('Assembling run-of-show & vendor targets...');

      const newEvent: EventProject = {
        id: `event-${Date.now()}`,
        title: resolvedTitle,
        type: eventType,
        date: resolvedDate,
        duration: '1 Day (Standard Sequence)',
        location: resolvedLocation,
        guestCount,
        totalBudget: budget,
        spentBudget: 0,
        theme: generated.themePalette?.name || 'Modern Violet Ambiance',
        themeHexPrimary: generated.themePalette?.primaryHex || '#ddb7ff',
        themeHexAccent: generated.themePalette?.accentHex || '#b76dff',
        specialNotes: 'Synthesized via 60s Onboarding flow.',
        conceptSummary: generated.conceptSummary,
        decorHighlights: generated.themePalette?.decorHighlights || [
          'Ambient atmospheric perimeter lighting',
          'Centerpiece floral arrangements',
          'Custom welcome greeting installation',
        ],
        budgetCategories: (generated.budgetBreakdown || []).map((b, idx) => ({
          id: `cat-${idx + 1}`,
          name: b.category,
          allocated: b.allocatedAmount,
          spent: 0,
          color: idx % 2 === 0 ? '#ddb7ff' : '#b76dff',
          icon: idx === 0 ? 'castle' : idx === 1 ? 'restaurant_menu' : 'category',
          notes: b.notes,
        })),
        expenses: [],
        tasks: (generated.timelineTasks || []).map((t, idx) => ({
          id: `task-${idx + 1}`,
          title: t.title,
          phase: t.phase,
          dueInDays: t.dueInDays,
          dueDate: `Due in ${t.dueInDays} days`,
          priority: t.priority,
          completed: false,
          category: t.category,
          description: t.description,
        })),
        runOfShow: (generated.runOfShow || []).map((r, idx) => ({
          id: `ros-${idx + 1}`,
          time: r.time,
          activity: r.activity,
          lead: r.lead,
          location: r.location,
          completed: false,
        })),
        vendors: (generated.vendorRecommendations || []).map((v, idx) => ({
          id: `v-${idx + 1}`,
          role: v.role,
          name: v.suggestedName,
          category: v.role,
          estimatedQuote: v.estimatedQuote,
          actualCost: 0,
          status: v.status,
          notes: v.notes,
        })),
        guests: [
          { id: 'g-1', name: 'VIP Family & Friends', partySize: 4, status: 'confirmed', dietary: 'Vegetarian' },
          { id: 'g-2', name: 'Primary Host Committee', partySize: 2, status: 'confirmed', dietary: 'Standard' },
          { id: 'g-3', name: 'Special Guests', partySize: 2, status: 'pending', dietary: 'Vegetarian' },
        ],
        insights: (generated.aiOptimizations || []).map((o, idx) => ({
          id: `ins-${idx + 1}`,
          type: 'cost_savings' as const,
          category: o.category,
          title: o.title,
          description: o.description,
          savings: o.estimatedSavings,
          actionLabel: 'Apply Delta',
          applied: false,
        })),
        createdAt: new Date().toISOString(),
      };

      onPlanCreated(newEvent);
      onClose();
    } catch (err) {
      console.error('Error generating plan:', err);
      onShowToast('Plan generation experienced an error. Loading starter blueprint.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-surface-container-high border border-outline-variant/30 shadow-[0_16px_60px_rgba(0,0,0,0.8)] p-5 sm:p-7 flex flex-col gap-5 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-container/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary shadow-md">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div>
              <span className="text-[11px] font-label-mono-sm text-primary uppercase tracking-wider block">
                60-Second Onboarding
              </span>
              <h2 className="font-headline-sm text-[18px] sm:text-[20px] font-bold text-on-surface">
                Plan Less. Celebrate More.
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                step >= s ? 'bg-primary shadow-[0_0_8px_#ddb7ff]' : 'bg-surface-container-lowest'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: What are you planning? */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2">
            <div>
              <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                1. What are you planning?
              </h3>
              <p className="text-[13px] font-body-sm text-on-surface-variant">
                Select your celebration category to load tailored templates and benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {eventTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEventType(t.id as any)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all min-h-[88px] cursor-pointer ${
                    eventType === t.id
                      ? 'bg-primary-container/25 border-primary shadow-[0_0_16px_rgba(183,109,255,0.3)] text-on-surface'
                      : 'bg-surface-container border-outline-variant/25 text-on-surface-variant hover:bg-surface-container-highest'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[24px]">{t.icon}</span>
                  <div>
                    <span className="font-headline-sm text-[14px] font-bold block text-on-surface">
                      {t.label}
                    </span>
                    <span className="text-[11px] font-body-sm text-on-surface-variant line-clamp-1">
                      {t.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Event Name / Title (Optional)
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. ${eventType === 'wedding' ? 'Aarav & Meera Wedding' : 'Rohan 25th Birthday Gala'}`}
                className="w-full px-4 py-2.5 mt-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[14px] focus:outline-none focus:border-primary shadow-inner"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Budget & Date */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2">
            <div>
              <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                2. Approximate Budget &amp; Date
              </h3>
              <p className="text-[13px] font-body-sm text-on-surface-variant">
                We'll divide this deterministically into venue, food, decor, and photography.
              </p>
            </div>

            {/* Budget Presets */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Target Budget Ceiling (₹ INR)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {budgetPresets.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => {
                      setBudget(b.value);
                      setCustomBudget('');
                    }}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                      budget === b.value && !customBudget
                        ? 'bg-primary-container text-on-primary-container font-bold border-primary shadow-md'
                        : 'bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="text-[13px] font-headline-sm block">{b.label}</span>
                    <span className="text-[10px] font-label-mono-sm text-on-surface-variant block truncate">
                      {b.note}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[12px] font-label-mono-sm text-on-surface-variant">Custom:</span>
                <input
                  type="number"
                  placeholder="Or enter custom ₹"
                  value={customBudget}
                  onChange={(e) => {
                    setCustomBudget(e.target.value);
                    if (Number(e.target.value) > 0) setBudget(Number(e.target.value));
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Date Options */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                When is it happening?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: '14-days', label: 'In 14 Days' },
                  { id: '1-month', label: 'In 1 Month' },
                  { id: '3-months', label: 'In 3 Months' },
                  { id: '6-months', label: 'In 6 Months' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDateOption(d.id);
                      setCustomDate('');
                    }}
                    className={`py-2 px-2 rounded-xl border text-center text-[12px] font-label-mono-sm transition-all cursor-pointer ${
                      dateOption === d.id && !customDate
                        ? 'bg-primary-container text-on-primary-container font-bold border-primary'
                        : 'bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Guests & City */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-2">
            <div>
              <h3 className="font-headline-sm text-[16px] font-bold text-on-surface">
                3. Guests &amp; Location
              </h3>
              <p className="text-[13px] font-body-sm text-on-surface-variant">
                Almost done! These numbers calibrate catering plates and venue size requirements.
              </p>
            </div>

            {/* Guest Count Slider & Buttons */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                  Expected Guests
                </label>
                <span className="font-headline-sm text-[16px] font-bold text-primary">
                  {guestCount} Attendees
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="800"
                step="10"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] font-label-mono-sm text-on-surface-variant">
                <span>10 (Intimate)</span>
                <span>150 (Standard)</span>
                <span>500+ (Grand)</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Celebration City / Destination
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {locationPresets.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setCustomLocation('');
                    }}
                    className={`py-2 px-2 rounded-xl border text-center text-[12px] font-body-sm transition-all cursor-pointer truncate ${
                      location === loc && !customLocation
                        ? 'bg-primary-container text-on-primary-container font-semibold border-primary'
                        : 'bg-surface-container border-outline-variant/20 text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
              <input
                placeholder="Or enter any city, venue or region"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary shadow-inner"
              />
            </div>
          </div>
        )}

        {/* GENERATING OVERLAY */}
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-surface-container-high/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div>
              <h4 className="font-headline-sm text-[18px] font-bold text-on-surface">
                Synthesizing AI Event Blueprint...
              </h4>
              <p className="text-[13px] font-label-mono-sm text-primary mt-1">
                {generationStep || 'Consulting neural models...'}
              </p>
            </div>
            <span className="text-[11px] font-body-sm text-on-surface-variant max-w-xs">
              Calculating realistic catering brackets, booking milestones, and run-of-show choreography in INR (₹).
            </span>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-outline-variant/15">
          {/* Sample Event Button (Judges & First-Time Users) */}
          <button
            onClick={() => {
              onClose();
              onExploreSampleEvent();
            }}
            className="text-[12px] font-label-mono-sm text-primary hover:underline flex items-center gap-1 min-h-[44px] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span>Explore Clearly Labeled Sample Event</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-4 py-2.5 rounded-full bg-surface-container text-on-surface text-[13px] font-headline-sm min-h-[44px] flex-1 sm:flex-none cursor-pointer"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container text-[13px] font-headline-sm font-semibold shadow-md min-h-[44px] flex-1 sm:flex-none cursor-pointer"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container text-[13px] font-headline-sm font-semibold shadow-[0_0_24px_rgba(183,109,255,0.4)] hover:shadow-[0_0_32px_rgba(183,109,255,0.7)] min-h-[44px] flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span>Generate Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
