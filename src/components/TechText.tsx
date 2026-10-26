import React, { useEffect, useState } from 'react';

interface TechTextProps {
  primaryText?: string;
  taglineText?: string;
}

export const TechText: React.FC<TechTextProps> = ({
  primaryText = 'Plan Less.',
  taglineText = 'Celebrate More.',
}) => {
  const [revealedCharsCount, setRevealedCharsCount] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const fullText = `${primaryText} ${taglineText}`;

  useEffect(() => {
    // Check OS reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    if (mediaQuery.matches) {
      setRevealedCharsCount(fullText.length);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    // Smooth TechText staggered character-by-character reveal
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setRevealedCharsCount(current);
      if (current >= fullText.length) {
        clearInterval(interval);
      }
    }, 45);

    return () => {
      clearInterval(interval);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [fullText]);

  if (prefersReducedMotion) {
    return (
      <div className="space-y-space-xs">
        <div className="flex items-center gap-3">
          <span className="font-label-mono-md text-label-mono-md text-primary tracking-widest uppercase">
            01 / ORCHESTRATE
          </span>
          <div className="h-[1px] w-20 bg-gradient-to-r from-primary to-transparent" />
        </div>
        <h1 className="font-display-hero text-display-hero text-on-surface tracking-tighter leading-[1.05]">
          {primaryText}
          <span className="block bg-gradient-to-r from-primary-fixed via-primary to-tertiary bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(183,109,255,0.4)]">
            {taglineText}
          </span>
        </h1>
      </div>
    );
  }

  // Calculate split for primaryText and taglineText
  const primaryLength = primaryText.length;
  const primaryVisible = primaryText.slice(0, Math.min(revealedCharsCount, primaryLength));
  const taglineStart = primaryLength + 1; // accounting for space
  const taglineVisible =
    revealedCharsCount > taglineStart
      ? taglineText.slice(0, revealedCharsCount - taglineStart)
      : '';

  const isComplete = revealedCharsCount >= fullText.length;

  return (
    <div className="space-y-space-xs relative select-none">
      {/* Precision Tech Header Coordinate Ribbon */}
      <div className="flex items-center gap-3">
        <span className="font-label-mono-md text-label-mono-md text-primary tracking-widest uppercase flex items-center gap-2">
          <span>01 / ORCHESTRATE</span>
          <span className="text-[10px] text-outline px-1.5 py-0.5 rounded border border-outline-variant/30">
            SYS_ENG:ONLINE
          </span>
        </span>
        <div className="h-[1px] w-20 bg-gradient-to-r from-primary to-transparent" />
      </div>

      {/* Main TechText Headline with Specular Glow Sweep */}
      <h1 className="font-display-hero text-display-hero text-on-surface tracking-tighter leading-[1.05] relative">
        <span className="relative">
          {primaryVisible}
          {!isComplete && revealedCharsCount <= primaryLength && (
            <span className="inline-block w-2.5 h-[0.85em] ml-1 bg-primary align-baseline animate-pulse shadow-[0_0_10px_#ddb7ff]" />
          )}
        </span>

        <span className="block bg-gradient-to-r from-primary-fixed via-primary to-tertiary bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(183,109,255,0.4)] relative">
          {taglineVisible}
          {!isComplete && revealedCharsCount > primaryLength && (
            <span className="inline-block w-2.5 h-[0.85em] ml-1 bg-tertiary align-baseline animate-pulse shadow-[0_0_12px_#b76dff]" />
          )}
        </span>

        {/* Subtle Cybernetic Dashed Alignment Track */}
        <div className="w-full max-w-md h-[1px] border-b border-dashed border-outline-variant/40 mt-3" />
      </h1>
    </div>
  );
};
