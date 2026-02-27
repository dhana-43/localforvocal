import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'artisan'>('customer');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    if (res.ok) {
      alert('Account created! Please login.');
      navigate('/login');
    } else {
      const data = await res.json();
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-12 rounded-[48px] shadow-2xl max-w-md w-full border border-stone-100"
      >
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-2 text-center">Join VizagVocal</h2>
        <p className="text-stone-500 text-center mb-10">Start your journey with us</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex p-1 bg-stone-100 rounded-2xl mb-6">
            <button 
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${role === 'customer' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
            >
              Customer
            </button>
            <button 
              type="button"
              onClick={() => setRole('artisan')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${role === 'artisan' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'}`}
            >
              Artisan
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all shadow-lg">
            Create Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-stone-500">
          Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
