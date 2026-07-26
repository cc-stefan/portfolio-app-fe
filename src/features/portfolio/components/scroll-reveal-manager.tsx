'use client';

import { useEffect } from 'react';

const revealSelector = '.view-reveal';

export function ScrollRevealManager() {
  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));

    if (revealElements.length === 0) {
      return;
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (reducedMotionQuery.matches || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => {
        element.dataset.scrollReveal = 'visible';
      });
      return;
    }

    const viewportHeight = window.innerHeight;

    revealElements.forEach((element) => {
      element.dataset.scrollReveal =
        element.getBoundingClientRect().top < viewportHeight ? 'visible' : 'pending';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;
          element.dataset.scrollReveal = 'visible';
          observer.unobserve(element);
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08,
      }
    );

    revealElements.forEach((element) => {
      if (element.dataset.scrollReveal === 'pending') {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
