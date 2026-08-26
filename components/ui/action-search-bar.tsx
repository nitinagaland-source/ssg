"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  BarChart2,
  Globe,
  Video,
  PlaneTakeoff,
  AudioLines,
} from "lucide-react";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  onClick?: () => void;
}

interface SearchResult {
  actions: Action[];
}

export const allActions: Action[] = [
  {
    id: "1",
    label: "Book tickets",
    icon: <PlaneTakeoff className="h-3.5 w-3.5 text-blue-500" />,
    description: "Operator",
    short: "⌘K",
    end: "Agent",
  },
  {
    id: "2",
    label: "Summarize",
    icon: <BarChart2 className="h-3.5 w-3.5 text-orange-500" />,
    description: "gpt-4o",
    short: "⌘cmd+p",
    end: "Command",
  },
  {
    id: "3",
    label: "Screen Studio",
    icon: <Video className="h-3.5 w-3.5 text-purple-500" />,
    description: "gpt-4o",
    short: "",
    end: "Application",
  },
  {
    id: "4",
    label: "Talk to Jarvis",
    icon: <AudioLines className="h-3.5 w-3.5 text-green-500" />,
    description: "gpt-4o voice",
    short: "",
    end: "Active",
  },
  {
    id: "5",
    label: "Translate",
    icon: <Globe className="h-3.5 w-3.5 text-blue-500" />,
    description: "gpt-4o",
    short: "",
    end: "Command",
  },
];

export interface ActionSearchBarProps {
  actions?: Action[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelectAction?: (action: Action) => void;
  className?: string;
}

export function ActionSearchBar({
  actions = allActions,
  placeholder = "Search school books, uniforms, classes...",
  onSearch,
  onSelectAction,
  className = "",
}: ActionSearchBarProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const debouncedQuery = useDebounce(query, 180);

  useEffect(() => {
    if (!isFocused) {
      setResult(null);
      return;
    }

    if (!debouncedQuery) {
      setResult({ actions });
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filteredActions = actions.filter((action) => {
      const searchableText = `${action.label} ${action.description || ""}`.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    setResult({ actions: filteredActions });
  }, [debouncedQuery, isFocused, actions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const container = {
    hidden: { opacity: 0, scale: 0.98, y: -4 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.03,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: -4,
      transition: {
        duration: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.18,
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: {
        duration: 0.12,
      },
    },
  };

  const handleFocus = () => {
    setSelectedAction(null);
    setIsFocused(true);
  };

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
    setIsFocused(false);
    if (action.onClick) {
      action.onClick();
    }
    if (onSelectAction) {
      onSelectAction(action);
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto ${className}`}>
      {/* Animated Flowing Purple Gradient Shell */}
      <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 animate-purple-flow shadow-[0_8px_25px_-6px_rgba(124,58,237,0.4)]">
        <div className="relative bg-gradient-to-r from-[#2e0854] via-[#1e1035] to-[#250b44] rounded-[14px] p-1 sm:p-1.5 flex items-center">
          
          {/* Crisp Pure White Input Container */}
          <div className="relative w-full">
            <Input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={() => setTimeout(() => setIsFocused(false), 220)}
              className="pl-3.5 pr-9 py-1.5 h-8.5 sm:h-9 text-xs sm:text-[13px] font-medium rounded-xl border border-white/40 bg-white text-neutral-900 placeholder:text-neutral-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-0 focus-visible:border-purple-300 transition-all"
            />
            
            {/* Animated Dynamic Icon */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="popLayout">
                {query.length > 0 ? (
                  <motion.div
                    key="send"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Send className="w-3.5 h-3.5 text-purple-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Search className="w-3.5 h-3.5 text-purple-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dropdown Floating Results Menu */}
        <div className="w-full absolute top-[calc(100%+6px)] left-0 right-0 z-50">
          <AnimatePresence>
            {isFocused && result && !selectedAction && (
              <motion.div
                className="w-full border rounded-xl shadow-[0_12px_36px_rgba(30,10,60,0.25)] overflow-hidden border-purple-200/90 bg-white/98 backdrop-blur-md"
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.ul className="p-1 space-y-0.5 max-h-[220px] overflow-y-auto no-scrollbar">
                  {result.actions.map((action) => (
                    <motion.li
                      key={action.id}
                      className="px-2.5 py-1.5 flex items-center justify-between hover:bg-purple-50 active:bg-purple-100/80 cursor-pointer rounded-lg transition-colors duration-120"
                      variants={item}
                      layout
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleActionClick(action);
                      }}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-100">
                          {action.icon}
                        </div>
                        <div className="flex flex-col text-left truncate">
                          <span className="text-xs font-semibold text-neutral-900 leading-snug truncate">
                            {action.label}
                          </span>
                          {action.description && (
                            <span className="text-[10px] text-neutral-500 truncate">
                              {action.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {action.short && (
                          <span className="text-[9px] font-mono text-purple-700 bg-purple-100/70 px-1.5 py-0.5 rounded border border-purple-200/50">
                            {action.short}
                          </span>
                        )}
                        {action.end && (
                          <span className="text-[9px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-200/50">
                            {action.end}
                          </span>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
                
                <div className="px-2.5 py-1 border-t border-purple-100/70 bg-purple-50/40 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Quick action discovery</span>
                  <span>ESC to dismiss</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
