import React from 'react';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const WhatsAppFloater: React.FC = () => {
  const { getGeneralQueryUrl } = useWhatsApp();

  return (
    <aside aria-label="WhatsApp Support">
      <a
        href={getGeneralQueryUrl()}
        target="_blank"
        rel="noreferrer"
        className="fixed z-30 bottom-16 md:bottom-6 right-4 sm:right-6 bg-[#25D366] text-white p-3 sm:p-3.5 rounded-full shadow-[0_8px_20px_-2px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] transition-all hover:scale-110 select-none flex items-center gap-2 group border-2 border-white/40"
        title="Chat with SSG Store on WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
        <span className="hidden group-hover:inline text-xs font-bold pr-1 text-white">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};
