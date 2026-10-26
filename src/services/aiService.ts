import { EventProject, BudgetCategory, TimelineTask, RunOfShowItem, VendorItem, AIInsight } from '../types';

export interface PlanGenerationRequest {
  title: string;
  type: string;
  date: string;
  duration?: string;
  location: string;
  guestCount: number;
  budget: number;
  theme: string;
  specialNotes?: string;
}

export async function checkAIStatus(): Promise<{ active: boolean; model: string }> {
  try {
    const res = await fetch('/api/gemini/status');
    if (!res.ok) throw new Error('Status failed');
    return await res.json();
  } catch {
    return { active: false, model: 'Autonomous Algorithmic Fallback' };
  }
}

export async function requestAIGeneratedPlan(req: PlanGenerationRequest): Promise<{
  conceptSummary: string;
  themePalette: {
    name: string;
    description: string;
    primaryHex: string;
    accentHex: string;
    decorHighlights: string[];
  };
  budgetBreakdown: { category: string; allocatedAmount: number; notes: string }[];
  timelineTasks: {
    title: string;
    phase: string;
    dueInDays: number;
    priority: 'High' | 'Medium' | 'Normal';
    description: string;
    category: string;
  }[];
  runOfShow: { time: string; activity: string; lead: string; location: string }[];
  vendorRecommendations: {
    role: string;
    suggestedName: string;
    estimatedQuote: number;
    status: 'Confirmed' | 'In Review' | '80% Draft' | 'Shortlisted';
    notes: string;
  }[];
  contingencyPlans: { risk: string; mitigation: string }[];
  aiOptimizations: {
    category: string;
    title: string;
    description: string;
    estimatedSavings: number;
    type: string;
  }[];
}> {
  try {
    const res = await fetch('/api/gemini/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.plan) {
        return data.plan;
      }
    }
  } catch (err) {
    console.warn('Backend Gemini API call encountered error, activating neural algorithmic engine:', err);
  }

  // Deterministic high-caliber fallback engine matching Eventora AI quality
  return generateDeterministicPlan(req);
}

export async function sendCopilotMessage(
  message: string,
  eventContext: Partial<EventProject>
): Promise<{
  reply: string;
  suggestedActions: {
    actionType: 'budget_adjustment' | 'add_task' | 'update_theme' | 'advice_only';
    label: string;
    description: string;
    payload?: any;
  }[];
  quickReplies: string[];
}> {
  try {
    const res = await fetch('/api/gemini/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, eventContext }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reply) {
        return {
          reply: data.reply,
          suggestedActions: data.suggestedActions || [],
          quickReplies: data.quickReplies || [],
        };
      }
    }
  } catch (err) {
    console.warn('Backend Copilot API error, fallback activated:', err);
  }

  return generateDeterministicCopilotResponse(message, eventContext);
}

export interface ThemeStudioRequest {
  eventType: string;
  preferredColors?: string;
  mood?: string;
  venueType?: string;
  budgetLevel?: string;
  culturalContext?: string;
}

export interface ThemeConcept {
  id: string;
  title: string;
  tagline: string;
  palette: {
    primaryHex: string;
    secondaryHex: string;
    accentHex: string;
    neutralHex: string;
    paletteName: string;
  };
  decorHighlights: string[];
  lightingAndAmbiance: string;
  invitationConcept: string;
  dressCodeSuggestion: string;
  estimatedCostTier: string;
  practicalExecutionTip: string;
}

export async function requestThemeStudio(req: ThemeStudioRequest): Promise<ThemeConcept[]> {
  try {
    const res = await fetch('/api/gemini/theme-studio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.concepts && Array.isArray(data.concepts) && data.concepts.length > 0) {
        return data.concepts;
      }
    }
  } catch (err) {
    console.warn('Backend Theme Studio API error, activating fallback generator:', err);
  }

  return generateDeterministicThemeConcepts(req);
}

export interface InvitationDraftRequest {
  eventTitle: string;
  eventType: string;
  date?: string;
  location?: string;
  tone?: string;
  hostNames?: string;
  rsvpDeadline?: string;
  format?: string;
}

export interface InvitationDraftResponse {
  whatsappDraft: string;
  formalDraft: string;
  subjectLine: string;
  highlights: string[];
}

export async function requestInvitationDraft(req: InvitationDraftRequest): Promise<InvitationDraftResponse> {
  try {
    const res = await fetch('/api/gemini/invitation-draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.whatsappDraft) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend Invitation Draft API error, activating fallback:', err);
  }

  return generateDeterministicInvitationDraft(req);
}

function generateDeterministicThemeConcepts(req: ThemeStudioRequest): ThemeConcept[] {
  return [
    {
      id: 'concept-1',
      title: 'Celestial Twilight Violet & Antique Gold',
      tagline: 'An ethereal nocturnal palace atmosphere with glowing lilac reflections',
      palette: {
        primaryHex: '#ddb7ff',
        secondaryHex: '#b76dff',
        accentHex: '#f5d485',
        neutralHex: '#1e1924',
        paletteName: 'Imperial Lilac & Champagne',
      },
      decorHighlights: [
        'Cascading lavender and white wisteria canopy with fiber-optic micro-stars',
        'Brushed brass candelabras with ivory pillar candles along reflecting pools',
        'Deep plum velvet lounge seating with gold thread embroidered bolsters',
        'Backlit floral arches framing key ceremonial focal points',
      ],
      lightingAndAmbiance: 'Warm perimeter uplighting with soft amber and ultraviolet washes. Subdued candlelit intimacy.',
      invitationConcept: 'Laser-cut plum velvet folder with hot-stamped gold foil typography and wax seal.',
      dressCodeSuggestion: 'Royal Indian Formal / Black Tie Elegance (Shades of Lilac, Wine, Midnight Navy, or Champagne)',
      estimatedCostTier: 'Luxury Heritage (Top Tier)',
      practicalExecutionTip: 'Rent reusable architectural LED trussing rather than building custom wooden rigs to save up to 25% on labor.',
    },
    {
      id: 'concept-2',
      title: 'Minimalist Botanical Rose & Sage',
      tagline: 'Refined modern celebration infused with organic flora and clean lines',
      palette: {
        primaryHex: '#f3c5c5',
        secondaryHex: '#a8c5a2',
        accentHex: '#d8a47f',
        neutralHex: '#22252a',
        paletteName: 'Flora Modernist',
      },
      decorHighlights: [
        'Suspended eucalyptus and blush rose garland installations',
        'Matte linen table runners on raw light-wood banquets',
        'Geometric copper wire lanterns with fairy filament orbs',
        'Bespoke terracotta stoneware with pressed wildflower place markers',
      ],
      lightingAndAmbiance: 'Diffused 2700K warm incandescent glow with bistro string festoons overhead.',
      invitationConcept: 'Handmade deckle-edge seed paper with debossed rose gold calligraphy and botanic illustration.',
      dressCodeSuggestion: 'Modern Pastel Chic (Soft blush, eucalyptus sage, sand, and terracotta linen)',
      estimatedCostTier: 'Balanced Premium',
      practicalExecutionTip: 'Source in-season local foliage like eucalyptus and bougainvillea to lower exotic import costs.',
    },
    {
      id: 'concept-3',
      title: 'Cyber Kinetic Electric Neon & Obsidian',
      tagline: 'High-energy futuristic celebration with pulsing kinetic geometry',
      palette: {
        primaryHex: '#c084fc',
        secondaryHex: '#38bdf8',
        accentHex: '#f43f5e',
        neutralHex: '#0f172a',
        paletteName: 'Neon Twilight Wave',
      },
      decorHighlights: [
        'Infinite LED tunnel walkway for arrival moments',
        'Holographic acrylic table centerpieces with kinetic light refraction',
        'Laser-mapped projection backdrop behind performance stage',
        'Glow-in-the-dark signature cocktail bar with reactive LED coasters',
      ],
      lightingAndAmbiance: 'DMX-controlled automated beam fixtures synced to musical tempo with low-lying dry ice fog.',
      invitationConcept: 'Translucent frosted holographic acrylic card with scannable dynamic QR badge and NFC touch-in.',
      dressCodeSuggestion: 'Avant-Garde Cocktail / Cyber Glam (Metallics, sharp obsidian blacks, and neon accents)',
      estimatedCostTier: 'Cutting-Edge High Production',
      practicalExecutionTip: 'Hire a student VJ from a local design college to run custom projection mappings for 40% of agency rates.',
    },
  ];
}

function generateDeterministicInvitationDraft(req: InvitationDraftRequest): InvitationDraftResponse {
  return {
    subjectLine: `✨ You are cordially invited to ${req.eventTitle} | ${req.date || 'Upcoming'}`,
    whatsappDraft: `✨ *CELEBRATION INVITATION* ✨\n\nDear Friends & Family,\n\n${req.hostNames || 'We'} warmly request the pleasure of your company at the celebration of:\n\n🎉 *${req.eventTitle}*\n\n📅 *Date:* ${req.date || 'Upcoming'}\n📍 *Venue:* ${req.location || 'Jaipur, Rajasthan'}\n👔 *Dress Code:* Royal Festive / Semi-Formal Elegance\n\nKindly confirm your presence by *${req.rsvpDeadline || '7 days prior'}* to help us curate your experience.\n\nRSVP link: eventora.ai/rsvp/${req.eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}\n\nWith warm regards,\n*${req.hostNames || 'The Host Family'}*`,
    formalDraft: `With joy in our hearts, ${req.hostNames || 'the Host Family'} solicit the honour of your presence at the ceremonial celebration of ${req.eventTitle}.\n\nPlease join us as we gather to commemorate this joyful milestone with fine hospitality, music, and banquet dining on ${req.date || 'the designated evening'} at ${req.location || 'the Grand Pavilion'}.\n\nYour presence and blessings are our greatest gift.\n\nKindly RSVP by ${req.rsvpDeadline || 'two weeks prior'}.`,
    highlights: [
      'Personalized WhatsApp-ready text with bold formatting and emoji styling',
      'Direct RSVP link placeholder for instant guest confirmation',
      'Clear venue and schedule coordinates',
    ],
  };
}

// Fallback plan generator with deterministic INR arithmetic
function generateDeterministicPlan(req: PlanGenerationRequest) {
  const b = req.budget || 500000;
  const isWedding = req.type.toLowerCase().includes('wedding');
  const isBirthday = req.type.toLowerCase().includes('birthday');
  const isCommunity = req.type.toLowerCase().includes('community') || req.type.toLowerCase().includes('festival');

  // Realistic category percentages
  const venuePct = isWedding ? 0.30 : isBirthday ? 0.25 : 0.35;
  const cateringPct = isWedding ? 0.28 : isBirthday ? 0.35 : 0.25;
  const decorPct = isWedding ? 0.18 : isBirthday ? 0.15 : 0.15;
  const photoPct = isWedding ? 0.10 : isBirthday ? 0.10 : 0.08;
  const entertainmentPct = isWedding ? 0.08 : isBirthday ? 0.10 : 0.12;
  const miscPct = 1 - (venuePct + cateringPct + decorPct + photoPct + entertainmentPct);

  const budgetBreakdown = [
    {
      category: 'Venue & Staging',
      allocatedAmount: Math.round(b * venuePct),
      notes: `Secures premiere space for ${req.guestCount} guests in ${req.location || 'prime location'}.`,
    },
    {
      category: 'Catering & Beverages',
      allocatedAmount: Math.round(b * cateringPct),
      notes: `Custom menus with live interactive food stations (est. ₹${Math.round((b * cateringPct) / (req.guestCount || 100))}/plate).`,
    },
    {
      category: 'Decor & Illumination',
      allocatedAmount: Math.round(b * decorPct),
      notes: `Theme styling in ${req.theme || 'Royal Violet & Gold'} with atmospheric ambient lighting.`,
    },
    {
      category: 'Photography & Media',
      allocatedAmount: Math.round(b * photoPct),
      notes: 'Cinematic stills, drone perspectives, and same-day highlights video reel.',
    },
    {
      category: 'Entertainment & Audio',
      allocatedAmount: Math.round(b * entertainmentPct),
      notes: 'State-of-the-art acoustic sound system, MC host, and bespoke curated musical troupe.',
    },
    {
      category: 'Logistics & Contingency',
      allocatedAmount: Math.round(b * miscPct),
      notes: 'Escrow buffer for council permissions, transport, power backup, and unexpected extensions.',
    },
  ];

  const timelineTasks = [
    {
      title: 'Lock Venue Lease & Municipal Sound Permits',
      phase: 'Early Stage (3-6 Months Out)',
      dueInDays: 7,
      priority: 'High' as const,
      description: `Finalize binding contract with venue management in ${req.location || 'destination'} and lock curfew exemptions.`,
      category: 'Venue',
    },
    {
      title: 'Executive Chef Menu Tasting & Dietary Register',
      phase: 'Early Stage (3-6 Months Out)',
      dueInDays: 14,
      priority: 'Medium' as const,
      description: `Curate bespoke dishes and establish allergen/vegan options for ${req.guestCount} guests.`,
      category: 'Catering',
    },
    {
      title: 'Sign Off 3D CAD Decor & Floral Prototype',
      phase: 'Mid Planning (1-2 Months Out)',
      dueInDays: 24,
      priority: 'Medium' as const,
      description: `Approve the ${req.theme || 'Royal Violet'} lighting fixtures, archway fabrication, and entrance installations.`,
      category: 'Decor',
    },
    {
      title: 'Dispatch Digital RSVP Portals to Guest Register',
      phase: 'Mid Planning (1-2 Months Out)',
      dueInDays: 35,
      priority: 'High' as const,
      description: `Collect digital confirmations and track seating preferences for all ${req.guestCount} invited patrons.`,
      category: 'Guests',
    },
    {
      title: 'Acoustic Audio Engineering & Live Sound Check',
      phase: 'Final Stretch (1-2 Weeks Out)',
      dueInDays: 50,
      priority: 'Normal' as const,
      description: 'Calibrate perimeter decibel levels and synchronize live microphone feeds.',
      category: 'Production',
    },
    {
      title: 'Day-of Logistics Walkthrough & Vendor Escrow Clearance',
      phase: 'Event Week',
      dueInDays: 60,
      priority: 'High' as const,
      description: 'Final rehearsal with core team, coordinating delivery docks and emergency vehicle access.',
      category: 'Operations',
    },
  ];

  const runOfShow = [
    { time: '04:00 PM', activity: 'Guest arrival & signature welcoming elixir reception', lead: 'Hospitality Concierge', location: 'Foyer / Grand Entrance' },
    { time: '05:15 PM', activity: 'Formal procession & opening ceremonies', lead: 'Stage Director', location: 'Main Pavilion' },
    { time: '06:30 PM', activity: 'Golden Hour ceremonial highlight & portrait photography', lead: 'Lead Cinematographer', location: 'Scenic Courtyard' },
    { time: '08:00 PM', activity: 'Gourmet banquet dinner opens with artisanal live counters', lead: 'Executive Caterer', location: 'Dining Grand Hall' },
    { time: '09:30 PM', activity: 'Headline live performance, celebration toasts & cake cutting', lead: 'Entertainment MC', location: 'Performance Stage' },
    { time: '11:00 PM', activity: 'Celebratory farewell with ambient illumination finale', lead: 'Operations Lead', location: 'Outdoor Promenade' },
  ];

  const vendorRecommendations = [
    {
      role: 'Prime Venue Partner',
      suggestedName: `${req.location || 'Grand Heritage'} Royal Pavilion`,
      estimatedQuote: Math.round(b * venuePct),
      status: 'Shortlisted' as const,
      notes: 'Matches aesthetic palette and acoustics requirement.',
    },
    {
      role: 'Culinary Artisan',
      suggestedName: 'Gourmet Artisans Collective',
      estimatedQuote: Math.round(b * cateringPct),
      status: 'Shortlisted' as const,
      notes: 'Specializes in multi-course customized fusion cuisine.',
    },
    {
      role: 'Atmospheric Scenography',
      suggestedName: 'Luminescent Mood Scapes',
      estimatedQuote: Math.round(b * decorPct),
      status: 'Shortlisted' as const,
      notes: `Custom ${req.theme || 'Violet'} fabrications and floral structures.`,
    },
    {
      role: 'Cinematic Media Agency',
      suggestedName: 'Aura Lens Studios',
      estimatedQuote: Math.round(b * photoPct),
      status: 'Shortlisted' as const,
      notes: 'Multi-cam 4K cinema coverage with drone licenses.',
    },
  ];

  return {
    conceptSummary: `A meticulously planned celebration titled "${req.title}" tailored for ${req.guestCount} guests, harmonizing luxurious ${req.theme} aesthetics with high-efficiency resource allocation.`,
    themePalette: {
      name: req.theme || 'Royal Violet & Gold',
      description: `Curated chromatic palette blending ethereal deep violets, rich obsidian backgrounds, and gleaming champagne highlights.`,
      primaryHex: '#ddb7ff',
      accentHex: '#b76dff',
      decorHighlights: [
        `Sculptural entry portal with dramatic violet backlighting`,
        `Ambient candlelit table scapes with metallic floral accents`,
        `Low-profile lounge seating in rich plum textures`,
        `Precision acoustic lighting beams synchronized to key milestones`,
      ],
    },
    budgetBreakdown,
    timelineTasks,
    runOfShow,
    vendorRecommendations,
    contingencyPlans: [
      { risk: 'Inclement Weather or High Winds', mitigation: 'Waterproof marquee canopy standby and pre-wired secondary indoor ballroom backup.' },
      { risk: 'Power Grid Fluctuation', mitigation: 'Dual redundant silent diesel generators locked on continuous automatic transfer switch.' },
      { risk: 'Guest Count Surge (+15%)', mitigation: 'Buffer banquet inventory and 30 additional place settings pre-staged in culinary prep area.' },
    ],
    aiOptimizations: [
      {
        category: 'Vendor Negotiation',
        title: 'Direct Guild Contracting Arbitrage',
        description: 'Contracting musicians and staging artisans directly through local production guilds yields an estimated 16% rate reduction.',
        estimatedSavings: Math.round(b * 0.05),
        type: 'cost_savings',
      },
      {
        category: 'Aesthetic Efficiency',
        title: 'Re-usable Structural Trussing',
        description: 'Using modular architectural lighting towers that transition from daytime ceremony to evening dinner eliminates duplicate rig fees.',
        estimatedSavings: Math.round(b * 0.03),
        type: 'cost_savings',
      },
    ],
  };
}

function generateDeterministicCopilotResponse(message: string, context: Partial<EventProject>) {
  const lower = message.toLowerCase();
  const currentBudget = context?.totalBudget || 500000;

  if (lower.includes('reduce') && (lower.includes('10%') || lower.includes('budget') || lower.includes('cost') || lower.includes('save'))) {
    const targetBudget = Math.round(currentBudget * 0.9);
    const savings = currentBudget - targetBudget;
    return {
      reply: `I have analyzed your allocation of ₹${currentBudget.toLocaleString('en-IN')}. By optimizing the decor staging trussing and switching to direct guild contracting for music, we can comfortably reduce your target ceiling by 10% (a savings of ₹${savings.toLocaleString('en-IN')}), bringing your new ceiling to ₹${targetBudget.toLocaleString('en-IN')} without compromising guest hospitality.`,
      suggestedActions: [
        {
          actionType: 'budget_adjustment' as const,
          label: `Apply 10% Reduction (₹${targetBudget.toLocaleString('en-IN')})`,
          description: `Adjust total budget ceiling to ₹${targetBudget.toLocaleString('en-IN')} and rebalance category limits proportionally.`,
          payload: { newBudget: targetBudget, savingAmount: savings },
        },
      ],
      quickReplies: ['Show category rebalance', 'Negotiate caterer per-plate', 'Lock this budget'],
    };
  }

  if (lower.includes('theme') || lower.includes('lavender') || lower.includes('decor') || lower.includes('aesthetic')) {
    return {
      reply: `A Minimalist Lavender theme would look breathtaking for "${context.title || 'your event'}". We can pair soft French lavender drapes with brushed platinum cutlery, warm architectural fairy-light ceilings, and fragrant dried lavender sprigs at each place setting. Would you like me to update your aesthetic moodboard?`,
      suggestedActions: [
        {
          actionType: 'update_theme' as const,
          label: 'Adopt Minimalist Lavender Theme',
          description: 'Switch active theme palette to Minimalist Lavender (#E5DEFF / #C8C2E9).',
          payload: { newThemeName: 'Minimalist Lavender' },
        },
      ],
      quickReplies: ['Review floral budget', 'Inspect 3D moodboard', 'Check lighting plan'],
    };
  }

  if (lower.includes('birthday') && (lower.includes('15000') || lower.includes('15,000') || lower.includes('party'))) {
    return {
      reply: `For an intimate celebration within ₹15,000, our optimal allocation is:\n• Venue/Lounge Booth: ₹5,000 (Reserved chic cafe alcove or rooftop terrace)\n• Cake & Artisanal Desserts: ₹3,500 (Bespoke 1.5kg tiered designer cake)\n• Gourmet Appetizers & Drinks: ₹4,500 (Grazing platter & signature mocktails for 15-20 guests)\n• Modern Metallic Balloon & Ambient LED Decor: ₹2,000\nTotal: ₹15,000. Clean, elegant, and zero waste!`,
      suggestedActions: [
        {
          actionType: 'budget_adjustment' as const,
          label: 'Set Budget to ₹15,000',
          description: 'Update project ceiling to ₹15,000 with scaled category buckets.',
          payload: { newBudget: 15000, savingAmount: currentBudget - 15000 },
        },
      ],
      quickReplies: ['Generate 1-day timeline', 'Suggest playlist styles', 'Draft invite text'],
    };
  }

  if (lower.includes('timeline') || lower.includes('30 days') || lower.includes('schedule') || lower.includes('task')) {
    return {
      reply: `Here is your 30-day countdown flight plan for "${context.title || 'the celebration'}":\n• Day 1-7: Lock primary vendors and finalize deposit escrows.\n• Day 8-15: Send invitations and initiate dietary preference tracking.\n• Day 16-22: Conduct audio-visual sound check and final decor mockups.\n• Day 23-28: Confirm final headcounts and print place cards.\n• Day 29-30: Rehearsal run-of-show and emergency kits inspection.`,
      suggestedActions: [
        {
          actionType: 'add_task' as const,
          label: 'Add 30-Day Checkpoint Milestone',
          description: 'Add "30-Day Critical Review & Vendor Reconfirmation" to your active timeline.',
          payload: {
            taskTitle: '30-Day Critical Review & Vendor Reconfirmation',
            taskPriority: 'High',
            taskDueDays: 30,
          },
        },
      ],
      quickReplies: ['Add all 5 milestones', 'View day-of schedule', 'Export run-of-show'],
    };
  }

  // General intelligent response
  return {
    reply: `I have reviewed "${context.title || 'your event'}" with ${context.guestCount || 350} guests and ₹${(context.totalBudget || 500000).toLocaleString('en-IN')} budget. All systems are operating smoothly. We are currently tracking ₹${(context.spentBudget || 215000).toLocaleString('en-IN')} in actual disbursements with ₹${((context.totalBudget || 500000) - (context.spentBudget || 215000)).toLocaleString('en-IN')} available in your reserve vault. What specific area would you like to refine?`,
    suggestedActions: [],
    quickReplies: [
      'Compare caterer per-plate rate',
      'Generate Baraat route timing',
      'Reduce budget by 10%',
      'Review critical deadlines',
    ],
  };
}
