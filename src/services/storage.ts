import { EventProject } from '../types';

const STORAGE_KEY_EVENTS = 'eventora_ai_events';
const STORAGE_KEY_ACTIVE_ID = 'eventora_ai_active_id';

export const initialDreamWedding: EventProject = {
  id: 'dream-wedding-2027',
  title: 'Dream Wedding 2027',
  type: 'wedding',
  date: 'Nov 18, 2027',
  duration: '3 Days (Full Sequence)',
  location: 'Jaipur, Rajasthan',
  guestCount: 350,
  totalBudget: 500000,
  spentBudget: 215000,
  theme: 'Royal Violet & Gold',
  themeHexPrimary: '#ddb7ff',
  themeHexAccent: '#b76dff',
  specialNotes: 'Heritage palace venue in Udaipur or Jaipur with vegan catering options and ambient acoustic sufi night for the Sangeet.',
  venueName: 'Jagmandir Island Palace Courtyard',
  venueImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEKGD1p96eWZNR2Ktk0QaLx8dbsuFzYSRMrDFiPmy358n4tTvr-TVMXIZ5EmZFo091VcNnC9D4eK85GiTl3_AIA8TvPGR6bH92JkQbIGDWgi_zX214gQZ3x5RMQDQ06aXhTnO2pdjLRRFpHovzTPsPrIOWkFTFAsOfohOYAoBANBi94z0-uS10TPxpLQjY-gfdGGqgWWK4rtiVR4OpOT-kJdNBgZ1X8NxJObH9HHfM1kixczb_lW4V',
  conceptSummary: 'An opulent royal Rajasthani palace celebration bathed in twilight lilac illumination, candlelit floating pavilions, and live classical sufi cadences.',
  decorHighlights: [
    'Cascading violet and white orchid mandap canopy',
    'Floating lotus brass firepots along reflecting pool',
    'Architectural lilac and warm gold perimeter uplighting',
    'Handcrafted royal seating divans with silk bolster cushions'
  ],
  budgetCategories: [
    { id: 'cat-1', name: 'Venue & Palace Suites', allocated: 150000, spent: 75000, color: '#ddb7ff', icon: 'castle', notes: 'Jagmandir Courtyard 3-day hold' },
    { id: 'cat-2', name: 'Catering & Bespoke Dining', allocated: 140000, spent: 65000, color: '#c8c2e9', icon: 'restaurant_menu', notes: 'Royal feast for 350 guests + live counters' },
    { id: 'cat-3', name: 'Decor & Ambient Lighting', allocated: 90000, spent: 35000, color: '#b76dff', icon: 'local_florist', notes: 'Orchid installations & stage lighting' },
    { id: 'cat-4', name: 'Photography & Cinema', allocated: 50000, spent: 25000, color: '#ddb8ff', icon: 'photo_camera', notes: '4K Drone cinematography & albums' },
    { id: 'cat-5', name: 'Entertainment & Sufi Band', allocated: 40000, spent: 10000, color: '#f0dbff', icon: 'graphic_eq', notes: 'Jaipur artisan guild acoustic troupe' },
    { id: 'cat-6', name: 'Logistics & Guest Transport', allocated: 20000, spent: 5000, color: '#988d9f', icon: 'directions_car', notes: 'Airport transfers & vintage car' },
    { id: 'cat-7', name: 'Contingency & Permits', allocated: 10000, spent: 0, color: '#4d4354', icon: 'security', notes: 'Sound permits & local authority escrow' }
  ],
  expenses: [
    { id: 'exp-1', categoryId: 'cat-1', title: 'Palace Courtyard Initial Booking Advance', amount: 75000, date: '2026-09-12', vendor: 'Jagmandir Palace Trust', status: 'paid' },
    { id: 'exp-2', categoryId: 'cat-2', title: 'Catering Menu Tasting Deposit', amount: 35000, date: '2026-10-01', vendor: 'Royal Feast Caterers', status: 'paid' },
    { id: 'exp-3', categoryId: 'cat-2', title: 'Live Counter Ingredient Sourcing Advance', amount: 30000, date: '2026-10-14', vendor: 'Royal Feast Caterers', status: 'paid' },
    { id: 'exp-4', categoryId: 'cat-3', title: 'Floral Framework & Trussing Advance', amount: 35000, date: '2026-10-18', vendor: 'Violet Dreams Decor', status: 'paid' },
    { id: 'exp-5', categoryId: 'cat-4', title: 'Photography Retainer Fee', amount: 25000, date: '2026-10-20', vendor: 'Lumière Cinematics', status: 'paid' },
    { id: 'exp-6', categoryId: 'cat-5', title: 'Sufi Ensemble Sound Advance', amount: 10000, date: '2026-10-21', vendor: 'Jaipur Artisan Guild', status: 'paid' },
    { id: 'exp-7', categoryId: 'cat-6', title: 'Airport Shuttle Deposit', amount: 5000, date: '2026-10-22', vendor: 'Heritage Fleet Logistics', status: 'paid' }
  ],
  tasks: [
    { id: 'task-1', title: 'Pay 2nd deposit for Jagmandir Palace Venue', phase: 'Critical Deadlines', dueInDays: 3, dueDate: 'Nov 02, 2026', priority: 'High', completed: false, category: 'Venue', description: 'Tranche 2 settlement required to lock night curfew extensions with Jaipur local authorities.' },
    { id: 'task-2', title: 'Finalize Menu Tasting with Royal Feast Caterers', phase: 'Critical Deadlines', dueInDays: 6, dueDate: 'Nov 05, 2026', priority: 'Medium', completed: false, category: 'Catering', description: 'Approve 8 bespoke fusion appetizer live counters & royal Rajasthani thali curation.' },
    { id: 'task-3', title: 'Review floral mockups with Violet Dreams Decor', phase: 'Critical Deadlines', dueInDays: 9, dueDate: 'Nov 08, 2026', priority: 'Normal', completed: false, category: 'Decor', description: 'Examine cold-weather orchid endurance and mood-matched ambient violet uplighting.' },
    { id: 'task-4', title: 'Lock Baraat horse carriage & brass route', phase: 'Mid Planning', dueInDays: 20, dueDate: 'Nov 19, 2026', priority: 'Medium', completed: true, category: 'Entertainment', description: 'Coordination with Jaipur traffic police for outer ring road corridor.' },
    { id: 'task-5', title: 'Send luxury wax-sealed digital invitations', phase: 'Mid Planning', dueInDays: 30, dueDate: 'Nov 29, 2026', priority: 'High', completed: true, category: 'Invitations', description: 'Digital RSVP portal link dispatched to 350 primary recipients.' },
    { id: 'task-6', title: 'Confirm royal turban styling & saafa artisan', phase: 'Final Stretch', dueInDays: 45, dueDate: 'Dec 14, 2026', priority: 'Normal', completed: true, category: 'Apparel', description: '350 pastel lilac saafas customized with antique brooches.' },
    { id: 'task-7', title: 'Sangeet sound check & acoustic tuning', phase: 'Final Stretch', dueInDays: 60, dueDate: 'Dec 29, 2026', priority: 'Normal', completed: false, category: 'Sound', description: 'Decibel compliance test inside courtyard acoustics.' }
  ],
  runOfShow: [
    { id: 'ros-1', time: '03:30 PM', activity: 'Guest arrival & welcome saffron mocktails at waterfront', lead: 'Concierge Team', location: 'Palace Pier Jetty' },
    { id: 'ros-2', time: '04:30 PM', activity: 'Grand Royal Baraat procession with brass ensemble', lead: 'Event Director', location: 'Main Palace Ramparts' },
    { id: 'ros-3', time: '05:36 PM', activity: 'Golden Hour Varmala & Mandap Exchange under sunset', lead: 'Ceremony Priest & AI Anchor', location: 'Imperial Mandap Pavilion' },
    { id: 'ros-4', time: '07:30 PM', activity: 'Royal banquet dining opens with live Rajasthani artisanal counters', lead: 'Executive Chef', location: 'Mirror Ballroom Courtyard' },
    { id: 'ros-5', time: '09:00 PM', activity: 'Acoustic Sufi Night performance under lantern sky', lead: 'Jaipur Guild Lead', location: 'Moonlight Terrace' }
  ],
  vendors: [
    { id: 'v-1', role: 'Main Venue & Suite', name: 'Jagmandir Island', category: 'Venue', estimatedQuote: 150000, actualCost: 150000, status: 'Confirmed', contactPerson: 'Maharaj Singh', notes: 'Main courtyard, suite for bridal party, pier access' },
    { id: 'v-2', role: 'Bespoke Dining', name: 'Royal Feast Caterers', category: 'Catering', estimatedQuote: 140000, actualCost: 135000, status: '80% Draft', contactPerson: 'Chef Vikramaditya', notes: 'Appetizers locked; awaiting dessert tasting' },
    { id: 'v-3', role: 'Floral & Lighting', name: 'Violet Dreams Decor', category: 'Decor', estimatedQuote: 90000, actualCost: 85000, status: 'In Review', contactPerson: 'Ananya Sharma', notes: '3D Layout v4 under client inspection' },
    { id: 'v-4', role: '4K Drone + Stills', name: 'Lumière Cinematics', category: 'Photography', estimatedQuote: 50000, actualCost: 50000, status: 'Confirmed', contactPerson: 'Karan Mehra', notes: 'Dual cinematographers + drone pilot licensed' }
  ],
  guests: [
    { id: 'g-1', name: 'Aarav Singhania & Family', partySize: 4, status: 'confirmed', dietary: 'Vegetarian', table: 'Imperial 1' },
    { id: 'g-2', name: 'Meera Kapoor & Guests', partySize: 3, status: 'confirmed', dietary: 'Jain', table: 'Imperial 1' },
    { id: 'g-3', name: 'Rohan Verma', partySize: 2, status: 'confirmed', dietary: 'Vegan', table: 'Courtyard A' },
    { id: 'g-4', name: 'Simran & Kabir Das', partySize: 2, status: 'confirmed', dietary: 'Standard', table: 'Courtyard B' },
    { id: 'g-5', name: 'Devendra Rathore (VIP)', partySize: 5, status: 'confirmed', dietary: 'Rajasthani Royal', table: 'Palace Suite' },
    { id: 'g-6', name: 'Anita Patel', partySize: 2, status: 'pending', dietary: 'Vegetarian', table: 'Courtyard C' },
    { id: 'g-7', name: 'Dr. Sameer Sen', partySize: 1, status: 'declined', dietary: 'None' }
  ],
  insights: [
    {
      id: 'ins-1',
      type: 'cost_savings',
      category: 'Entertainment',
      title: 'Saved ₹32,000 on Brass Troupe',
      description: 'Recommended traditional brass musicians contracted directly through Jaipur Artisan Guild over corporate agency rates.',
      savings: 32000,
      actionLabel: 'Apply Delta',
      applied: true
    },
    {
      id: 'ins-2',
      type: 'schedule',
      category: 'Jaipur Climatology',
      title: 'Golden Hour Sunset Alignment',
      description: '24°C expected during pheras. Sunset at 5:48 PM coincides with golden hour mandap vows for optimum natural lighting.',
      actionLabel: 'Auto-Sync Run-of-Show',
      applied: false
    },
    {
      id: 'ins-3',
      type: 'advisory',
      category: 'Escrow Settlement',
      title: 'Automated Escrow Tranche',
      description: 'Next scheduled vendor settlement execution in 72 hours via automated escrow protection.',
      actionLabel: 'Audit Ledger',
      applied: false
    }
  ],
  createdAt: new Date().toISOString()
};

export function loadEvents(): EventProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    if (!raw) {
      saveEvents([initialDreamWedding]);
      return [initialDreamWedding];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      saveEvents([initialDreamWedding]);
      return [initialDreamWedding];
    }
    return parsed;
  } catch (err) {
    console.error('Error loading events from storage:', err);
    return [initialDreamWedding];
  }
}

export function saveEvents(events: EventProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving events to storage:', err);
  }
}

export function getActiveEventId(): string {
  try {
    const active = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    return active || initialDreamWedding.id;
  } catch {
    return initialDreamWedding.id;
  }
}

export function setActiveEventId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (err) {
    console.error('Error saving active event id:', err);
  }
}
