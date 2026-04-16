import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group cursor-pointer"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-6">
        <motion.img 
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          src={product.image || 'https://via.placeholder.com/400?text=Sathya+Traders'} 
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply drop-shadow-lg"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-tertiary text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            New
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col items-center text-center flex-grow">
        <div className="text-xs text-primary font-bold tracking-wider uppercase mb-1">{product.category}</div>
        <h3 className="font-heading font-bold text-xl text-secondary mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        <div className="flex flex-col items-center gap-4 mt-auto w-full">
          <span className="text-2xl font-bold text-secondary">₹{product.price}</span>
          <button 
            className="bg-primary hover:bg-primary-dark text-white py-3 px-8 rounded-xl transition-all shadow-sm cursor-pointer hover:shadow-md active:scale-95 group flex items-center justify-center gap-2 w-full sm:w-auto"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag size={20} className="group-hover:animate-bounce" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
