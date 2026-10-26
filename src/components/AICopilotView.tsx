import React, { useState, useRef, useEffect } from 'react';
import { EventProject, CopilotMessage } from '../types';
import { sendCopilotMessage } from '../services/aiService';

interface AICopilotViewProps {
  event: EventProject;
  onUpdateEvent: (updated: EventProject) => void;
  onShowToast: (message: string) => void;
  initialPrompt?: string;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  event,
  onUpdateEvent,
  onShowToast,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Greetings. I am Eventora AI Copilot, your autonomous celebration orchestrator. I have full telemetry of "${event.title}"—₹${event.totalBudget.toLocaleString('en-IN')} ceiling, ${event.guestCount} guests, and ${event.tasks.filter((t) => !t.completed).length} pending milestones. How shall we optimize your celebration today?`,
      timestamp: 'Just now',
      suggestedActions: [],
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Plan a birthday party within ₹10,000.',
    'Create a simple wedding planning timeline.',
    'Help me reduce my decoration costs.',
    'Make a checklist for an event happening in 7 days.',
    'Explain trade-offs between palace courtyard vs 5-star hotel banquet.',
    'Suggest luxury royal Rajasthani menu for 250 guests.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const lastSentPromptRef = useRef<string | null>(null);

  useEffect(() => {
    if (initialPrompt && initialPrompt !== lastSentPromptRef.current) {
      lastSentPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendCopilotMessage(trimmed, event);

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: response.suggestedActions.map((a) => ({
          ...a,
          applied: false,
        })),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: 'Apologies, I encountered an interruption while querying Gemini neural services. I am operating in autonomous offline contingency mode.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = (
    msgId: string,
    actionIdx: number,
    action: NonNullable<CopilotMessage['suggestedActions']>[0]
  ) => {
    if (action.actionType === 'budget_adjustment' && action.payload?.newBudget) {
      const newBudget = action.payload.newBudget;
      const ratio = newBudget / (event.totalBudget || 500000);

      const updatedCats = event.budgetCategories.map((c) => ({
        ...c,
        allocated: Math.round(c.allocated * ratio),
      }));

      onUpdateEvent({
        ...event,
        totalBudget: newBudget,
        budgetCategories: updatedCats,
      });
      onShowToast(`Applied budget ceiling adjustment to ₹${newBudget.toLocaleString('en-IN')}`);
    } else if (action.actionType === 'update_theme' && action.payload?.newThemeName) {
      onUpdateEvent({
        ...event,
        theme: action.payload.newThemeName,
        themeHexPrimary: '#c8c2e9',
        themeHexAccent: '#e5deff',
      });
      onShowToast(`Theme updated to ${action.payload.newThemeName}`);
    } else if (action.actionType === 'add_task' && action.payload?.taskTitle) {
      const newTask = {
        id: `task-${Date.now()}`,
        title: action.payload.taskTitle,
        phase: 'Critical Deadlines',
        dueInDays: action.payload.taskDueDays || 14,
        dueDate: `Due in ${action.payload.taskDueDays || 14} days`,
        priority: (action.payload.taskPriority as any) || 'High',
        completed: false,
        category: 'AI Recommendation',
        description: 'Auto-scheduled by Eventora AI Copilot optimization routine.',
      };

      onUpdateEvent({
        ...event,
        tasks: [newTask, ...event.tasks],
      });
      onShowToast(`Added task: ${newTask.title}`);
    }

    // Mark as applied in UI
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const updatedActions = m.suggestedActions?.map((act, i) =>
          i === actionIdx ? { ...act, applied: true } : act
        );
        return { ...m, suggestedActions: updatedActions };
      })
    );
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-8rem)] max-w-5xl mx-auto rounded-2xl bg-surface-container border border-outline-variant/25 shadow-2xl overflow-hidden">
      {/* Copilot Header */}
      <div className="p-space-md sm:p-space-lg bg-surface-container-high/90 border-b border-outline-variant/20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center text-on-primary shadow-[0_0_16px_rgba(183,109,255,0.4)]">
            <span className="material-symbols-outlined text-[24px]">psychology</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Eventora AI Copilot
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-label-mono-sm text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <span className="font-caption text-caption text-on-surface-variant">
              Context: {event.title} • ₹{event.totalBudget.toLocaleString('en-IN')} Budget • {event.location}
            </span>
          </div>
        </div>

        {/* Audio Waveform visualizer dock */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/30">
          <span className="font-label-mono-sm text-[11px] text-primary">Neural Voice Band</span>
          <div className="flex items-center gap-1 h-4">
            <span className="w-1 bg-primary rounded-full h-1.5 animate-pulse" />
            <span className="w-1 bg-primary-fixed rounded-full h-3 animate-pulse [animation-delay:150ms]" />
            <span className="w-1 bg-primary rounded-full h-2 animate-pulse [animation-delay:300ms]" />
            <span className="w-1 bg-primary-fixed rounded-full h-3.5 animate-pulse [animation-delay:75ms]" />
            <span className="w-1 bg-tertiary-fixed rounded-full h-1.5 animate-pulse [animation-delay:400ms]" />
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-space-md sm:p-space-lg overflow-y-auto flex flex-col gap-space-md">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-2 max-w-[85%] ${
              msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
            }`}
          >
            <div className="flex items-center gap-2 text-on-surface-variant font-label-mono-sm text-[11px] px-1">
              <span>{msg.sender === 'user' ? 'You' : 'Eventora AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-2xl leading-relaxed font-body-md text-body-md whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-primary-container text-on-primary-container font-medium rounded-tr-none shadow-[0_0_16px_rgba(183,109,255,0.3)]'
                  : 'bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-tl-none shadow-md'
              }`}
            >
              {msg.text}
            </div>

            {/* Suggested actions if any */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="flex flex-col gap-2 w-full mt-1">
                {msg.suggestedActions.map((action, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-surface-container-high/80 border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/20 text-primary mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                      </div>
                      <div>
                        <span className="font-headline-sm text-[14px] font-semibold text-on-surface block">
                          {action.label}
                        </span>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <button
                      disabled={action.applied}
                      onClick={() => handleApplyAction(msg.id, idx, action)}
                      className={`px-4 py-1.5 rounded-full font-label-mono-sm text-[12px] font-semibold transition-all cursor-pointer shrink-0 ${
                        action.applied
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-400/40 cursor-default'
                          : 'bg-primary-container text-on-primary-container hover:scale-105 active:scale-95 shadow-md'
                      }`}
                    >
                      {action.applied ? '✓ Changes Applied' : 'Apply to Event'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="self-start flex flex-col gap-1">
            <span className="font-label-mono-sm text-[11px] text-primary">
              Eventora AI synthesizing response...
            </span>
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-on-surface rounded-tl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-space-md py-2 bg-surface-container-low/70 border-t border-outline-variant/15 flex items-center gap-2 overflow-x-auto">
        <span className="text-caption font-label-mono-sm text-on-surface-variant uppercase shrink-0">
          Suggestions:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-primary/40 text-[12px] font-label-mono-sm whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-space-md bg-surface-container-high border-t border-outline-variant/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="relative w-full flex items-center"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask Copilot to negotiate vendor quotes, suggest themes, reduce budget, or build schedules..."
            className="w-full pl-5 pr-14 py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-outline text-body-md focus:outline-none focus:ring-2 focus:ring-primary shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 w-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
