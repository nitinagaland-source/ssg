import React, { useEffect } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export interface GsapRevealOptions {
  triggerThreshold?: string; // e.g. "top 85%"
  stagger?: number; // e.g. 0.08
  duration?: number; // e.g. 0.7
  yOffset?: number; // e.g. 35
  enableScale?: boolean;
}

/**
 * Hook to automatically find and animate sections and child items with GSAP ScrollTrigger.
 */
export function useGsapScrollReveal(
  containerRef?: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList = [],
  options: GsapRevealOptions = {}
) {
  const {
    triggerThreshold = 'top 85%',
    stagger = 0.07,
    duration = 0.65,
    yOffset = 30,
    enableScale = true,
  } = options;

  useEffect(() => {
    // GSAP context for safe cleanup in React 18/19
    const ctx = gsap.context(() => {
      const scope = containerRef?.current || document.body;
      const sections = Array.from(scope.querySelectorAll('.gsap-section, [data-gsap-section]')) as HTMLElement[];

      sections.forEach((section) => {
        // Collect child items to stagger inside this section
        const items = Array.from(
          section.querySelectorAll('.gsap-item, .gsap-child, [data-gsap-item], [data-gsap-child]')
        ) as HTMLElement[];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: triggerThreshold,
            toggleActions: 'play none none none',
            once: true,
          },
        });

        // Animate section container container subtly
        tl.fromTo(
          section,
          {
            opacity: 0,
            y: yOffset,
            scale: enableScale ? 0.985 : 1,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: duration,
            ease: 'power3.out',
            clearProps: 'transform',
          }
        );

        // Animate items within this section with smooth stagger
        if (items.length > 0) {
          tl.fromTo(
            items,
            {
              opacity: 0,
              y: yOffset * 0.7,
              scale: enableScale ? 0.96 : 1,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: duration * 0.9,
              stagger: stagger,
              ease: 'power2.out',
              clearProps: 'transform',
            },
            '-=0.45' // Overlap with section animation for fluid motion
          );
        }
      });
    }, containerRef?.current || undefined);

    // Refresh ScrollTrigger after DOM renders
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [containerRef, triggerThreshold, stagger, duration, yOffset, enableScale, ...deps]);
}
