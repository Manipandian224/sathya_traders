import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Fallback images if not provided
  const img1 = product.image1 || product.image || 'https://via.placeholder.com/400?text=Sathya+Traders';
  const img2 = product.image2 || img1;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-full group cursor-pointer relative"
    >
      {/* Badge Section */}
      {product.isNew && (
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-primary/30">
            NEW
          </span>
        </div>
      )}

      {/* Image Container with Dual Image Logic */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isHovered || !product.image2 ? (
            <motion.img 
              key="image1"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              src={img1} 
              alt={product.name}
              className="w-full h-full object-cover mix-blend-multiply transition-all duration-300"
            />
          ) : (
            <motion.img 
              key="image2"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              src={img2} 
              alt={`${product.name} hover`}
              className="w-full h-full object-cover mix-blend-multiply transition-all duration-300"
            />
          )}
        </AnimatePresence>
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col items-center text-center flex-grow">
        <div className="text-[10px] text-primary font-black tracking-[0.2em] uppercase mb-2">
          {product.category}
        </div>
        
        <h3 className="font-heading font-bold text-xl text-secondary mb-3 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed h-10">
          {product.description}
        </p>

        <div className="mt-auto w-full space-y-5">
          <div className="text-3xl font-black text-secondary">
            ₹{product.price}
          </div>
          
          <button 
            className="bg-primary hover:bg-secondary text-white py-4 px-8 rounded-2xl transition-all shadow-xl shadow-primary/10 cursor-pointer hover:shadow-2xl active:scale-95 group/btn flex items-center justify-center gap-3 w-full font-bold"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag size={20} className="group-hover/btn:rotate-12 transition-transform" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
