import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, setCartOpen } = useCart();
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-white p-1 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
            <img src="/logo.png" alt="Sathya Traders - Authentic Appalam in Madurai" width="40" height="40" className="h-10 w-10 object-contain" />
          </div>
          <span className="text-2xl font-heading font-bold text-primary tracking-wide hidden sm:block">
            Sathya Traders
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-secondary hover:text-primary transition-colors font-medium">Home</Link>
          <Link to="/shop" className="text-secondary hover:text-primary transition-colors font-medium">Shop</Link>
          <Link to="/contact" className="text-secondary hover:text-primary transition-colors font-medium">Contact</Link>
          <Link to="/appalam-in-madurai" className="text-secondary hover:text-primary transition-colors font-medium">About Madurai Appalam</Link>
          <div className="flex items-center space-x-4">
            <button 
              className="text-secondary hover:text-primary transition-colors relative cursor-pointer"
              onClick={() => setCartOpen(true)}
              aria-label="Open Shopping Cart"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>}
            </button>
            {currentUser ? (
               <div className="flex items-center space-x-4">
                 {isAdmin && (
                   <button 
                     onClick={() => navigate('/admin')} 
                     className="bg-secondary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-2 cursor-pointer"
                   >
                     <LayoutDashboard size={14} /> Owner Dashboard
                   </button>
                 )}
                  <button onClick={() => navigate('/profile')} className="flex items-center bg-gray-100 rounded-full pl-1 pr-4 py-1 gap-2 border border-gray-200 hover:border-primary transition-all active:scale-95 cursor-pointer">
                    <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                       {(currentUser.displayName || currentUser.email || 'U').charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-secondary truncate max-w-[100px]">
                        {currentUser.displayName || currentUser.email.split('@')[0]}
                      </span>
                  </button>
                  <button onClick={logout} title="Logout" className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    <LogOut size={20} />
                  </button>
               </div>
            ) : (
               <button onClick={() => navigate('/login')} className="text-secondary hover:text-primary transition-colors cursor-pointer" aria-label="Login">
                 <User size={24} />
               </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-secondary cursor-pointer" aria-label="Toggle Menu">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <div className="px-4 py-4 flex flex-col space-y-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-primary font-medium">Home</Link>
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-primary font-medium">Shop</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-primary font-medium">Contact</Link>
              <Link to="/appalam-in-madurai" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary hover:text-primary font-medium">About Madurai Appalam</Link>
              <div className="h-px bg-white/20 my-2"></div>
              <div className="flex items-center justify-between" onClick={() => { setCartOpen(true); setIsMobileMenuOpen(false); }}>
                <span className="text-secondary font-medium">Cart</span>
                <div className="flex items-center text-primary cursor-pointer">
                  <ShoppingCart size={20} className="mr-2"/> ({cartCount})
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary font-medium">Account</span>
                <div className="flex items-center gap-4">
                   <button onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }} className="text-primary font-bold text-sm">Profile</button>
                   <User size={20} className="text-secondary"/>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
