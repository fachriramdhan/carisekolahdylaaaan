import { useState, useEffect, useMemo } from 'react';
import { MapPin, School as SchoolIcon, Navigation, Filter, ChevronRight, Bus, Info, Search, Map as MapIcon, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MapComponent from './components/MapComponent';
import schoolsData from './data/schools.json';
import { School, UserLocation } from './types';
import { calculateDistance, formatDistance } from './utils';

const SCHOOL_TYPES = ['SMK', 'SMA'];

export default function App() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [radius, setRadius] = useState<number>(10);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['SMK', 'SMA']);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Jakarta center if denied
          setUserLocation({ lat: -6.2088, lng: 106.8456 });
        }
      );
    }
  }, []);

  const filteredSchools = useMemo(() => {
    return (schoolsData as School[]).filter((school) => {
      const matchesType = selectedTypes.includes(school.tipe);
      const matchesSearch = school.nama.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!userLocation) return matchesType && matchesSearch;

      const distance = calculateDistance(
        { lat: userLocation.lat, lng: userLocation.lng },
        school.koordinat
      );
      
      return matchesType && matchesSearch && distance <= radius;
    }).sort((a, b) => {
      if (!userLocation) return 0;
      const distA = calculateDistance({ lat: userLocation.lat, lng: userLocation.lng }, a.koordinat);
      const distB = calculateDistance({ lat: userLocation.lat, lng: userLocation.lng }, b.koordinat);
      return distA - distB;
    });
  }, [userLocation, radius, selectedTypes, searchQuery]);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <SchoolIcon className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">cari dilaaan</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mt-1">cari sekolahnya</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${userLocation ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
            <div className={`w-2 h-2 rounded-full ${userLocation ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
            {userLocation ? 'GPS Aktif' : 'Mencari Lokasi...'}
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <section className="bg-white border-b border-slate-100 px-4 py-2 sm:px-6 sm:py-3 z-10 relative">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          {/* Radius Filter */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
                <Filter className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-black text-slate-800 tracking-tight whitespace-nowrap">Radius</span>
            </div>
            <div className="flex-1 md:w-48 flex items-center gap-3">
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="1"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100/50 whitespace-nowrap">
                {radius} KM
              </span>
            </div>
          </div>

          {/* School Type Filter */}
          <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-8">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Tipe:</span>
            <div className="flex gap-1.5">
              {SCHOOL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300 border ${
                    selectedTypes.includes(type)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-100 hover:text-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Search Summary (Desktop only) */}
          <div className="hidden lg:flex items-center gap-3 ml-auto text-right">
            <div className="text-[11px] font-bold text-slate-500">
              Ditemukan <span className="text-indigo-600 font-black">{filteredSchools.length}</span> sekolah
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_320px] md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_440px] gap-6 p-4 sm:p-6 md:p-8 overflow-hidden bg-[#f8fafc] relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Left Card: Map Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            relative bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(79,70,229,0.08)] border border-white overflow-hidden z-10
            ${viewMode === 'list' ? 'hidden' : 'flex'}
            sm:flex
          `}
        >
          <MapComponent 
            userLocation={userLocation}
            schools={filteredSchools}
            radius={radius}
            selectedSchool={selectedSchool}
            onSchoolSelect={(school) => {
              setSelectedSchool(school);
            }}
          />
        </motion.div>

        {/* Right Card: School List Container */}
        <motion.aside 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`
            bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(79,70,229,0.08)] border border-white flex flex-col overflow-hidden z-10
            ${viewMode === 'map' ? 'hidden' : 'flex'}
            sm:flex
          `}
        >
          {/* List Header */}
          <div className="p-7 border-b border-slate-50 bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-3 tracking-tight">
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <ListIcon className="w-5 h-5 text-indigo-600" />
                </div>
                Daftar Sekolah
              </h2>
              <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100">
                {filteredSchools.length} Hasil
              </div>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Cari nama sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3.5 bg-slate-50/80 border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/20 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 pb-32 sm:pb-6 space-y-4 custom-scrollbar bg-slate-50/20">
            {filteredSchools.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-6">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-6">
                    <Info className="w-12 h-12 text-slate-200" />
                  </div>
                  <p className="text-sm text-slate-400 font-bold px-12 leading-relaxed">
                    Tidak ada sekolah ditemukan dalam radius <span className="text-indigo-600">{radius}km</span>.
                  </p>
                </div>
              </div>
            ) : (
              filteredSchools.map((school) => (
                <motion.div
                  layout
                  key={school.id}
                  onClick={() => setSelectedSchool(school)}
                  whileHover={{ y: -4 }}
                  className={`
                    p-6 rounded-[2.2rem] border transition-all duration-300 cursor-pointer relative overflow-hidden bg-white
                    ${selectedSchool?.id === school.id 
                      ? 'border-indigo-500 shadow-2xl shadow-indigo-100 ring-2 ring-indigo-500/10' 
                      : 'border-slate-100 hover:border-indigo-200 hover:shadow-xl shadow-sm'}
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-colors ${selectedSchool?.id === school.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-indigo-600'}`}>
                        <SchoolIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-[13px] leading-tight tracking-tight">{school.nama}</h3>
                        <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-widest">{school.tipe}</p>
                      </div>
                    </div>
                    {userLocation && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                          {formatDistance(calculateDistance({ lat: userLocation.lat, lng: userLocation.lng }, school.koordinat))}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-4 font-medium">{school.alamat}</p>

                  <AnimatePresence>
                    {selectedSchool?.id === school.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-slate-50 mt-4 space-y-6">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                              <Bus className="w-4 h-4" />
                              Rute Transit
                            </div>
                            <div className="grid gap-2.5">
                              {school.angkutan_umum.map((transit, idx) => (
                                <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 group/transit hover:bg-white hover:border-indigo-100 transition-all">
                                  <div className="font-black text-slate-800 text-[11px] flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.4)]"></div>
                                    {transit.line}
                                  </div>
                                  {transit.halte_terdekat && (
                                    <div className="text-slate-500 mt-2 ml-4 text-[10px] font-medium">
                                      Halte: <span className="text-slate-900 font-bold">{transit.halte_terdekat}</span> 
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${school.koordinat.lat},${school.koordinat.lng}&travelmode=transit`, '_blank');
                            }}
                            className="w-full bg-indigo-600 text-white py-4.5 rounded-2xl text-[11px] font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-[0.97] uppercase tracking-widest"
                          >
                            <Navigation className="w-4 h-4" />
                            Panduan Rute
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </motion.aside>

        {/* Mobile Navigation Bar */}
        <div className="sm:hidden fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white/40 px-3 py-3 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[2000] flex items-center gap-2">
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 ${viewMode === 'map' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' : 'text-slate-400'}`}
          >
            <MapIcon className="w-4 h-4" />
            PETA
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105' : 'text-slate-400'}`}
          >
            <ListIcon className="w-4 h-4" />
            DAFTAR
          </button>
        </div>
      </main>

      {/* Mobile Bottom Sheet for Selected School */}
      <AnimatePresence>
        {selectedSchool && viewMode === 'map' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="sm:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgb(0,0,0,0.12)] z-[3000] p-6 max-h-[80vh] overflow-y-auto"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md">{selectedSchool.tipe}</span>
                  <h3 className="font-bold text-slate-900 text-lg">{selectedSchool.nama}</h3>
                </div>
                <p className="text-xs text-slate-500">{selectedSchool.alamat}</p>
              </div>
              <button 
                onClick={() => setSelectedSchool(null)}
                className="p-2 bg-slate-100 rounded-full text-slate-400"
              >
                <ChevronRight className="w-5 h-5 rotate-90" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Bus className="w-4 h-4" />
                Rekomendasi Angkutan
              </div>
              <div className="grid grid-cols-1 gap-3">
                {selectedSchool.angkutan_umum.map((transit, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                    <div className="font-bold text-slate-800">{transit.line}</div>
                    {transit.halte_terdekat && (
                      <div className="text-slate-500 mt-1">Turun di: <span className="text-indigo-600 font-medium">{transit.halte_terdekat}</span> ({transit.jarak_ke_lokasi})</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedSchool.koordinat.lat},${selectedSchool.koordinat.lng}&travelmode=transit`, '_blank');
              }}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
            >
              <Navigation className="w-5 h-5" />
              Mulai Navigasi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
