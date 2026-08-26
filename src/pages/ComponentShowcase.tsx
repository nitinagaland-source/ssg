import React from 'react';
import { Button } from '../components/common/Button';
import { Pill } from '../components/common/Pill';
import { CategoryChip } from '../components/common/CategoryChip';
import { SectionHeader } from '../components/common/SectionHeader';
import { ProductGridSkeleton, SchoolCardSkeleton } from '../components/common/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  const { showToast } = useToast();

  const dummyCategory = {
    id: 'cat-books',
    name: 'Textbooks & Bundles',
    slug: 'textbooks',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80',
    description: 'All syllabi',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="space-y-2 border-b border-[#E5E5E0] pb-6">
        <span className="text-xs font-mono uppercase text-[#FF5A1F]">Design System Playground</span>
        <h1 className="text-4xl font-extrabold font-display text-[#0A0A0A]">
          SSG Component & Token Showcase
        </h1>
        <p className="text-sm text-[#6B6B6B]">
          Visual verification bench for the SSG design system tokens, typography, and pill components.
        </p>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#0A0A0A]">
          1. Brand Color Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#FF5A1F] text-white space-y-1">
            <div className="font-bold">Primary Orange</div>
            <div>#FF5A1F</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#0A0A0A] text-white space-y-1">
            <div className="font-bold">Ink Black</div>
            <div>#0A0A0A</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#7C3AED] text-white space-y-1">
            <div className="font-bold">Accent Purple</div>
            <div>#7C3AED</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FFFFFF] text-[#0A0A0A] border border-[#E5E5E0] space-y-1">
            <div className="font-bold">Cream Background</div>
            <div>#FFFFFF</div>
          </div>
        </div>
      </section>

      {/* 2. Typography Ramps */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#0A0A0A]">
          2. Typographic Pairings
        </h2>
        <div className="p-6 bg-white rounded-3xl border border-[#E5E5E0] space-y-4">
          <div>
            <span className="text-[11px] font-mono text-[#6B6B6B]">Bricolage Grotesque (Heading)</span>
            <div className="text-3xl font-extrabold font-display text-[#0A0A0A]">
              Everything your child needs for school.
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono text-[#6B6B6B]">Instrument Serif (Italic Accent)</span>
            <div className="text-2xl font-serif-accent text-[#0A0A0A]">
              &ldquo;Browse our carefully curated collection of school essentials.&rdquo;
            </div>
          </div>
          <div>
            <span className="text-[11px] font-mono text-[#6B6B6B]">Inter (Body Text)</span>
            <p className="text-sm text-[#6B6B6B]">
              Standard body text with 1.6 line height and comfortable 65-75ch maximum reading width.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Button Archetypes */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#0A0A0A]">
          3. Pill Button Variations (Strict Pill Radius)
        </h2>
        <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-3xl border border-[#E5E5E0]">
          <Button variant="primary" showArrow>
            Primary Action
          </Button>
          <Button variant="ghost">
            Ghost Outline
          </Button>
          <Button variant="whatsapp">
            WhatsApp Desk
          </Button>
          <Button variant="primary" disabled>
            Disabled Pill
          </Button>
        </div>
      </section>

      {/* 4. Pills and Category Chips */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#0A0A0A]">
          4. Pills & Category Chips
        </h2>
        <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-3xl border border-[#E5E5E0]">
          <Pill variant="orange">#SESSION2026</Pill>
          <Pill variant="purple">CBSE Grade 10</Pill>
          <Pill variant="black">In Stock Dimapur</Pill>
          <Pill variant="green">Verified Booklist</Pill>
          <Pill variant="white">Dimapur Main</Pill>
          <CategoryChip category={dummyCategory} />
        </div>
      </section>

      {/* 5. Interactive Toast Tester */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#0A0A0A]">
          5. Toast Notifications
        </h2>
        <div className="flex flex-wrap gap-3 p-6 bg-white rounded-3xl border border-[#E5E5E0]">
          <Button
            variant="ghost"
            onClick={() => showToast('Textbook added to your shopping bag!', 'success')}
          >
            Trigger Success Toast
          </Button>
          <Button
            variant="ghost"
            onClick={() => showToast('Coupon code copied to clipboard', 'info')}
          >
            Trigger Info Toast
          </Button>
          <Button
            variant="ghost"
            onClick={() => showToast('Item sold out at Dimapur store', 'error')}
          >
            Trigger Error Toast
          </Button>
        </div>
      </section>

      {/* 6. Loading Skeletons */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold font-display uppercase tracking-wider text-[#0A0A0A]">
          6. Skeleton Loading States
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ProductGridSkeleton count={2} />
          <SchoolCardSkeleton />
        </div>
      </section>
    </div>
  );
};
