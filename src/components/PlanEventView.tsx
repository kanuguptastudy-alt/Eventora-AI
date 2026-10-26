import React, { useState } from 'react';
import { EventProject } from '../types';
import { requestAIGeneratedPlan } from '../services/aiService';

interface PlanEventViewProps {
  onPlanCreated: (newEvent: EventProject) => void;
  preselectedCategory?: 'wedding' | 'birthday' | 'community' | 'anniversary' | 'school' | 'festival';
}

export const PlanEventView: React.FC<PlanEventViewProps> = ({
  onPlanCreated,
  preselectedCategory = 'wedding',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'wedding' | 'birthday' | 'community' | 'anniversary' | 'school' | 'festival'
  >(preselectedCategory);

  const [title, setTitle] = useState('Dream Wedding 2027 — Aarav & Meera');
  const [date, setDate] = useState('Nov 18, 2027');
  const [duration, setDuration] = useState('3 Days (Full Sequence)');
  const [location, setLocation] = useState('Jaipur, Rajasthan');
  const [budget, setBudget] = useState(500000);
  const [guestCount, setGuestCount] = useState(350);
  const [selectedTheme, setSelectedTheme] = useState('Royal Violet & Gold');
  const [specialNotes, setSpecialNotes] = useState(
    'Heritage palace venue in Udaipur or Jaipur with vegan catering options and ambient acoustic sufi night for the Sangeet.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // When category changes, suggest sensible defaults
  const handleCategorySelect = (
    cat: 'wedding' | 'birthday' | 'community' | 'anniversary' | 'school' | 'festival'
  ) => {
    setSelectedCategory(cat);
    if (cat === 'wedding') {
      setTitle('Royal Heritage Wedding 2027');
      setBudget(500000);
      setGuestCount(350);
      setDuration('3 Days (Full Sequence)');
      setSelectedTheme('Royal Violet & Gold');
      setSpecialNotes('Sandstone palace courtyard, royal banquet dining, sunset mandap pheras.');
    } else if (cat === 'birthday') {
      setTitle('Midnight Neon Rooftop 30th Birthday');
      setBudget(75000);
      setGuestCount(60);
      setDuration('1 Evening (6 Hours)');
      setSelectedTheme('Bohemian Twilight');
      setSpecialNotes('Rooftop terrace lounge with artisanal cocktail bar, DJ booth, sculpted metallic cake.');
    } else if (cat === 'community') {
      setTitle('Spring Cultural Gala & Lantern Festival');
      setBudget(350000);
      setGuestCount(500);
      setDuration('2 Days');
      setSelectedTheme('Enchanted Garden');
      setSpecialNotes('Open amphitheater, artisan craft kiosks, stage performances, street food stalls.');
    } else if (cat === 'anniversary') {
      setTitle('Silver Jubilee 25th Anniversary Celebration');
      setBudget(250000);
      setGuestCount(120);
      setDuration('1 Day');
      setSelectedTheme('Minimalist Lavender');
      setSpecialNotes('Intimate candlelit dinner with vintage violin quartet and video retrospective.');
    }
  };

  const themes = [
    { name: 'Royal Violet & Gold', color: 'bg-primary', border: 'border-primary' },
    { name: 'Minimalist Lavender', color: 'bg-secondary-fixed', border: 'border-secondary' },
    { name: 'Bohemian Twilight', color: 'bg-secondary-container', border: 'border-secondary-container' },
    { name: 'Enchanted Garden', color: 'bg-emerald-400', border: 'border-emerald-400' },
  ];

  const budgetPresets = [
    { label: '₹3L Starter', value: 300000 },
    { label: '₹5L Balanced', value: 500000 },
    { label: '₹10L Luxury', value: 1000000 },
    { label: '₹25L Custom Royal', value: 2500000 },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (budget <= 0) {
      setError('Please enter a valid budget.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGenerationStep('Initializing Neural Ingestion Pipeline...');

    try {
      setTimeout(() => setGenerationStep('Synthesizing Category Allocations in INR (₹)...'), 800);
      setTimeout(() => setGenerationStep('Formulating Phase Timelines & Critical Deadlines...'), 1600);
      setTimeout(() => setGenerationStep('Assembling Run-of-Show Choreography...'), 2400);

      const generatedPlan = await requestAIGeneratedPlan({
        title,
        type: selectedCategory,
        date,
        duration,
        location,
        guestCount,
        budget,
        theme: selectedTheme,
        specialNotes,
      });

      const newId = `event-${Date.now()}`;

      // Convert generated plan to complete EventProject model
      const newEvent: EventProject = {
        id: newId,
        title,
        type: selectedCategory,
        date: date || 'Upcoming Date',
        duration: duration || '1 Day',
        location: location || 'To Be Confirmed',
        guestCount: Number(guestCount) || 100,
        totalBudget: Number(budget) || 500000,
        spentBudget: 0,
        theme: generatedPlan.themePalette?.name || selectedTheme,
        themeHexPrimary: generatedPlan.themePalette?.primaryHex || '#ddb7ff',
        themeHexAccent: generatedPlan.themePalette?.accentHex || '#b76dff',
        specialNotes,
        venueName: generatedPlan.vendorRecommendations?.[0]?.suggestedName || `${location} Central Venue`,
        venueImageUrl:
          selectedCategory === 'wedding'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEKGD1p96eWZNR2Ktk0QaLx8dbsuFzYSRMrDFiPmy358n4tTvr-TVMXIZ5EmZFo091VcNnC9D4eK85GiTl3_AIA8TvPGR6bH92JkQbIGDWgi_zX214gQZ3x5RMQDQ06aXhTnO2pdjLRRFpHovzTPsPrIOWkFTFAsOfohOYAoBANBi94z0-uS10TPxpLQjY-gfdGGqgWWK4rtiVR4OpOT-kJdNBgZ1X8NxJObH9HHfM1kixczb_lW4V'
            : selectedCategory === 'birthday'
            ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDUNpJ9Cf1198knSRKNpdO_hEDPMpeDRABmnIQ-iAzATC10SsaiPk5ffe1WP8DUXIHxblml_U6CIfBqEdNuPMT4qZNN7bzGIOpsfTHTGQUEH7mpXaoAacBExog50U1C1bJ7UI06bqKx35PYbC9RCRn6on8hQSPyQW66M_f8fg1Lo_-8W0itHGROXrJ3Sjgms6ZkE8CBRys7szh6bKZfNTnaK1G6MZYb1FXgK1qTQHdM8_a5l-LNmyk'
            : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn2aQOMWmG1v7NSCLYLU26yaNhBid6CLz5byR7VpBdroey0sbK7nJI-mh3VLyN3dfDNP5rUCG2lPUqJxJ2GRoKJBx72Dlwa1DuHXGpTIhEbY3kP5bOHeeiWt3d56SlcBYs2rq0Bv_QOnnJgr1H4ot-UA4sxv-d4ZaS8KxYqG3FsDgpkfAv2DfulLlqdQ0ZLR-IaSHelVlO-pdes1qiJS-AjsMvhDlgY3GX3EbZGWovh8fzoZRGnoQM',
        conceptSummary: generatedPlan.conceptSummary,
        decorHighlights: generatedPlan.themePalette?.decorHighlights || [],
        budgetCategories: generatedPlan.budgetBreakdown.map((item, idx) => ({
          id: `cat-${idx + 1}`,
          name: item.category,
          allocated: item.allocatedAmount,
          spent: 0,
          color: idx % 2 === 0 ? '#ddb7ff' : '#b76dff',
          icon: idx === 0 ? 'castle' : idx === 1 ? 'restaurant_menu' : idx === 2 ? 'local_florist' : idx === 3 ? 'photo_camera' : 'payments',
          notes: item.notes,
        })),
        expenses: [],
        tasks: generatedPlan.timelineTasks.map((t, idx) => ({
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
        runOfShow: generatedPlan.runOfShow.map((ros, idx) => ({
          id: `ros-${idx + 1}`,
          time: ros.time,
          activity: ros.activity,
          lead: ros.lead,
          location: ros.location,
          completed: false,
        })),
        vendors: generatedPlan.vendorRecommendations.map((v, idx) => ({
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
          { id: 'g-1', name: 'Primary Host & Immediate Patrons', partySize: 4, status: 'confirmed', dietary: 'Vegetarian', table: 'Table 1' },
          { id: 'g-2', name: 'Key Honored Guests (VIP)', partySize: 2, status: 'confirmed', dietary: 'Standard', table: 'Table 2' },
        ],
        insights: generatedPlan.aiOptimizations.map((opt, idx) => ({
          id: `ins-${idx + 1}`,
          type: 'cost_savings',
          category: opt.category,
          title: opt.title,
          description: opt.description,
          savings: opt.estimatedSavings,
          actionLabel: 'Apply Delta',
          applied: false,
        })),
        createdAt: new Date().toISOString(),
      };

      onPlanCreated(newEvent);
    } catch (err: any) {
      setError(err?.message || 'Error occurred while synthesizing blueprint.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      {/* Progress Header Bar */}
      <section className="flex flex-col gap-space-sm mb-space-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-space-sm">
            <span className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
              Blueprint Mode
            </span>
            <span className="text-on-surface-variant font-label-mono-md text-label-mono-md">
              Step 01 / 03: Event Blueprint &amp; AI Parameters
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            <span className="font-label-mono-sm text-label-mono-sm text-primary">
              Gemini 3.8 Flash Neural Engine
            </span>
          </div>
        </div>

        {/* Glowing Violet Step Indicator */}
        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden relative shadow-inner">
          <div className="h-full bg-gradient-to-r from-primary via-primary-container to-tertiary-fixed rounded-full w-1/3 shadow-[0_0_12px_#b76dff] transition-all duration-700" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-md">
          <div className="max-w-2xl">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              What are we celebrating?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
              Choose your celebration category or let Eventora AI personalize every detail from your vision.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface-variant font-label-mono-sm text-label-mono-sm shadow-sm">
            <span className="material-symbols-outlined text-[18px] text-primary">model_training</span>
            <span>Auto-calibrating Indian Wedding &amp; INR Logic</span>
          </div>
        </div>
      </section>

      {/* Celebration Category Selector Cards (Bento 3-Column Grid) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg mb-space-2xl" id="categorySelectionGroup">
        {/* CARD 1: Wedding */}
        <article
          role="button"
          tabIndex={0}
          aria-pressed={selectedCategory === 'wedding'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCategorySelect('wedding');
            }
          }}
          onClick={() => handleCategorySelect('wedding')}
          className={`event-card relative rounded-xl p-space-lg cursor-pointer transition-all duration-300 transform overflow-hidden group border focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedCategory === 'wedding'
              ? 'bg-surface-container-low border-primary/50 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.65),0_0_28px_rgba(183,109,255,0.22)] -translate-y-1'
              : 'bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-low hover:border-outline-variant/40'
          }`}
        >
          {selectedCategory === 'wedding' && (
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
          )}

          <div className="flex items-center justify-between mb-space-md relative z-10">
            <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm shadow-[0_0_14px_rgba(221,183,255,0.6)] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span> Most Popular
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors ${
                selectedCategory === 'wedding' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
          </div>

          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-space-md shadow-md">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Grand Indian wedding palace courtyard with violet orchid decorations"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnAoh49NosSpswssYYYdO2dQ0DEkVuIHSPa1NIhs1S7jESISkIL9oGxUyyA2dT_16V6Lth8vyDjbex12afS4pOOUyp3-exg1htmIfa-J_X8hCNaJ-gj_f9klrYtByFWwxvL7_jgudHVKQCZvhjBMMFIUJT3aq1OiySkDDu_yf61iaggAjjzlQHZ3G2W4fp7EOiPoZMoxBFE2-8uFcHUt8DyoTqMVn2ac_1epIjuddiFc4Ws2l0ZQhs"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-mono-sm text-label-mono-sm">
                Royal Palatial
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest/80 backdrop-blur-md text-primary font-label-mono-sm text-label-mono-sm">
                99.4% AI Match
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface">Wedding</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Elegant ceremonies, royal rituals, and unforgettable moments orchestrated to perfection.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-1.5 mt-space-md mb-space-md">
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Multi-day ceremonies
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Sangeet &amp; Reception
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Bridal timeline
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Guest accommodation
            </span>
          </div>

          <div className="relative z-10 pt-space-sm mt-auto flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm border-t border-outline-variant/15">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">groups</span> Avg. 200–800 guests
            </span>
            <span className="text-primary font-semibold">AI Vendor matching active</span>
          </div>
        </article>

        {/* CARD 2: Birthday Celebration */}
        <article
          role="button"
          tabIndex={0}
          aria-pressed={selectedCategory === 'birthday'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCategorySelect('birthday');
            }
          }}
          onClick={() => handleCategorySelect('birthday')}
          className={`event-card relative rounded-xl p-space-lg cursor-pointer transition-all duration-300 transform overflow-hidden group border focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedCategory === 'birthday'
              ? 'bg-surface-container-low border-primary/50 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.65),0_0_28px_rgba(183,109,255,0.22)] -translate-y-1'
              : 'bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-low hover:border-outline-variant/40'
          }`}
        >
          {selectedCategory === 'birthday' && (
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
          )}

          <div className="flex items-center justify-between mb-space-md relative z-10">
            <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
              Milestones &amp; Kids
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors ${
                selectedCategory === 'birthday' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
          </div>

          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-space-md shadow-md">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Birthday celebration rooftop"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDUNpJ9Cf1198knSRKNpdO_hEDPMpeDRABmnIQ-iAzATC10SsaiPk5ffe1WP8DUXIHxblml_U6CIfBqEdNuPMT4qZNN7bzGIOpsfTHTGQUEH7mpXaoAacBExog50U1C1bJ7UI06bqKx35PYbC9RCRn6on8hQSPyQW66M_f8fg1Lo_-8W0itHGROXrJ3Sjgms6ZkE8CBRys7szh6bKZfNTnaK1G6MZYb1FXgK1qTQHdM8_a5l-LNmyk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-mono-sm text-label-mono-sm">
                Intimate Chic
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface">Birthday Celebration</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Personalized milestone parties, surprise gatherings, and creative bespoke themes.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-1.5 mt-space-md mb-space-md">
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Cake &amp; dessert styling
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Entertainment booking
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Theme curation
            </span>
          </div>

          <div className="relative z-10 pt-space-sm mt-auto flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm border-t border-outline-variant/15">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">groups</span> Avg. 30–150 guests
            </span>
            <span>Dynamic DJ / Host</span>
          </div>
        </article>

        {/* CARD 3: Community Event */}
        <article
          role="button"
          tabIndex={0}
          aria-pressed={selectedCategory === 'community'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCategorySelect('community');
            }
          }}
          onClick={() => handleCategorySelect('community')}
          className={`event-card relative rounded-xl p-space-lg cursor-pointer transition-all duration-300 transform overflow-hidden group border focus:outline-none focus:ring-2 focus:ring-primary ${
            selectedCategory === 'community'
              ? 'bg-surface-container-low border-primary/50 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.65),0_0_28px_rgba(183,109,255,0.22)] -translate-y-1'
              : 'bg-surface-container-low/70 border-outline-variant/20 hover:bg-surface-container-low hover:border-outline-variant/40'
          }`}
        >
          {selectedCategory === 'community' && (
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary-container/20 blur-3xl pointer-events-none" />
          )}

          <div className="flex items-center justify-between mb-space-md relative z-10">
            <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-mono-sm text-label-mono-sm">
              Large Scale
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-colors ${
                selectedCategory === 'community' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] font-bold">check</span>
            </div>
          </div>

          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-space-md shadow-md">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Community festival gala"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn2aQOMWmG1v7NSCLYLU26yaNhBid6CLz5byR7VpBdroey0sbK7nJI-mh3VLyN3dfDNP5rUCG2lPUqJxJ2GRoKJBx72Dlwa1DuHXGpTIhEbY3kP5bOHeeiWt3d56SlcBYs2rq0Bv_QOnnJgr1H4ot-UA4sxv-d4ZaS8KxYqG3FsDgpkfAv2DfulLlqdQ0ZLR-IaSHelVlO-pdes1qiJS-AjsMvhDlgY3GX3EbZGWovh8fzoZRGnoQM"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-mono-sm text-label-mono-sm">
                Festival &amp; Gala
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-space-xs">
            <h2 className="font-headline-md text-headline-md text-on-surface">Community &amp; Cultural Event</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Festivals, charity galas, neighborhood gatherings, and shared cultural experiences.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-1.5 mt-space-md mb-space-md">
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Ticketing &amp; RSVP
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Crowd logistics
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Sponsorships
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface-container-high text-on-surface text-[12px] font-body-sm">
              Stage &amp; Audio setup
            </span>
          </div>

          <div className="relative z-10 pt-space-sm mt-auto flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm border-t border-outline-variant/15">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">groups</span> Avg. 100–2,000 guests
            </span>
            <span>Permits &amp; Production</span>
          </div>
        </article>
      </section>

      {/* AI Blueprint Setup Form Panel (Asymmetrical Glass Container) */}
      <form onSubmit={handleGenerate}>
        <section className="rounded-xl bg-surface-container-lowest/80 backdrop-blur-2xl border border-outline-variant/25 p-6 sm:p-space-xl shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] relative overflow-hidden mb-space-xl">
          <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-primary-container/15 blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-lg mb-space-lg border-b border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[24px]">tune</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Event Blueprint Parameters</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Configure initial constraints; our neural pipeline synthesizes run-of-show accordingly.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-label-mono-sm bg-surface-container border border-outline-variant/30 px-3 py-1.5 rounded-lg">
              <span className="material-symbols-outlined text-[16px] text-tertiary">bolt</span>
              <span>Auto-sync enabled for INR calculations</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-container/80 text-on-error-container text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* 2-Column Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
            {/* Left Column: Identifiers & Financials */}
            <div className="flex flex-col gap-space-lg">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="event-title-input"
                  className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider flex items-center justify-between"
                >
                  <span>Event Project Title</span>
                  <span className="text-primary font-bold">Required</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    drive_file_rename_outline
                  </span>
                  <input
                    id="event-title-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:bg-surface-container shadow-inner transition-colors"
                    type="text"
                    required
                    placeholder="e.g. Royal Wedding 2027"
                  />
                </div>
              </div>

              {/* Date & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="event-date-input"
                    className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider"
                  >
                    Event Date
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      calendar_month
                    </span>
                    <input
                      id="event-date-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:bg-surface-container transition-colors"
                      type="text"
                      placeholder="e.g. Nov 18, 2027"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="event-duration-input"
                    className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider"
                  >
                    Duration Span
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                      timelapse
                    </span>
                    <input
                      id="event-duration-input"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:bg-surface-container transition-colors"
                      type="text"
                      placeholder="e.g. 3 Days (Full Sequence)"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="event-location-input"
                  className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider"
                >
                  Location / City
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                    location_on
                  </span>
                  <input
                    id="event-location-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary focus:bg-surface-container transition-colors"
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                  />
                </div>
              </div>

              {/* Budget Input & Quick Presets */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="event-budget-input"
                    className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider"
                  >
                    Estimated Total Budget
                  </label>
                  <span className="font-label-mono-sm text-label-mono-sm text-secondary">
                    Currency: Indian Rupee (₹)
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-headline-md text-headline-sm text-primary font-bold">
                    ₹
                  </span>
                  <input
                    id="event-budget-input"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-headline-sm text-headline-sm tracking-tight focus:outline-none focus:border-primary focus:bg-surface-container transition-colors"
                    type="number"
                    step="5000"
                    min="1000"
                  />
                </div>
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {budgetPresets.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setBudget(p.value)}
                      className={`px-3 py-1 rounded-full font-label-mono-sm text-label-mono-sm transition-all cursor-pointer ${
                        budget === p.value
                          ? 'bg-primary-container text-on-primary-container font-bold shadow-[0_0_10px_rgba(183,109,255,0.4)]'
                          : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Scale, Aesthetics, Prompts */}
            <div className="flex flex-col gap-space-lg">
              {/* Guest Scale Slider + Number Box */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="event-guest-slider"
                    className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider"
                  >
                    Anticipated Guest Count
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                      className="w-20 px-2 py-0.5 rounded-md bg-surface-container-high border border-outline-variant/30 text-center font-label-mono-md text-[13px] text-on-surface focus:outline-none focus:border-primary"
                    />
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-md text-label-mono-md font-bold">
                      Guests
                    </span>
                  </div>
                </div>
                <div className="py-2">
                  <input
                    id="event-guest-slider"
                    type="range"
                    min="20"
                    max="1500"
                    step="10"
                    value={Math.min(1500, guestCount)}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full h-2 rounded-lg bg-surface-container-high appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div className="flex justify-between font-label-mono-sm text-label-mono-sm text-on-surface-variant/70">
                  <span>20 (Intimate)</span>
                  <span>{guestCount} (Selected)</span>
                  <span>1,500+ (Extravaganza)</span>
                </div>
              </div>

              {/* Curated Aesthetic Moodboard */}
              <div className="flex flex-col gap-2">
                <label className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider">
                  Curated Aesthetic Moodboard
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {themes.map((t) => {
                    const isSelected = selectedTheme === t.name;
                    return (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setSelectedTheme(t.name)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary-container/25 border-primary shadow-[0_0_12px_rgba(183,109,255,0.25)] text-on-surface font-semibold'
                            : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${t.color} shadow-[0_0_6px_rgba(221,183,255,0.6)]`} />
                        <span className="font-body-sm text-body-sm truncate">{t.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Creative Prompt Notes */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="event-notes-input"
                  className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">psychology</span>
                    AI Creative Prompt Notes
                  </span>
                  <span className="text-tertiary font-label-mono-sm">Natural Language</span>
                </label>
                <div className="relative">
                  <textarea
                    id="event-notes-input"
                    rows={3}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-sm text-body-sm focus:outline-none focus:border-primary focus:bg-surface-container transition-colors resize-none leading-relaxed"
                    placeholder="Describe specific preferences, dietary desires, musical styling, or VIP requirements..."
                  />
                  <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-on-surface-variant font-label-mono-sm text-[11px] pointer-events-none">
                    <span>{specialNotes.length} chars tokenized</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Action Section */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-space-lg p-space-lg rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">neurology</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-[16px] text-on-surface font-semibold">
                  {isGenerating ? generationStep : 'Generative Engine Standby'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[10px]">
                  {isGenerating ? 'Synthesizing...' : '~4 seconds latency'}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Eventora AI will synthesize budget breakdowns, timeline milestones, and vendor proposals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-md w-full sm:w-auto shrink-0">
            <button
              disabled={isGenerating}
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-container via-primary to-tertiary text-on-primary-container font-headline-sm text-[15px] font-bold shadow-[0_0_24px_rgba(183,109,255,0.45)] hover:shadow-[0_0_36px_rgba(183,109,255,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:pointer-events-none"
            >
              {isGenerating ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  <span>Synthesizing Blueprint...</span>
                </>
              ) : (
                <>
                  <span>Generate My AI Plan</span>
                  <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">
                    auto_awesome
                  </span>
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};
