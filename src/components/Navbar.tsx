import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, Menu, QrCode } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-serif font-bold text-stone-900">Local<span className="text-emerald-600">Vocal</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-stone-600 hover:text-stone-900 transition-colors">Home</Link>
            <Link to="/products" className="text-stone-600 hover:text-stone-900 transition-colors">Explore</Link>
            <Link to="/artisans" className="text-stone-600 hover:text-stone-900 transition-colors">Artisans</Link>
            <Link to="/scan" className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold hover:bg-emerald-100 transition-all">
              <QrCode size={18} /> Scan QR
            </Link>
            {user?.role === 'customer' && (
              <Link to="/orders" className="text-stone-600 hover:text-stone-900 transition-colors">My Orders</Link>
            )}
            {user?.role === 'artisan' && (
              <Link to="/dashboard" className="text-stone-600 hover:text-stone-900 transition-colors">Dashboard</Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-stone-900">Hi, {user.name}</span>
                <button onClick={logout} className="p-2 text-stone-500 hover:text-red-600 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-stone-900 text-white px-6 py-2 rounded-full hover:bg-stone-800 transition-all">
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Menu className="text-stone-900" />
          </div>
        </div>
      </div>
    </nav>
  );
}
