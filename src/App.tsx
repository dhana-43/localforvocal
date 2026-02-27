import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import ArtisanProfile from './pages/ArtisanProfile';
import ArtisanList from './pages/ArtisanList';
import Scanner from './pages/Scanner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans text-stone-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/artisans" element={<ArtisanList />} />
              <Route path="/artisan/:id" element={<ArtisanProfile />} />
              <Route path="/scan" element={<Scanner />} />
            </Routes>
          </main>
          <footer className="bg-stone-900 text-stone-400 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-2">
                  <h3 className="text-2xl font-serif font-bold text-white mb-6">LocalVocal</h3>
                  <p className="max-w-md leading-relaxed">
                    Connecting the world to the timeless craftsmanship of Visakhapatnam. 
                    We believe in fair trade, transparent pricing, and preserving our cultural heritage.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-6">Quick Links</h4>
                  <ul className="space-y-4">
                    <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
                    <li><Link to="/artisans" className="hover:text-white transition-colors">Meet Artisans</Link></li>
                    <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-6">Contact</h4>
                  <ul className="space-y-4">
                    <li>support@vizagvocal.com</li>
                    <li>Visakhapatnam, AP, India</li>
                  </ul>
                </div>
              </div>
              <div className="pt-8 border-t border-stone-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <p>© 2026 LocalVocal. All rights reserved.</p>
                <div className="flex gap-8">
                  <a href="#" className="hover:text-white transition-colors">Instagram</a>
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  <a href="#" className="hover:text-white transition-colors">Facebook</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
