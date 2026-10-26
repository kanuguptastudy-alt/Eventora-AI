import React, { useEffect, useRef, useState } from 'react';

export const MicroSlats: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check OS reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMediaChange);

    if (mediaQuery.matches) {
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }

    const container = containerRef.current;
    if (!container) return;

    const slats = container.children;
    const slatCount = slats.length;
    let animationFrameId: number;
    let mouseXRatio = -1; // -1 indicates no active hover
    let lastMouseMoveTime = 0;
    let waveTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseXRatio = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      lastMouseMoveTime = performance.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseXRatio = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth));
        lastMouseMoveTime = performance.now();
      }
    };

    const handleMouseLeave = () => {
      mouseXRatio = -1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Continuous smooth animation loop with sinusoidal wave swell and subtle white-to-violet glints
    const animate = (timestamp: number) => {
      waveTime += 0.02;

      // Mouse influence decays if user stopped moving
      const timeSinceMouse = timestamp - lastMouseMoveTime;
      const isMouseActive = mouseXRatio >= 0 && timeSinceMouse < 2500;

      for (let i = 0; i < slatCount; i++) {
        const slat = slats[i] as HTMLElement;
        const normalizedIndex = i / (slatCount - 1);

        // Sinusoidal wave calculation
        const wave = Math.sin(waveTime + normalizedIndex * Math.PI * 2);
        const waveOpacity = 0.2 + (wave + 1) * 0.15; // varies between 0.2 and 0.5

        if (isMouseActive) {
          const targetIndex = mouseXRatio * (slatCount - 1);
          const dist = Math.abs(i - targetIndex);

          if (dist < 0.8) {
            slat.style.opacity = '1';
            slat.style.backgroundColor = '#ddb7ff';
            slat.style.boxShadow = '0 0 16px rgba(183, 109, 255, 0.8), 0 0 4px #ffffff';
          } else if (dist < 2) {
            slat.style.opacity = '0.65';
            slat.style.backgroundColor = 'rgba(221, 183, 255, 0.5)';
            slat.style.boxShadow = '0 0 8px rgba(183, 109, 255, 0.4)';
          } else {
            slat.style.opacity = waveOpacity.toFixed(2);
            slat.style.backgroundColor = '';
            slat.style.boxShadow = '';
          }
        } else {
          // Ambient autonomous wave pattern
          slat.style.opacity = waveOpacity.toFixed(2);
          slat.style.backgroundColor = '';
          slat.style.boxShadow = '';

          // Occasional subtle glint on crests
          if (wave > 0.85) {
            slat.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      {/* Deep plum atmospheric radial gradients */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[980px] h-[580px] rounded-full bg-primary-container/20 blur-[130px] opacity-70" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-secondary-container/25 blur-[140px] opacity-50" />
      <div className="absolute bottom-0 -left-28 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] opacity-40" />

      {/* Architectural Vertical MicroSlats Grid */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex justify-between px-6 opacity-40"
        id="microslat-array"
      >
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/35 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/40 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent transition-colors duration-300" />
        <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/25 to-transparent transition-colors duration-300" />
      </div>

      {/* Tech Grid Specular Horizon */}
      <div className="absolute inset-0 bg-[radial-gradient(#b76dff_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.07]" />
    </div>
  );
};
