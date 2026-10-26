import React, { useState } from 'react';
import { EventProject } from '../types';
import { requestInvitationDraft, InvitationDraftResponse } from '../services/aiService';

interface InvitationDrafterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventProject;
  onShowToast: (message: string) => void;
}

export const InvitationDrafterModal: React.FC<InvitationDrafterModalProps> = ({
  isOpen,
  onClose,
  event,
  onShowToast,
}) => {
  const [hostNames, setHostNames] = useState('The Singhania Family');
  const [tone, setTone] = useState('Royal, Warm & Poetic');
  const [rsvpDeadline, setRsvpDeadline] = useState('Nov 05, 2027');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'formal'>('whatsapp');

  const [draftResult, setDraftResult] = useState<InvitationDraftResponse>({
    subjectLine: `✨ You are cordially invited to ${event.title} | ${event.date}`,
    whatsappDraft: `✨ *CELEBRATION INVITATION* ✨\n\nDear Friends & Family,\n\nWe warmly request the pleasure of your company at the royal celebration of:\n\n🎉 *${event.title}*\n\n📅 *Date:* ${event.date} (${event.duration})\n📍 *Venue:* ${event.venueName || event.location}\n👔 *Dress Code:* Royal Festive / Semi-Formal Elegance\n\nKindly confirm your presence by *Nov 05, 2027* to help us curate your experience.\n\nRSVP link: eventora.ai/rsvp/${event.id}\n\nWith warm regards,\n*The Singhania Family*`,
    formalDraft: `With joy in our hearts, the Singhania Family solicit the honour of your presence at the ceremonial celebration of ${event.title}.\n\nPlease join us as we gather to commemorate this joyous milestone with fine hospitality, music, and banquet dining on ${event.date} at ${event.venueName || event.location}.\n\nYour presence and blessings are our greatest gift.\n\nKindly RSVP by Nov 05, 2027.`,
    highlights: [
      'Tailored for mobile WhatsApp delivery with clear emoji structure',
      'Direct RSVP portal link included for frictionless guest confirmation',
      'Compliant with Indian festive hospitality etiquette',
    ],
  });

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    onShowToast('Consulting AI Invitation Scribe...');

    try {
      const result = await requestInvitationDraft({
        eventTitle: event.title,
        eventType: event.type,
        date: event.date,
        location: event.venueName || event.location,
        tone,
        hostNames,
        rsvpDeadline,
        format: 'WhatsApp and Formal Card',
      });
      setDraftResult(result);
      onShowToast('✨ Fresh invitation wording drafted!');
    } catch (err) {
      console.error('Error drafting invitation:', err);
      onShowToast('Loaded high-etiquette invitation template.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      onShowToast('Copied invitation message to clipboard! Ready to paste into WhatsApp / Email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-surface-container-high border border-outline-variant/30 shadow-2xl p-5 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/15">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            </div>
            <div>
              <span className="text-[11px] font-label-mono-sm text-primary uppercase block">
                AI Invitation Drafter
              </span>
              <h2 className="font-headline-sm text-[18px] font-bold text-on-surface">
                Draft Guest Invitations
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-label-mono-sm text-on-surface-variant uppercase">
              Host / Family Name
            </label>
            <input
              value={hostNames}
              onChange={(e) => setHostNames(e.target.value)}
              placeholder="e.g. The Kapoor Family"
              className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[11px] font-label-mono-sm text-on-surface-variant uppercase">
              Invitation Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
            >
              <option value="Royal, Warm & Poetic">Royal &amp; Warm</option>
              <option value="Modern, Chic & Casual">Modern &amp; Casual</option>
              <option value="Traditional Heritage Formal">Traditional Formal</option>
              <option value="Playful & Festive">Playful &amp; Festive</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-label-mono-sm text-on-surface-variant uppercase">
              RSVP Deadline
            </label>
            <input
              value={rsvpDeadline}
              onChange={(e) => setRsvpDeadline(e.target.value)}
              placeholder="e.g. 7 days prior"
              className="w-full px-3 py-2 mt-1 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-on-surface text-[13px] focus:outline-none focus:border-primary"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-full bg-surface-container-highest border border-outline-variant/30 text-primary font-headline-sm text-[12px] hover:bg-surface-container flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isLoading ? 'sync' : 'auto_fix_high'}
              </span>
              <span>{isLoading ? 'Drafting...' : 'Re-Draft with AI'}</span>
            </button>
          </div>
        </form>

        {/* Tab switch for WhatsApp vs Formal Card */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-label-mono-sm transition-all cursor-pointer ${
              activeTab === 'whatsapp'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            WhatsApp / SMS Format
          </button>
          <button
            onClick={() => setActiveTab('formal')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-label-mono-sm transition-all cursor-pointer ${
              activeTab === 'formal'
                ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Formal Card Prose
          </button>
        </div>

        {/* Output Box */}
        <div className="relative p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 font-body-sm text-[13px] leading-relaxed text-on-surface max-h-56 overflow-y-auto whitespace-pre-line shadow-inner">
          {activeTab === 'whatsapp' ? draftResult.whatsappDraft : draftResult.formalDraft}
        </div>

        {/* Highlights Strip */}
        <div className="flex flex-wrap gap-2 text-[11px] font-label-mono-sm text-on-surface-variant">
          {draftResult.highlights?.map((h, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-surface-container border border-outline-variant/20">
              ✓ {h}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/15">
          <span className="text-[11px] font-body-sm text-on-surface-variant">
            No automated messages are sent without your explicit action.
          </span>

          <button
            onClick={() =>
              copyToClipboard(
                activeTab === 'whatsapp' ? draftResult.whatsappDraft : draftResult.formalDraft
              )
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline-sm text-[13px] font-semibold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
            <span>Copy to Clipboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
