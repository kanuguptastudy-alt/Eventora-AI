import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health and AI status endpoint
app.get('/api/gemini/status', (_req, res) => {
  res.json({
    active: !!ai,
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// AI Plan Generation Endpoint
app.post('/api/gemini/generate-plan', async (req, res) => {
  try {
    const {
      title,
      type,
      date,
      location,
      guestCount,
      budget,
      theme,
      specialNotes,
      duration,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ error: 'Title and event type are required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please check the Secrets panel in AI Studio.',
        fallbackAvailable: true,
      });
    }

    const prompt = `You are Eventora AI's autonomous elite event orchestrator and luxury celebration designer.
Generate an extraordinary, highly tailored and realistic event blueprint based on the following client specifications:
- Event Title: "${title}"
- Event Category: "${type}"
- Date / Span: "${date || 'Upcoming'}" (${duration || '1-day'})
- Location / Destination: "${location || 'To be decided'}"
- Anticipated Guest Count: ${guestCount || 200} guests
- Total Budget Ceiling: ₹${budget || 500000} (Indian Rupees - INR)
- Preferred Aesthetic / Theme: "${theme || 'Royal Violet & Gold'}"
- Creative / Special Requirements: "${specialNotes || 'None specified'}"

CRITICAL INSTRUCTIONS:
1. Provide realistic cost allocations in INR (₹) that sum to exactly or close to the target budget of ₹${budget || 500000}.
2. Provide categorized budget items for: "Venue", "Catering & Dining", "Decor & Lighting", "Photography & Cinema", "Entertainment & Sound", "Logistics & Transport", and "Contingency & Misc".
3. Provide actionable preparation milestones with realistic deadlines and priorities (High, Medium, Normal) divided across phases (e.g., "Early Stage (4-6 Months Out)", "Mid Planning (2-3 Months Out)", "Final Stretch (2-4 Weeks Out)", "Event Week").
4. Provide a minute-by-minute Day-of Run-of-Show timeline schedule.
5. Provide curated theme and decor guidelines (palette codes, lighting, floral choices, ambiance).
6. Provide contingency advisories (weather, power, guest surges).
7. Suggest 2-3 autonomous budget optimization or smart savings opportunities.
8. NEVER invent confirmed vendor bookings or verified legal quotations; frame them as recommended vendor targets.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conceptSummary: {
              type: Type.STRING,
              description: 'Executive vision and creative concept statement for the event.',
            },
            themePalette: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                primaryHex: { type: Type.STRING },
                accentHex: { type: Type.STRING },
                decorHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['name', 'description', 'primaryHex', 'accentHex', 'decorHighlights'],
            },
            budgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  allocatedAmount: { type: Type.NUMBER },
                  notes: { type: Type.STRING },
                },
                required: ['category', 'allocatedAmount', 'notes'],
              },
            },
            timelineTasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  phase: { type: Type.STRING },
                  dueInDays: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                },
                required: ['title', 'phase', 'dueInDays', 'priority', 'description', 'category'],
              },
            },
            runOfShow: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  lead: { type: Type.STRING },
                  location: { type: Type.STRING },
                },
                required: ['time', 'activity', 'lead', 'location'],
              },
            },
            vendorRecommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING },
                  suggestedName: { type: Type.STRING },
                  estimatedQuote: { type: Type.NUMBER },
                  status: { type: Type.STRING },
                  notes: { type: Type.STRING },
                },
                required: ['role', 'suggestedName', 'estimatedQuote', 'status', 'notes'],
              },
            },
            contingencyPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  mitigation: { type: Type.STRING },
                },
                required: ['risk', 'mitigation'],
              },
            },
            aiOptimizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  estimatedSavings: { type: Type.NUMBER },
                  type: { type: Type.STRING },
                },
                required: ['category', 'title', 'description', 'estimatedSavings', 'type'],
              },
            },
          },
          required: [
            'conceptSummary',
            'themePalette',
            'budgetBreakdown',
            'timelineTasks',
            'runOfShow',
            'vendorRecommendations',
            'contingencyPlans',
            'aiOptimizations',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.error('Error generating AI plan:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate plan from Gemini AI.',
    });
  }
});

// AI Copilot Conversational & Action Endpoint
app.post('/api/gemini/copilot', async (req, res) => {
  try {
    const { message, eventContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please check the Secrets panel in AI Studio.',
        fallbackAvailable: true,
      });
    }

    const prompt = `You are Eventora AI Copilot, a precision generative event planning co-pilot.
Here is the active event context:
- Title: ${eventContext?.title || 'Current Event'}
- Type: ${eventContext?.type || 'Celebration'}
- Budget Ceiling: ₹${eventContext?.totalBudget || 500000}
- Current Spent: ₹${eventContext?.spentBudget || 0}
- Guests: ${eventContext?.guestCount || 200}
- Theme: ${eventContext?.theme || 'Bespoke'}
- Date: ${eventContext?.date || 'Upcoming'}
- Location: ${eventContext?.location || 'India'}

User Request: "${message}"

Respond helpfully, authoritatively, and concisely in the elegant, atmospheric tone of Eventora AI.
If the user is asking to modify or adjust something concrete (e.g. reduce budget by X%, add/adjust a task, change theme, suggest a specific schedule shift, or negotiate expenses), propose structured actionable adjustments that can be applied to their event.

CRITICAL: Return valid JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Conversational response explaining recommendations and insights.',
            },
            suggestedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  actionType: {
                    type: Type.STRING,
                    description: 'budget_adjustment, add_task, update_theme, or advice_only',
                  },
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                  payload: {
                    type: Type.OBJECT,
                    properties: {
                      newBudget: { type: Type.NUMBER },
                      taskTitle: { type: Type.STRING },
                      taskPriority: { type: Type.STRING },
                      taskDueDays: { type: Type.NUMBER },
                      newThemeName: { type: Type.STRING },
                      savingAmount: { type: Type.NUMBER },
                    },
                  },
                },
                required: ['actionType', 'label', 'description'],
              },
            },
            quickReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['reply', 'suggestedActions', 'quickReplies'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in AI Copilot:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process request with Gemini AI.',
    });
  }
});

// AI Theme & Moodboard Studio Endpoint
app.post('/api/gemini/theme-studio', async (req, res) => {
  try {
    const { eventType, preferredColors, mood, venueType, budgetLevel, culturalContext } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
        fallbackAvailable: true,
      });
    }

    const prompt = `You are Eventora AI's Chief Aesthetic Director and Luxury Moodboard Curator.
Generate 3 distinct, breathtaking event visual theme concepts based on:
- Event Category: ${eventType || 'Celebration'}
- Preferred Color Directions: ${preferredColors || 'Violet, Gold, and Ivory'}
- Mood & Atmosphere: ${mood || 'Opulent, Romantic, Cinematic'}
- Venue Context: ${venueType || 'Palace Courtyard / Open Lawn'}
- Budget Level: ${budgetLevel || 'Balanced Premium'}
- Cultural / Personal Nuances: ${culturalContext || 'Indian Celebratory Heritage'}

CRITICAL INSTRUCTIONS:
Return 3 distinct concepts with concrete hex colors, decor ideas, lighting plans, and invitation styles. Output valid JSON matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  tagline: { type: Type.STRING },
                  palette: {
                    type: Type.OBJECT,
                    properties: {
                      primaryHex: { type: Type.STRING },
                      secondaryHex: { type: Type.STRING },
                      accentHex: { type: Type.STRING },
                      neutralHex: { type: Type.STRING },
                      paletteName: { type: Type.STRING },
                    },
                    required: ['primaryHex', 'secondaryHex', 'accentHex', 'neutralHex', 'paletteName'],
                  },
                  decorHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  lightingAndAmbiance: { type: Type.STRING },
                  invitationConcept: { type: Type.STRING },
                  dressCodeSuggestion: { type: Type.STRING },
                  estimatedCostTier: { type: Type.STRING },
                  practicalExecutionTip: { type: Type.STRING },
                },
                required: [
                  'id',
                  'title',
                  'tagline',
                  'palette',
                  'decorHighlights',
                  'lightingAndAmbiance',
                  'invitationConcept',
                  'dressCodeSuggestion',
                  'estimatedCostTier',
                  'practicalExecutionTip',
                ],
              },
            },
          },
          required: ['concepts'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error in Theme Studio:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate theme concepts.',
      fallbackAvailable: true,
    });
  }
});

// AI Invitation Message Drafting Endpoint
app.post('/api/gemini/invitation-draft', async (req, res) => {
  try {
    const { eventTitle, eventType, date, location, tone, hostNames, rsvpDeadline, format } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
        fallbackAvailable: true,
      });
    }

    const prompt = `You are Eventora AI's Master Invitation Scribe.
Draft personalized invitation wording for:
- Event: ${eventTitle} (${eventType})
- Hosts: ${hostNames || 'The Host Family'}
- Date & Time: ${date || 'Upcoming'}
- Venue / Location: ${location || 'To be shared'}
- Tone: ${tone || 'Royal & Warm'}
- RSVP Deadline: ${rsvpDeadline || '7 days prior'}
- Channel Format: ${format || 'WhatsApp / Digital'}

Generate 2 distinct message versions:
1. WhatsApp / SMS concise digital invite with emojis and bulleted itinerary points.
2. Formal invitation card prose suitable for digital card or email.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whatsappDraft: {
              type: Type.STRING,
              description: 'Concise, beautifully formatted WhatsApp invitation text ready to send.',
            },
            formalDraft: {
              type: Type.STRING,
              description: 'Formal, poetic invitation card text.',
            },
            subjectLine: {
              type: Type.STRING,
              description: 'Email or message subject headline.',
            },
            highlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['whatsappDraft', 'formalDraft', 'subjectLine', 'highlights'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (error: any) {
    console.error('Error drafting invitation:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to draft invitation.',
      fallbackAvailable: true,
    });
  }
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Eventora AI server running on http://0.0.0.0:${port}`);
  });
}

startServer();
