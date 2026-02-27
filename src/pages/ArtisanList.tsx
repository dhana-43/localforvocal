import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, Star, Search, Filter, AlertCircle, Loader2 } from 'lucide-react';

interface Artisan {
  id: number;
  name: string;
  location: string;
  image: string;
  category: string;
  sustainabilityScore: number;
  shortDescription: string;
}

export default function ArtisanList() {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Etikoppaka Toys',
    'Kalamkari',
    'Handloom',
    'Coconut Crafts',
    'Tribal Art'
  ];

  useEffect(() => {
    fetchArtisans();
  }, []);

  const fetchArtisans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/artisans');
      if (!response.ok) throw new Error('Failed to fetch artisans');
      const data = await response.json();
      setArtisans(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredArtisans = artisans.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || artisan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={48} className="text-emerald-600" />
        </motion.div>
        <p className="text-stone-500 font-medium animate-pulse">Loading master artisans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[40px] shadow-xl border border-red-100 text-center max-w-md">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button 
            onClick={fetchArtisans}
            className="bg-stone-900 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-serif font-bold text-stone-900 mb-8 tracking-tight"
          >
            The Master <span className="text-emerald-600 italic">Artisans</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-stone-600 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Meet the hands that preserve the heritage of Visakhapatnam. Every artisan on our platform is a verified master of their craft.
          </motion.p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-16 items-center justify-between bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text"
              placeholder="Search artisans by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-stone-900"
            />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Filter className="text-stone-400" size={20} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 px-6 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-stone-900 appearance-none cursor-pointer font-medium"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Artisan Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          <AnimatePresence mode="popLayout">
            {filteredArtisans.map((artisan) => (
              <motion.div 
                key={artisan.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -15 }}
                className="bg-white rounded-[60px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-stone-100 p-12 group flex flex-col h-full"
              >
                <div className="flex flex-col items-center text-center flex-grow">
                  <div className="relative mb-10">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-stone-50 shadow-inner group-hover:border-emerald-50 transition-colors">
                      <img 
                        src={artisan.image} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                        alt={artisan.name} 
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white px-4 py-2 rounded-full shadow-lg border border-stone-100 flex items-center gap-2">
                      <Star size={14} className="text-emerald-600 fill-emerald-600" />
                      <span className="text-sm font-bold text-stone-900">{artisan.sustainabilityScore}</span>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1 rounded-full">
                      {artisan.category}
                    </span>
                  </div>

                  <h3 className="text-3xl font-serif font-bold text-stone-900 mb-3">{artisan.name}</h3>
                  
                  <p className="text-stone-500 flex items-center gap-2 mb-6 text-lg">
                    <MapPin size={20} className="text-emerald-600" /> {artisan.location}
                  </p>

                  <p className="text-stone-600 mb-10 line-clamp-2 italic leading-relaxed">
                    "{artisan.shortDescription}"
                  </p>
                </div>

                <Link 
                  to={`/artisan/${artisan.id}`}
                  className="w-full bg-stone-900 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all text-lg shadow-xl shadow-stone-900/10"
                >
                  View Artisan Story <ArrowRight size={22} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredArtisans.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Search size={64} className="text-stone-200 mx-auto mb-6" />
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No artisans found</h3>
            <p className="text-stone-500">Try adjusting your search or category filters.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
