import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { MapPin, Clock, Package, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  artisanName: string;
  artisan_id: number;
  artisanBio: string;
  image: string;
  category: string;
  rawMaterialSource: string;
  timeToCreate: string;
  sustainabilityScore: number;
  location: string;
  videoUrl: string;
  qrCode: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setPurchasing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: id })
      });
      
      if (res.ok) {
        setPurchased(true);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (e) {
      alert('An error occurred.');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-stone-500 font-medium">Loading product details...</p>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Product not found</h2>
        <Link to="/products" className="text-emerald-600 font-bold">Back to collection</Link>
      </div>
    </div>
  );

  const artisanShare = (product.price * 0.7).toFixed(2);
  const platformFee = (product.price * 0.1).toFixed(2);
  const logistics = (product.price * 0.2).toFixed(2);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {purchased && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center gap-4 text-emerald-800"
          >
            <CheckCircle2 className="text-emerald-600" size={32} />
            <div>
              <p className="font-bold text-lg">Order Placed Successfully!</p>
              <p>Thank you for supporting local artisans. You can view your order in your profile.</p>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Images & Video */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[40px] overflow-hidden shadow-2xl"
            >
              <img src={product.image} className="w-full aspect-square object-cover" alt={product.name} />
            </motion.div>
            
            <div className="bg-stone-50 rounded-3xl p-8">
              <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                <Info size={20} className="text-emerald-600" /> Artisan Story: {product.artisanName}
              </h3>
              <p className="text-stone-600 mb-6 leading-relaxed italic">
                "{product.artisanBio}"
              </p>
              
              {product.videoUrl ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-stone-200 shadow-lg">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={product.videoUrl} 
                    title="Artisan Story"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-stone-100 flex items-center justify-center border border-dashed border-stone-300">
                  <p className="text-stone-400 italic">Video story coming soon...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold">
                  Sustainability: {product.sustainabilityScore}/100
                </span>
                <span className="text-stone-400 text-sm font-medium uppercase tracking-widest">{product.category}</span>
              </div>
              <h1 className="text-5xl font-serif font-bold text-stone-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-2 text-stone-600 mb-6">
                <MapPin size={18} />
                <span className="font-medium">{product.location}</span>
              </div>
              <p className="text-lg text-stone-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center justify-between p-8 bg-stone-50 rounded-3xl border border-stone-100">
              <div>
                <p className="text-sm text-stone-500 font-medium mb-1">Price</p>
                <p className="text-4xl font-serif font-bold text-stone-900">₹{product.price}</p>
              </div>
              <button 
                onClick={handlePurchase}
                disabled={purchasing || purchased}
                className={`px-10 py-4 rounded-full font-bold transition-all ${
                  purchased 
                    ? 'bg-emerald-600 text-white cursor-default' 
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                } disabled:opacity-70`}
              >
                {purchasing ? 'Processing...' : purchased ? 'Purchased' : 'Purchase Now'}
              </button>
            </div>

            {/* Traceability Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm flex items-center gap-4">
                <Package className="text-emerald-600" />
                <div>
                  <p className="text-xs text-stone-400 font-bold uppercase">Material</p>
                  <p className="text-sm font-bold text-stone-900">{product.rawMaterialSource}</p>
                </div>
              </div>
              <div className="p-6 bg-white border border-stone-100 rounded-3xl shadow-sm flex items-center gap-4">
                <Clock className="text-amber-600" />
                <div>
                  <p className="text-xs text-stone-400 font-bold uppercase">Time Taken</p>
                  <p className="text-sm font-bold text-stone-900">{product.timeToCreate}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-8 bg-emerald-50/50 rounded-3xl border border-emerald-100">
              <h3 className="text-lg font-bold text-stone-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-emerald-600" /> Transparent Price Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Artisan Share (70%)</span>
                  <span className="font-bold text-stone-900">₹{artisanShare}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Platform Fee (10%)</span>
                  <span className="font-bold text-stone-900">₹{platformFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">Logistics (20%)</span>
                  <span className="font-bold text-stone-900">₹{logistics}</span>
                </div>
                <div className="pt-4 border-t border-emerald-200 flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>₹{product.price}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-8 p-8 bg-white border border-stone-100 rounded-3xl shadow-sm">
              <img src={product.qrCode} className="w-24 h-24" alt="QR Traceability" />
              <div>
                <h4 className="font-bold text-stone-900 mb-1">Product Traceability</h4>
                <p className="text-sm text-stone-500">Scan this QR code to verify the authenticity and journey of this product.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

