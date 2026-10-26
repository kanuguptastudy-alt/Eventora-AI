export interface BudgetCategory {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
  icon: string;
  notes?: string;
}

export interface ExpenseItem {
  id: string;
  categoryId: string;
  title: string;
  amount: number;
  date: string;
  vendor?: string;
  status: 'paid' | 'pending' | 'escrow';
}

export interface TimelineTask {
  id: string;
  title: string;
  phase: string;
  dueInDays: number;
  dueDate?: string;
  priority: 'High' | 'Medium' | 'Normal';
  completed: boolean;
  category: string;
  description: string;
  assignedTo?: string;
}

export interface RunOfShowItem {
  id: string;
  time: string;
  activity: string;
  lead: string;
  location: string;
  completed?: boolean;
}

export interface VendorItem {
  id: string;
  role: string;
  name: string;
  category: string;
  estimatedQuote: number;
  actualCost?: number;
  status: 'Confirmed' | 'In Review' | '80% Draft' | 'Shortlisted';
  contactPerson?: string;
  notes?: string;
}

export interface GuestItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'declined';
  dietary?: string;
  table?: string;
}

export interface AIInsight {
  id: string;
  type: 'cost_savings' | 'advisory' | 'schedule';
  category: string;
  title: string;
  description: string;
  savings?: number;
  actionLabel?: string;
  applied?: boolean;
}

export interface EventProject {
  id: string;
  title: string;
  type: 'wedding' | 'birthday' | 'anniversary' | 'school' | 'community' | 'festival';
  date: string;
  duration: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  spentBudget: number;
  theme: string;
  themeHexPrimary: string;
  themeHexAccent: string;
  specialNotes?: string;
  venueName?: string;
  venueImageUrl?: string;
  conceptSummary?: string;
  decorHighlights?: string[];
  budgetCategories: BudgetCategory[];
  expenses: ExpenseItem[];
  tasks: TimelineTask[];
  runOfShow: RunOfShowItem[];
  vendors: VendorItem[];
  guests: GuestItem[];
  insights: AIInsight[];
  createdAt: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: {
    actionType: 'budget_adjustment' | 'add_task' | 'update_theme' | 'advice_only';
    label: string;
    description: string;
    payload?: any;
    applied?: boolean;
  }[];
}
