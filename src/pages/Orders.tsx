import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Package, Calendar, CheckCircle } from 'lucide-react';

export default function Orders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        });
    }
  }, [token]);

  if (!user) return <div className="p-12 text-center">Please login to view your orders.</div>;
  if (loading) return <div className="p-12 text-center">Loading orders...</div>;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[32px] text-center border border-stone-100 shadow-sm">
            <Package size={48} className="mx-auto text-stone-300 mb-4" />
            <p className="text-stone-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex flex-col md:flex-row gap-6 items-center"
              >
                <img src={order.image_url} className="w-24 h-24 rounded-2xl object-cover" alt={order.product_name} />
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-stone-900 mb-1">{order.product_name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 text-emerald-600 font-medium"><CheckCircle size={14} /> {order.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-serif font-bold text-stone-900">₹{order.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
