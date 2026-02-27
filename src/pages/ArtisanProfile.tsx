import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Star, Award, ShieldCheck } from 'lucide-react';

interface Artisan {
  id: number;
  name: string;
  bio: string;
  shortDescription: string;
  location: string;
  category: string;
  sustainabilityScore: number;
  image: string;
  videoUrl: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface ArtisanDetailResponse {
  artisan: Artisan;
  products: Product[];
}

export default function ArtisanProfile() {
  const { id } = useParams();
  const [data, setData] = useState<ArtisanDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/artisans/${id}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-stone-500 font-medium">Loading artisan story...</p>
    </div>
  );
  
  if (!data || !data.artisan) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Artisan not found</h2>
        <Link to="/artisans" className="text-emerald-600 font-bold">Back to all artisans</Link>
      </div>
    </div>
  );

  const { artisan, products } = data;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-4 border-white shrink-0"
            >
              <img src={artisan.image} className="w-full h-full object-cover" alt={artisan.name} />
            </motion.div>
            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-5xl font-serif font-bold text-stone-900">{artisan.name}</h1>
                <span className="inline-flex items-center px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold w-fit mx-auto md:mx-0">
                  <ShieldCheck size={16} className="mr-1" /> Verified Master Artisan
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-4 text-stone-600 mb-6">
                <span className="flex items-center gap-1"><MapPin size={18} /> {artisan.location}</span>
                <span className="flex items-center gap-1"><Award size={18} /> {artisan.category}</span>
                <span className="flex items-center gap-1"><Star size={18} className="text-amber-500 fill-amber-500" /> {artisan.sustainabilityScore}/100</span>
              </div>
              <p className="text-xl text-stone-600 max-w-2xl leading-relaxed italic mb-8">
                "{artisan.bio}"
              </p>
              
              {artisan.videoUrl ? (
                <div className="max-w-xl aspect-video rounded-3xl overflow-hidden bg-stone-200 shadow-lg">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={artisan.videoUrl} 
                    title="Artisan Story"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="max-w-xl aspect-video rounded-3xl bg-stone-100 flex items-center justify-center border border-dashed border-stone-300">
                  <p className="text-stone-400 italic">Video story coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-12">Creations by {artisan.name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-stone-100"
            >
              <Link to={`/product/${product.id}`}>
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.image_url || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'} 
                    className="w-full h-full object-cover" 
                    alt={product.name} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-1">{product.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-serif font-bold text-stone-900">₹{product.price}</span>
                    <span className="text-emerald-600 text-sm font-medium">View →</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
