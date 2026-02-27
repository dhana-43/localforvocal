import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Etikoppaka Toys',
    image_url: 'https://picsum.photos/seed/new/600/400',
    raw_material_source: '',
    time_to_create: ''
  });

  useEffect(() => {
    fetch('/api/artisan/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, [token]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newProduct)
    });
    if (res.ok) {
      alert('Product added successfully!');
      setShowAddForm(false);
    }
  };

  if (!stats) return <div className="p-12 text-center">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-stone-900">Artisan Dashboard</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all"
          >
            <Plus size={20} /> Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <DollarSign size={24} />
            </div>
            <p className="text-stone-500 font-medium">Total Earnings</p>
            <p className="text-3xl font-serif font-bold text-stone-900">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingCart size={24} />
            </div>
            <p className="text-stone-500 font-medium">Total Orders</p>
            <p className="text-3xl font-serif font-bold text-stone-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp size={24} />
            </div>
            <p className="text-stone-500 font-medium">Growth</p>
            <p className="text-3xl font-serif font-bold text-stone-900">+12%</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-stone-100 mb-12">
          <h3 className="text-xl font-bold text-stone-900 mb-8">Monthly Sales Performance</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#78716c' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-3xl font-serif font-bold mb-8">List New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newProduct.name}
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                  <textarea 
                    required
                    className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none h-32"
                    value={newProduct.description}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Raw Material Source</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Local Teak Wood"
                      className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newProduct.raw_material_source}
                      onChange={e => setNewProduct({...newProduct, raw_material_source: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 mb-2">Time to Create</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 5 days"
                      className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={newProduct.time_to_create}
                      onChange={e => setNewProduct({...newProduct, time_to_create: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-6">
                  <button type="submit" className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800">
                    Publish Product
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-stone-100 text-stone-600 py-4 rounded-2xl font-bold hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
