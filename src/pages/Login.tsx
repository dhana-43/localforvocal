import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      login(data.token, data.user);
      navigate(data.user.role === 'artisan' ? '/dashboard' : '/');
    } else {
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
        <h2 className="text-4xl font-serif font-bold text-stone-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-stone-500 text-center mb-10">Sign in to support local artisans</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 rounded-2xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all shadow-lg">
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-stone-500">
          Don't have an account? <Link to="/signup" className="text-emerald-600 font-bold">Join the community</Link>
        </p>
      </motion.div>
    </div>
  );
}
