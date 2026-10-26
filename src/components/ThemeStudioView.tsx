import React, { useState } from 'react';
import { EventProject } from '../types';
import { requestThemeStudio, ThemeConcept } from '../services/aiService';

interface ThemeStudioViewProps {
  event: EventProject;
  onUpdateEvent: (updated: EventProject) => void;
  onShowToast: (message: string) => void;
  onNavigateToCopilot: (prompt: string) => void;
}

export const ThemeStudioView: React.FC<ThemeStudioViewProps> = ({
  event,
  onUpdateEvent,
  onShowToast,
  onNavigateToCopilot,
}) => {
  const [eventType, setEventType] = useState(event.type || 'wedding');
  const [preferredColors, setPreferredColors] = useState('Violet, Gold & Champagne');
  const [mood, setMood] = useState('Royal, Romantic & Candlelit');
  const [venueType, setVenueType] = useState('Heritage Palace / Open Lawn');
  const [budgetLevel, setBudgetLevel] = useState('Balanced Luxury');
  const [culturalContext, setCulturalContext] = useState('Indian Celebratory Tradition');

  const [isLoading, setIsLoading] = useState(false);
  const [concepts, setConcepts] = useState<ThemeConcept[]>([
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
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onShowToast('Consulting AI Moodboard Director...');

    try {
      const generated = await requestThemeStudio({
        eventType,
        preferredColors,
        mood,
        venueType,
        budgetLevel,
        culturalContext,
      });
      if (generated && generated.length > 0) {
        setConcepts(generated);
        onShowToast('✨ 3 custom aesthetic concepts generated!');
      }
    } catch (err) {
      console.error('Error generating themes:', err);
      onShowToast('Loaded curated aesthetic presets.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTheme = (concept: ThemeConcept) => {
    onUpdateEvent({
      ...event,
      theme: concept.title,
      themeHexPrimary: concept.palette.primaryHex,
      themeHexAccent: concept.palette.secondaryHex,
      decorHighlights: concept.decorHighlights,
    });
    onShowToast(`🎨 Applied "${concept.title}" as active event aesthetic!`);
  };

  const copyHex = (hex: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      onShowToast(`Copied color ${hex} to clipboard!`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-mono-sm text-[11px] uppercase tracking-wider">
              Aesthetic Direction Studio
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-primary">
              Gemini 3.8 Flash Vision
            </span>
          </div>
          <h1 className="font-display-hero text-headline-xl sm:text-headline-xl text-on-surface tracking-tight">
            AI Theme &amp; Moodboard Studio
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Explore chromatic palettes, scenography concepts, lighting setups, and guest dress codes for "{event.title}".
          </p>
        </div>

        <button
          onClick={() => onNavigateToCopilot(`Suggest 5 creative floral arrangements for my active theme: ${event.theme}`)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-primary font-body-sm text-body-sm hover:bg-surface-container-highest transition-all self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          <span>Ask Copilot for Floral Advice</span>
        </button>
      </div>

      {/* Generator Control Card */}
      <div className="rounded-2xl bg-surface-container border border-outline-variant/20 p-space-lg shadow-xl">
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              >
                <option value="wedding">Wedding / Sangeet / Reception</option>
                <option value="birthday">Milestone Birthday / Soiree</option>
                <option value="anniversary">Anniversary Celebration</option>
                <option value="school">College Gala / Youth Fest</option>
                <option value="community">Community Cultural Gathering</option>
                <option value="festival">Festival / Grand Banquet</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Preferred Color Accents
              </label>
              <input
                value={preferredColors}
                onChange={(e) => setPreferredColors(e.target.value)}
                placeholder="e.g. Violet, Rose Gold, Sand, Ivory"
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Vibe &amp; Atmosphere
              </label>
              <input
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="e.g. Opulent Royal, Ethereal, Bohemian, Cyber"
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Venue Architecture
              </label>
              <input
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                placeholder="e.g. Palace Courtyard, Lawn, Rooftop, Banquet"
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Budget Intensity
              </label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              >
                <option value="Smart Economy">Smart Economy (DIY &amp; Direct Sourcing)</option>
                <option value="Balanced Luxury">Balanced Luxury (Refined Craftsmanship)</option>
                <option value="Opulent Grandeur">Opulent Grandeur (Custom High-End Rigging)</option>
              </select>
            </div>

            <div>
              <label className="text-[12px] font-label-mono-sm text-on-surface-variant uppercase">
                Cultural / Regional Tone
              </label>
              <input
                value={culturalContext}
                onChange={(e) => setCulturalContext(e.target.value)}
                placeholder="e.g. Rajasthani Royal, Contemporary Western, Fusion"
                className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15 flex-wrap gap-2">
            <span className="text-[12px] font-body-sm text-on-surface-variant">
              Visual concepts are illustrative guides designed for vendor brief handoffs.
            </span>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold shadow-[0_0_20px_rgba(183,109,255,0.4)] hover:shadow-[0_0_30px_rgba(183,109,255,0.65)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isLoading ? 'sync' : 'auto_fix_high'}
              </span>
              <span>{isLoading ? 'Synthesizing...' : 'Generate 3 Aesthetic Concepts'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Concepts Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {concepts.map((concept, idx) => {
          const isCurrentlyActive = event.theme.toLowerCase() === concept.title.toLowerCase();

          return (
            <div
              key={concept.id}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 ${
                isCurrentlyActive
                  ? 'bg-surface-container-high border-primary ring-2 ring-primary/40'
                  : 'bg-surface-container border-outline-variant/20 hover:border-outline-variant/50'
              }`}
            >
              {/* Concept Hero Header with Swatches */}
              <div className="p-space-md flex flex-col gap-3 border-b border-outline-variant/15 relative overflow-hidden">
                <div
                  className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-2xl opacity-30 pointer-events-none"
                  style={{ backgroundColor: concept.palette.primaryHex }}
                />

                <div className="flex items-center justify-between">
                  <span className="font-label-mono-sm text-[11px] text-primary uppercase tracking-wider">
                    Concept 0{idx + 1} • {concept.palette.paletteName}
                  </span>
                  {isCurrentlyActive && (
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-mono-sm text-[10px] font-bold">
                      ACTIVE THEME
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">
                    {concept.title}
                  </h3>
                  <p className="text-[12px] font-body-sm text-on-surface-variant mt-0.5">
                    {concept.tagline}
                  </p>
                </div>

                {/* Swatches Row */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[10px] font-label-mono-sm text-on-surface-variant uppercase">
                    Color Palette (Tap to copy HEX)
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Primary', hex: concept.palette.primaryHex },
                      { label: 'Secondary', hex: concept.palette.secondaryHex },
                      { label: 'Accent', hex: concept.palette.accentHex },
                      { label: 'Neutral', hex: concept.palette.neutralHex },
                    ].map((swatch) => (
                      <button
                        key={swatch.label}
                        type="button"
                        onClick={() => copyHex(swatch.hex)}
                        className="group flex flex-col items-center gap-1 p-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 hover:border-primary cursor-pointer transition-all"
                        title={`Click to copy ${swatch.hex}`}
                      >
                        <div
                          className="w-full h-7 rounded-md shadow-inner transition-transform group-hover:scale-105"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="text-[9px] font-label-mono-sm text-on-surface-variant truncate w-full text-center">
                          {swatch.hex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body Details */}
              <div className="p-space-md flex flex-col gap-3 font-body-sm text-[13px] flex-1">
                {/* Decor Highlights */}
                <div>
                  <span className="text-[11px] font-label-mono-sm text-primary uppercase block mb-1">
                    Decor &amp; Floral Highlights
                  </span>
                  <ul className="flex flex-col gap-1 text-on-surface">
                    {concept.decorHighlights.map((dh, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-primary font-bold text-[14px] leading-tight">•</span>
                        <span>{dh}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lighting */}
                <div>
                  <span className="text-[11px] font-label-mono-sm text-primary uppercase block mb-0.5">
                    Lighting &amp; Illumination
                  </span>
                  <p className="text-on-surface-variant">{concept.lightingAndAmbiance}</p>
                </div>

                {/* Dress Code & Invites */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-outline-variant/15 text-[12px]">
                  <div>
                    <span className="font-label-mono-sm text-[10px] text-on-surface-variant uppercase block">
                      Dress Code Concept
                    </span>
                    <span className="text-on-surface font-medium">{concept.dressCodeSuggestion}</span>
                  </div>
                  <div>
                    <span className="font-label-mono-sm text-[10px] text-on-surface-variant uppercase block">
                      Invitation Style
                    </span>
                    <span className="text-on-surface font-medium">{concept.invitationConcept}</span>
                  </div>
                </div>

                {/* Execution Tip */}
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 text-[12px] text-on-surface-variant mt-auto">
                  <div className="flex items-center gap-1 text-primary font-label-mono-sm text-[10px] uppercase font-bold mb-0.5">
                    <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                    Budget Tip • {concept.estimatedCostTier}
                  </div>
                  <p>{concept.practicalExecutionTip}</p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-space-md bg-surface-container-low/80 border-t border-outline-variant/15 flex items-center justify-between">
                <button
                  onClick={() => onNavigateToCopilot(`I chose the "${concept.title}" theme. Give me a checklist of lighting equipment and florist orders to give to vendors.`)}
                  className="text-[12px] font-label-mono-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  Vendor Briefing →
                </button>

                <button
                  onClick={() => handleApplyTheme(concept)}
                  className={`px-4 py-2 rounded-full font-headline-sm text-[12px] font-semibold transition-all cursor-pointer ${
                    isCurrentlyActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-primary-container text-on-primary-container shadow-md hover:scale-105 active:scale-95'
                  }`}
                >
                  {isCurrentlyActive ? '✓ Currently Applied' : 'Set as Active Theme'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
