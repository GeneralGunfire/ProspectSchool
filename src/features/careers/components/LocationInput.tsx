import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Loader, AlertCircle, Check } from 'lucide-react';
import { MAJOR_CITIES, getProvinceFromCoords, getNearestCity } from '../data/mapData';

export interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  province: string;
  city?: string;
}

interface LocationInputProps {
  onLocationSelect: (location: UserLocation) => void;
  isLoading?: boolean;
}

export default function LocationInput({ onLocationSelect, isLoading = false }: LocationInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<typeof MAJOR_CITIES>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter cities based on input
  useEffect(() => {
    if (!input.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lower = input.toLowerCase();
    const filtered = MAJOR_CITIES.filter(
      (city) => city.name.toLowerCase().includes(lower) || city.province.toLowerCase().includes(lower)
    );

    setSuggestions(filtered);
    setShowSuggestions(true);
    setError('');
  }, [input]);

  // Close suggestions when clicking outside
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

  /**
   * Handle city selection from autocomplete
   */
  function handleCitySelect(city: typeof MAJOR_CITIES[0]) {
    setInput(city.name);
    setShowSuggestions(false);
    setSuccess(true);

    const location: UserLocation = {
      lat: city.lat,
      lng: city.lng,
      label: `${city.name}, ${city.province}`,
      province: city.province,
      city: city.name,
    };

    setTimeout(() => {
      onLocationSelect(location);
      setSuccess(false);
    }, 300);
  }

  /**
   * Use browser geolocation
   */
  function handleGeolocation() {
    setGeoLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      setGeoLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setError('Geolocation timeout - please enter location manually');
      setGeoLoading(false);
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout);
        const { latitude, longitude } = position.coords;

        // Get province from coordinates
        const province = getProvinceFromCoords(latitude, longitude);

        if (!province) {
          setError('Location is outside South Africa. Please select a SA location.');
          setGeoLoading(false);
          return;
        }

        // Get nearest city
        const nearestCity = getNearestCity(latitude, longitude);
        const label = nearestCity ? `${nearestCity.name}, ${nearestCity.province}` : `${province}`;

        setInput(label);
        setSuccess(true);

        setTimeout(() => {
          onLocationSelect({
            lat: latitude,
            lng: longitude,
            label,
            province,
            city: nearestCity?.name,
          });
          setSuccess(false);
        }, 300);
      },
      (err) => {
        clearTimeout(timeout);
        if (err.code === 1) {
          setError('Location access denied. Please enter your location manually.');
        } else if (err.code === 2) {
          setError('Unable to get location. Please try entering it manually.');
        } else {
          setError('Error getting location. Please try again.');
        }
        setGeoLoading(false);
      }
    );
  }

  return (
    <div className="w-full max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (suggestions.length > 0) {
            handleCitySelect(suggestions[0]);
          }
        }}
        className="space-y-4"
      >
        <div className="relative">
          <div className="relative flex items-center">
            <MapPin className="absolute left-4 text-slate-900 pointer-events-none" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => input && setShowSuggestions(true)}
              placeholder="Enter your location (e.g., Johannesburg)"
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-slate-900 transition"
              disabled={isLoading || geoLoading}
            />
            {success && <Check className="absolute right-4 text-slate-900" size={20} />}
            {geoLoading && <Loader className="absolute right-4 text-slate-900 animate-spin" size={20} />}
          </div>

          {/* Autocomplete Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg z-50"
              >
                {suggestions.map((city) => (
                  <motion.button
                    key={`${city.name}-${city.province}`}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    whileHover={{ backgroundColor: '#f3f4f6' }}
                    className="w-full px-4 py-3 text-left flex justify-between items-center border-b last:border-b-0"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">{city.name}</div>
                      <div className="text-sm text-gray-600">{city.province}</div>
                    </div>
                    {city.hotspot && <span className="text-xs font-bold text-slate-500">HOT</span>}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200"
          >
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || geoLoading || !input.trim()}
            className="flex-1 prospect-btn-primary text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {geoLoading ? 'Finding...' : 'Search'}
          </motion.button>

          <motion.button
            type="button"
            onClick={handleGeolocation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading || geoLoading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {geoLoading ? 'Finding...' : 'Use My Location'}
          </motion.button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Enter a South African city or use your location to get started
        </div>
      </form>
    </div>
  );
}
