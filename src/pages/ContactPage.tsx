import React, { useState } from 'react';
import { useSelectedShop } from '../context/SelectedShopContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { MapPin, Phone, Clock, Mail, Send } from 'lucide-react';
import { WhatsAppIcon } from '../components/common/WhatsAppIcon';

export const ContactPage: React.FC = () => {
  const { availableShops } = useSelectedShop();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast('Please complete all form fields', 'error');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setName('');
      setPhone('');
      setMessage('');
      showToast('Message sent! Our store manager will reply shortly.', 'success');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#FF5A1F]">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#0A0A0A] tracking-tight">
          Store Locations & WhatsApp Desks
        </h1>
        <p className="text-base sm:text-lg font-serif-accent text-[#6B6B6B]">
          Have a question about a particular booklist or size exchange? Drop by our stores or message our counter teams directly on WhatsApp.
        </p>
      </div>

      {/* 3 Physical Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {availableShops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E5E0] space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFFFFF] text-[#6B6B6B] px-3 py-1 rounded-full border border-[#E5E5E0]">
                {shop.city} Branch
              </span>
              <h3 className="text-xl font-bold font-display text-[#0A0A0A]">
                {shop.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-[#8E8E93] shrink-0 mt-0.5" />
                <span>{shop.address}, {shop.city} — {shop.pincode}</span>
              </p>

              <div className="space-y-1 text-xs text-[#6B6B6B] pt-2">
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8E8E93]" />
                  <span>{shop.openHours}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#8E8E93]" />
                  <a href={`tel:${shop.phone}`} className="text-[#0A0A0A] font-semibold hover:underline">
                    {shop.phone}
                  </a>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5E0]">
              <a
                href={`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
                  `Hi, I have a query about ${shop.name}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-full text-xs font-semibold hover:bg-[#1ebd5d] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>WhatsApp {shop.city} Desk</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Form */}
      <div className="bg-white p-6 sm:p-12 rounded-3xl border border-[#E5E5E0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0A0A0A]">
            Send an Online Inquiry
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            School principals, book committee heads, or parents with special bulk inquiries can leave a message here. We respond within 3 business hours.
          </p>
          <div className="pt-2 text-xs text-[#6B6B6B] space-y-2">
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF5A1F]" />
              <span>orders@saraswatigallery.in</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF5A1F]" />
              <span>+91 94360 01234 (Main Desk)</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                Your Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#FFFFFF] border border-[#E5E5E0] rounded-xl px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full bg-[#FFFFFF] border border-[#E5E5E0] rounded-xl px-3.5 py-2.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              Message / Book List Query *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about the school, classes, or specific supplies you need..."
              rows={4}
              className="w-full bg-[#FFFFFF] border border-[#E5E5E0] rounded-xl p-3.5 text-sm text-[#0A0A0A] focus:outline-none focus:border-[#0A0A0A]"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={sending}
            className="text-xs sm:text-sm py-3 px-6"
          >
            {sending ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </div>
    </div>
  );
};
