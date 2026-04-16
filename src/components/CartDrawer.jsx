import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-white z-[70] shadow-2xl flex flex-col pt-safe"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-heading font-bold text-secondary flex items-center">
                <ShoppingBag className="mr-2" /> Your Cart
              </h2>
              <button 
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <ShoppingBag size={64} opacity={0.2} />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="text-primary hover:underline hover:text-primary-dark transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div layout key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 relative group">
                       <button 
                          onClick={() => removeFromCart(item.id)}
                          className="absolute -top-2 -right-2 bg-white border border-gray-200 text-red-500 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                          <X size={14} />
                       </button>
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mix-blend-multiply" />
                      <div className="flex flex-col flex-grow justify-between">
                        <div>
                          <h4 className="font-bold text-secondary text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-primary font-bold">₹{item.price}</p>
                        </div>
                        <div className="flex items-center justify-between w-full">
                           <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-gray-50 rounded-l-lg text-gray-600">
                                <Minus size={16} />
                              </button>
                              <span className="w-12 text-center text-sm font-medium">{item.quantity} kg</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-gray-50 rounded-r-lg text-gray-600">
                                <Plus size={16} />
                              </button>
                           </div>
                           <p className="font-bold text-secondary text-sm">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 pb-safe">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-secondary">₹{cartTotal}</span>
                </div>
                <button 
                  onClick={() => {
                    setCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 flex justify-center items-center"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
