import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../../lib/gsap';

interface GsapSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  delay?: number;
  yOffset?: number;
  stagger?: number;
}

export const GsapSection: React.FC<GsapSectionProps> = ({
  children,
  className = '',
  as: Component = 'section',
  delay = 0,
  yOffset = 35,
  stagger = 0.08,
  ...props
}) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const items = el.querySelectorAll<HTMLElement>(
        '.gsap-item, .gsap-child, [data-gsap-item]'
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
        delay,
      });

      tl.fromTo(
        el,
        { opacity: 0, y: yOffset, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );

      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, y: yOffset * 0.7, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            stagger: stagger,
            ease: 'power2.out',
            clearProps: 'transform',
          },
          '-=0.4'
        );
      }
    }, el);

    return () => ctx.revert();
  }, [delay, yOffset, stagger]);

  const Comp = Component as any;

  return (
    <Comp
      ref={sectionRef}
      className={`gsap-section ${className}`}
      data-gsap-section="true"
      {...props}
    >
      {children}
    </Comp>
  );
};

export const GsapItem: React.FC<React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }> = ({
  children,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const Comp = Component as any;
  return (
    <Comp className={`gsap-item ${className}`} data-gsap-item="true" {...props}>
      {children}
    </Comp>
  );
};

export const GsapPageRevealProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Step 1: scroll to top immediately before GSAP does anything
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Step 2: kill all existing ScrollTriggers so stale ones don't fire
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Step 3: wait for DOM + scroll to settle, then init animations
    const timer = setTimeout(() => {
      // Ensure we're still at top after any browser scroll restoration
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const ctx = gsap.context(() => {
        const pageSections = document.querySelectorAll<HTMLElement>(
          'main > div > section, main section, .gsap-section, [data-gsap-section]'
        );

        pageSections.forEach((section, index) => {
          if (section.getAttribute('data-gsap-initialized')) return;
          section.setAttribute('data-gsap-initialized', 'true');

          const childrenToAnimate = section.querySelectorAll<HTMLElement>(
            '.gsap-item, .gsap-child, [data-gsap-item], .product-card-3d, .shiny-solid-3d, .action-card, .pillar-card, h1, h2, h3, .section-header'
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: index === 0 ? 'top 95%' : 'top 85%',
              toggleActions: 'play none none none',
              once: true,
            },
          });

          tl.fromTo(
            section,
            { opacity: 0, y: 30, scale: 0.99 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: 'power3.out',
              clearProps: 'transform',
            }
          );

          if (childrenToAnimate.length > 0) {
            tl.fromTo(
              childrenToAnimate,
              { opacity: 0, y: 20, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.out',
                clearProps: 'transform',
              },
              '-=0.4'
            );
          }
        });

        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 80);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, location.search]);

  return <>{children}</>;
};
