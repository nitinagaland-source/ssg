import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastItem {
  id: string;
  message: string;
  type?: 'default' | 'success' | 'danger' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: 'default' | 'success' | 'danger' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'default' | 'success' | 'danger' | 'error' | 'info' = 'default') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container: Bottom-center on mobile, bottom-right on desktop */}
      <div
        id="toast-container"
        className="fixed z-50 pointer-events-none flex flex-col gap-2.5 max-w-sm w-full p-4 bottom-16 sm:bottom-6 sm:right-6 sm:left-auto left-0 right-0 mx-auto sm:mx-0 items-center sm:items-end"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-[#0A0A0A] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-full flex items-center gap-2.5 shadow-xl border border-white/10"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  toast.type === 'success'
                    ? 'bg-[#16A34A]'
                    : toast.type === 'danger' || toast.type === 'error'
                    ? 'bg-[#DC2626]'
                    : toast.type === 'info'
                    ? 'bg-[#3B82F6]'
                    : 'bg-[#FF5A1F]'
                }`}
              />
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
