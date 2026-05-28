import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Map as MapIcon, MapPin, BarChart2, Loader2, GraduationCap } from 'lucide-react';
import LocationInput, { UserLocation } from '../components/LocationInput';
import MapDisplay from '../components/MapDisplay';
import SearchBox from '../components/SearchBox';
import CollegesTab from '../components/CollegesTab';
import InsightsTab from '../components/InsightsTab';
import { CareerDetailModal } from '../components/CareerDetailModal';
import type { CareerFull } from '../data/careersTypes';
import { getUniversitiesByProvince, getTVETCollegesByProvince, createUniversityMarkers, createTVETMarkers } from '../services/mapService';

interface MapPageProps extends AuthedProps {}

function MapPageComponent({ user, onNavigate }: MapPageProps) {
  const [step, setStep] = useState<'location' | 'exploring'>('location');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'colleges' | 'insights'>('colleges');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState(['demand', 'colleges']);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);

  const handleLocationSelect = (location: UserLocation) => {
    setUserLocation(location);
    setStep('exploring');
    setSearchQuery('');
    setActiveTab('colleges');
  };

  const handleLayerToggle = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const handleBackClick = () => {
    setStep('location');
    setUserLocation(null);
    setSearchQuery('');
  };

  const province = userLocation?.province || '';

  const mapMarkers = useMemo((): { id: string; lat: number; lng: number; type: 'user' | 'career' | 'university' | 'tvet'; title: string }[] => {
    if (!province) return [];
    try {
      if (activeTab === 'colleges') {
        const unis = getUniversitiesByProvince(province);
        const tvet = getTVETCollegesByProvince(province);
        return [...createUniversityMarkers(unis), ...createTVETMarkers(tvet)] as any;
      }
    } catch {
      // ignore
    }
    return [];
  }, [province, activeTab]);

  const tabs = [
    { id: 'colleges' as const, label: 'Colleges', icon: GraduationCap },
    { id: 'insights' as const, label: 'Insights', icon: BarChart2 },
  ];

  return (
    <div className="min-h-screen w-full bg-white">

      <AnimatePresence mode="wait">
        {step === 'location' ? (
          <motion.div
            key="location-step"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 bg-slate-50"
          >
            <div className="w-full max-w-md">
              {/* Icon + heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="text-center mb-8"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mx-auto mb-5">
                  <MapIcon size={22} className="text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2">
                  Explore SA
                </p>
                <h1
                  className="text-[28px] font-black text-slate-900 leading-tight mb-3"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  Job Market Map
                </h1>
                <p className="text-[14px] leading-[1.65] text-slate-500">
                  Discover colleges and job market insights near you.
                </p>
              </motion.div>

              {/* Location card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, ease: 'easeOut' }}
                className="bg-white rounded-xl border border-slate-200 p-6"
              >
                <LocationInput onLocationSelect={handleLocationSelect} />
              </motion.div>

              {/* Hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-4 flex items-start gap-3 px-1"
              >
                <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[12px] leading-[1.6] text-slate-400">
                  Enter your city or select your province to see nearby colleges, job demand, and market data.
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="exploring-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pt-20 pb-12"
          >
            <div className="max-w-7xl mx-auto px-4">
              {/* Page header */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 pb-5 border-b border-slate-100 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <h2
                      className="text-[18px] font-black text-slate-900 leading-tight"
                      style={{ letterSpacing: '-0.018em' }}
                    >
                      {userLocation?.label || 'Your Area'}
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      {province}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleBackClick}
                  whileHover={{ x: -1 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-[12px] font-bold hover:border-slate-300 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft size={13} />
                  Change location
                </motion.button>
              </motion.div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 }}
                className="w-full h-56 sm:h-80 lg:h-[420px] rounded-xl overflow-hidden border border-slate-200 mb-6"
              >
                {userLocation && (
                  <MapDisplay
                    center={[userLocation.lat, userLocation.lng]}
                    zoom={9}
                    userLocation={userLocation}
                    markers={mapMarkers}
                    activeLayers={activeLayers}
                    onLayerToggle={handleLayerToggle}
                  />
                )}
              </motion.div>

              {/* Results panel */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className="space-y-4"
              >
                {/* Search */}
                <SearchBox
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search colleges, careers..."
                />

                {/* Tabs */}
                <div className="flex gap-1 border-b border-slate-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-black uppercase tracking-[0.1em] border-b-2 transition-colors -mb-px ${
                        activeTab === tab.id
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                  {!province ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center py-16"
                    >
                      <div className="text-center">
                        <Loader2 size={32} className="animate-spin mx-auto mb-3 text-slate-300" />
                        <p className="text-[13px] text-slate-400">Detecting province…</p>
                      </div>
                    </motion.div>
                  ) : activeTab === 'colleges' ? (
                    <motion.div
                      key="colleges"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <CollegesTab province={province} searchQuery={searchQuery} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="insights"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <InsightsTab province={province} city={userLocation?.city} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-[11px] text-slate-400 text-center mt-8 flex items-center justify-center gap-1.5"
              >
                <BarChart2 size={12} />
                Data covers 59+ careers, 26 universities, and 50+ TVET colleges across South Africa
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedCareer && province && (
        <CareerDetailModal
          career={selectedCareer}
          isOpen={showCareerModal}
          onClose={() => setShowCareerModal(false)}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}

export default MapPageComponent;
