import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Truck,
  BookOpen,
  MessageSquare,
  Building2,
  ArrowUpRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#0C061A] via-[#080312] to-[#040108] text-white pt-16 pb-24 md:pb-16 border-t border-purple-500/20 select-none overflow-hidden">
      {/* Soft Ambient Radial Background Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Brand & Trust Highlights */}
        <div className="border-b border-purple-500/15 pb-12 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-400/25 text-[11px] font-semibold tracking-wider uppercase text-purple-200 backdrop-blur-md">
                <Building2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Guwahati&apos;s Trusted Academic Landmark</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight text-white">
                Saraswati Student Gallery
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-body leading-relaxed">
                Guwahati&apos;s premier educational bookstore network — providing official school session booklists, tailored stationery bundles, uniform apparel, and verified academic supplies across Assam.
              </p>
            </div>

            {/* Direct Instant Action Links */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="https://wa.me/919864012345?text=Hi%20SSG%20Helpline"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-300 group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>WhatsApp Helpline Desk</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400/70" />
              </a>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/30 px-4 py-2.5 rounded-xl text-xs font-semibold backdrop-blur-md transition-all duration-300"
              >
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Store Locations</span>
              </Link>
            </div>
          </div>

          {/* 3 Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">100% Prescribed Textbooks</p>
                <p className="text-[11px] text-neutral-400">Mapped to verified school syllabuses</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Authentic Certified Supplies</p>
                <p className="text-[11px] text-neutral-400">Classmate, Camlin, Oxford, NCERT</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Same-Day Local Delivery</p>
                <p className="text-[11px] text-neutral-400">Panbazar, GS Road, Beltola & Maligaon</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm text-neutral-300">
          
          {/* Col 1: Shop Categories */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/categories/textbooks" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>School Textbooks</span>
                </Link>
              </li>
              <li>
                <Link to="/categories/notebooks" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Registers & Copies</span>
                </Link>
              </li>
              <li>
                <Link to="/categories/uniforms" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Official Uniforms</span>
                </Link>
              </li>
              <li>
                <Link to="/categories/stationery" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Classroom Stationery</span>
                </Link>
              </li>
              <li>
                <Link to="/categories/bags" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Bags & School Kits</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Partner Schools */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Partner Schools
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/schools/don-bosco-panbazar" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Don Bosco Panbazar</span>
                </Link>
              </li>
              <li>
                <Link to="/schools/dps-guwahati" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>DPS Guwahati</span>
                </Link>
              </li>
              <li>
                <Link to="/schools/sanskriti-gurukul" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Sanskriti The Gurukul</span>
                </Link>
              </li>
              <li>
                <Link to="/schools/st-marys-guwahati" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>St. Mary&apos;s HS School</span>
                </Link>
              </li>
              <li>
                <Link to="/schools" className="text-purple-300 hover:text-purple-200 font-semibold inline-flex items-center gap-1 pt-1">
                  <span>View All 8 Schools</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Guwahati Branch Network */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Guwahati Retail Hubs
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>Panbazar Main Gallery</span>
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Panbazar Book Market, Guwahati</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>GS Road Branch</span>
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Near Christian Basti Flyover</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span>Beltola &amp; Maligaon</span>
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">Tiniali &amp; Near N.F. Railway HQ</p>
              </div>
            </div>
          </div>

          {/* Col 4: Assistance & Direct Contact */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
              Help &amp; Support
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/contact" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>Store Timings &amp; Location</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-purple-400/50" />
                  <span>About SSG Story</span>
                </Link>
              </li>
              <li className="pt-2">
                <a
                  href="tel:+919864012345"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/40 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Phone className="w-3 h-3 text-purple-400" />
                  <span>+91 98640 12345</span>
                </a>
              </li>
              <li className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
                <Clock className="w-3 h-3 text-neutral-400 shrink-0" />
                <span>Mon–Sat: 8:30 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-500/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Saraswati Student Gallery. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-neutral-400">
            <span>Guwahati, Assam</span>
            <span>•</span>
            <span>Official Curriculum Store</span>
            <span>•</span>
            <span>Cash on Delivery Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

