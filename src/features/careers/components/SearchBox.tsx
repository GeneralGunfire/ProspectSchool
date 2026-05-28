import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { allCareersComplete } from '../data/careers400Final';
import { MAJOR_CITIES } from '../data/mapData';

interface SearchBoxProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export default function SearchBox({ value, onChange, placeholder = 'Search careers, cities, costs...' }: SearchBoxProps) {
  const [suggestions, setSuggestions] = useState<(typeof MAJOR_CITIES[0] | { type: 'career'; name: string })[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate suggestions
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lower = value.toLowerCase();
    const careerSuggestions = allCareersComplete
      .filter((c) => c.title.toLowerCase().includes(lower))
      .slice(0, 3)
      .map((c) => ({ type: 'career' as const, name: c.title }));

    const citySuggestions = MAJOR_CITIES.filter((c) => c.name.toLowerCase().includes(lower)).slice(0, 2);

    setSuggestions([...careerSuggestions, ...citySuggestions]);
    setShowSuggestions(true);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (text: string) => {
    onChange(text);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-slate-400 pointer-events-none" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value && suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 text-sm transition"
        />
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-xl z-50"
          >
            {suggestions.map((item, idx) => (
              <motion.button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick('type' in item ? item.name : item.name)}
                whileHover={{ backgroundColor: '#f1f5f9' }}
                className="w-full px-4 py-3 text-left text-sm border-b last:border-b-0 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {'type' in item ? 'Career' : 'Location'}
                  </span>
                  <span className="text-slate-900">
                    {'type' in item ? item.name : item.name}
                  </span>
                  {!('type' in item) && (
                    <span className="text-xs text-slate-500 ml-auto">{item.province}</span>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
