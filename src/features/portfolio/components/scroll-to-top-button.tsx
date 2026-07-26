'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { scrollPageToTop } from '../lib/section-scroll';

const SCROLL_THRESHOLD = 480;

interface ScrollToTopButtonProps {
  label: string;
}

export function ScrollToTopButton({ label }: ScrollToTopButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY >= SCROLL_THRESHOLD);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });

    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  const handleClick = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    scrollPageToTop(behavior);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      tabIndex={isVisible ? 0 : -1}
      onClick={handleClick}
      className={cn(
        'fixed bottom-[calc(var(--safe-area-inset-bottom)+1rem)] right-[calc(var(--safe-area-inset-right)+1rem)] z-30 rounded-full border-primary/28 bg-card/88 shadow-[var(--surface-shadow-lg)] backdrop-blur-md',
        'transition-[opacity,transform,visibility,background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none',
        isVisible
          ? 'visible translate-y-0 opacity-100'
          : 'pointer-events-none invisible translate-y-3 opacity-0'
      )}
    >
      <ArrowUp aria-hidden="true" />
    </Button>
  );
}
