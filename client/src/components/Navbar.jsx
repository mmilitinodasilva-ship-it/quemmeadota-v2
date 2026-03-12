import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../context/FavoriteContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites } = useFavorites();
  const location = useLocation();

  const isActive = (path) => {
    if (path.includes('#')) {
      return location.pathname + location.hash === path;
    }
    return location.pathname === path;
  };

  const navLinks = [
    { name: 'Página Inicial', path: '/' },
    { name: 'Pets', path: '/pets' },
    { name: 'ONGs', path: '/ngos' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 bg-primary flex items-center justify-center rounded-xl text-primary-dark">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xl font-bold text-primary-dark tracking-tight">Quem Me Adota</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`font-medium transition-all hover:scale-105 px-4 py-2 rounded-xl ${
                  isActive(link.path) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-600 hover:text-primary-dark hover:bg-primary-light/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/favorites" className={`p-2 transition-all hover:scale-110 relative rounded-xl ${isActive('/favorites') ? 'bg-red-50 text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
              <Heart className={`w-6 h-6 ${favorites.length > 0 || isActive('/favorites') ? 'text-red-500 fill-current' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link to="/login" className="flex items-center space-x-2 bg-primary-dark text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primary-dark/90 hover:shadow-lg hover:scale-105 transition-all active:scale-95">
              <User className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`block font-medium p-2 rounded-lg ${
                    isActive(link.path) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/favorites" onClick={() => setIsOpen(false)} className={`block font-medium p-2 rounded-lg ${isActive('/favorites') ? 'text-red-500 bg-red-50' : 'text-gray-600'}`}>Favoritos</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block bg-primary-dark text-white text-center py-3 rounded-xl font-semibold">Admin</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
