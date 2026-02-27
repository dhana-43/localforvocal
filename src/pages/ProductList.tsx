import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  artisanName: string;
  artisan_id: number;
  image: string;
  category: string;
  sustainabilityScore: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-stone-500 font-medium">Loading collections...</p>
    </div>
  );

  return (
    <div className="py-24 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-serif font-bold text-stone-900 mb-6">Artisan Collections</h1>
            <p className="text-xl text-stone-600">Discover unique, handcrafted pieces that preserve the soul of Visakhapatnam.</p>
          </div>
          <div className="flex gap-4">
            {/* Filters could go here */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12 }}
              className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-stone-100 flex flex-col h-full"
            >
              <div className="aspect-[4/5] relative overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop'} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                    alt={product.name} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                </Link>
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-emerald-600 flex items-center gap-2 shadow-sm">
                  <Star size={14} fill="currentColor" /> {product.sustainabilityScore}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em] mb-3">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2 hover:text-emerald-600 transition-colors leading-tight">{product.name}</h3>
                </Link>
                <div className="text-stone-500 mb-6 font-medium">
                  by <Link to={`/artisan/${product.artisan_id}`} className="text-emerald-600 hover:underline">{product.artisanName}</Link>
                </div>
                <div className="mt-auto flex justify-between items-center pt-6 border-t border-stone-100">
                  <span className="text-2xl font-serif font-bold text-stone-900">₹{product.price}</span>
                  <Link to={`/product/${product.id}`} className="text-emerald-600 font-bold hover:underline">Details →</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
