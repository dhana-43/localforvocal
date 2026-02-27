import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Leaf, Users, Star } from 'lucide-react';

const categories = [
  { name: 'Etikoppaka Toys', image: 'https://picsum.photos/seed/toys/400/300' },
  { name: 'Kalamkari', image: 'https://picsum.photos/seed/kalamkari/400/300' },
  { name: 'Handloom Sarees', image: 'https://picsum.photos/seed/sarees/400/300' },
  { name: 'Coconut Crafts', image: 'https://picsum.photos/seed/coconut/400/300' },
  { name: 'Tribal Art', image: 'https://picsum.photos/seed/tribal/400/300' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 4)));
  }, []);

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#2D241E]">
        {/* Cultural Pattern Overlay */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ 
          backgroundImage: `url("https://www.transparenttextures.com/patterns/az-subtle.png")`,
          backgroundRepeat: 'repeat'
        }}></div>
        
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30"
            alt="Vizag Heritage"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D241E]/80 via-[#2D241E]/40 to-[#2D241E]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-[#F5E6D3] mb-8 leading-tight tracking-tight">
              Local for Vocal – <br />
              <span className="text-[#D4A373] italic">Empowering Vizag Artisans</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#E9D5C3] mb-12 font-light leading-relaxed max-w-3xl mx-auto">
              Connecting artisans directly to customers through transparency and fair trade.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/products" className="bg-[#D4A373] text-[#2D241E] px-12 py-5 rounded-full text-lg font-bold hover:bg-[#E9D5C3] transition-all shadow-2xl shadow-black/20">
                Explore Products
              </Link>
              <Link to="/artisans" className="bg-white/5 backdrop-blur-md text-[#F5E6D3] border border-[#F5E6D3]/20 px-12 py-5 rounded-full text-lg font-bold hover:bg-white/10 transition-all">
                Meet the Artisans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Story Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-serif font-bold text-stone-900 mb-8 leading-tight">The Soul of <br />Our Craft</h2>
              <p className="text-xl text-stone-600 mb-10 leading-relaxed">
                Every piece at LocalVocal is more than just an object—it's a story of resilience, tradition, and mastery. Watch how our artisans breathe life into wood, clay, and cloth.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?q=80&w=100&auto=format&fit=crop`} className="w-12 h-12 rounded-full border-4 border-white object-cover" alt="Artisan" />
                  ))}
                </div>
                <p className="text-stone-500 font-medium">Joined by 50+ Master Artisans</p>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="aspect-video rounded-[40px] overflow-hidden shadow-2xl bg-stone-100 relative group"
            >
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/f-XWvC1uLpE?autoplay=0&mute=1&loop=1" 
                title="Artisan Story"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="opacity-80 group-hover:opacity-100 transition-opacity"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-serif font-bold text-stone-900 mb-6">Masterpieces</h2>
              <p className="text-xl text-stone-600">Handpicked creations that define the artistic excellence of Visakhapatnam.</p>
            </div>
            <Link to="/products" className="group flex items-center gap-3 text-emerald-600 font-bold text-lg">
              View Full Collection <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
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
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2 hover:text-emerald-600 transition-colors leading-tight">{product.name}</h3>
                  </Link>
                  <div className="text-stone-500 mb-6 font-medium">
                    by <Link to={`/artisan/${product.artisan_id}`} className="text-emerald-600 hover:underline">{product.artisanName}</Link>
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-6 border-t border-stone-100">
                    <span className="text-2xl font-serif font-bold text-stone-900">₹{product.price}</span>
                    <Link to={`/product/${product.id}`} className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-stone-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-stone-900 mb-12 text-center">Heritage Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-4 relative">
                  <img src={cat.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={cat.name} />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-medium text-lg leading-tight">{cat.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Transparent Pricing</h3>
              <p className="text-stone-600">70% of every purchase goes directly to the artisan. No hidden middlemen margins.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Sustainability Score</h3>
              <p className="text-stone-600">Every product is rated on its environmental impact and raw material sourcing.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-4">Artisan Traceability</h3>
              <p className="text-stone-600">Scan QR codes to see the journey of your product from the artisan's hands to yours.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

