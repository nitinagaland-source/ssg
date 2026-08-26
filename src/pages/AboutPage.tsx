import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { MapPin, BookOpen, Heart, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Editorial Hero */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5A1F]">
          Our Story & Commitment
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-[#0A0A0A] tracking-tight leading-[1.08]">
          Serving students across Guwahati with care and precision.
        </h1>
        <p className="text-lg sm:text-xl font-serif-accent text-[#6B6B6B] leading-relaxed">
          Founded in Guwahati, Saraswati Student Gallery was born to solve a real family headache: running from store to store every February trying to find syllabus books and fitted school uniforms.
        </p>
      </div>

      {/* Hero Image Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 rounded-3xl overflow-hidden aspect-16/10 border border-[#E5E5E0]">
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1000&auto=format&fit=crop&q=80"
            alt="School classroom"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0A0A0A]">
            Direct from school principals to your backpack.
          </h2>
          <p className="text-sm text-[#6B6B6B] leading-relaxed">
            Every year, we coordinate with school leadership across Don Bosco Panbazar, DPS Guwahati, Sanskriti The Gurukul, St. Mary&apos;s, and Maria&apos;s Public School to verify syllabus editions before the new academic session starts.
          </p>
          <div className="space-y-3 pt-2 text-xs text-[#0A0A0A] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span>Zero outdated textbook editions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span>Standard school crest embroidery verified by administration</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A1F]" />
              <span>Same-day pickup counters across Panbazar, GS Road, Beltola &amp; Maligaon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E5E5E0] space-y-3">
          <Award className="w-8 h-8 text-[#FF5A1F]" />
          <h3 className="text-lg font-bold font-display text-[#0A0A0A]">
            Guaranteed Authenticity
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            Direct ties with NCERT, Oxford University Press, Cambridge, and Orient Blackswan ensure 100% authentic publications.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E5E5E0] space-y-3">
          <MapPin className="w-8 h-8 text-[#0A0A0A]" />
          <h3 className="text-lg font-bold font-display text-[#0A0A0A]">
            Neighborhood Hubs
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            We operate physical shops staffed by friendly locals who know your school&apos;s exact requirements inside out.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-[#E5E5E0] space-y-3">
          <Heart className="w-8 h-8 text-[#7C3AED]" />
          <h3 className="text-lg font-bold font-display text-[#0A0A0A]">
            Parent-Centric Support
          </h3>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            WhatsApp us your school slip, and we will package the exact books, notebooks, and uniform set with no effort required on your end.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#0A0A0A] text-white p-8 sm:p-14 rounded-3xl text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
          Ready for Session 2026?
        </h2>
        <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto font-serif-accent">
          Pick your shop to browse ready packages or find syllabus booklists for your school.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asAnchor href="/select-shop" variant="primary" className="bg-[#FF5A1F] hover:bg-white hover:text-[#0A0A0A]" showArrow>
            Select Your Store
          </Button>
          <Button asAnchor href="/schools" variant="ghost" className="text-white border-white hover:bg-white hover:text-[#0A0A0A]">
            Browse Partner Schools
          </Button>
        </div>
      </div>
    </div>
  );
};
