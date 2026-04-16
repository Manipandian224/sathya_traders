import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';

const ALL_PRODUCTS = [
  { id: '1', name: 'New Star Appalam (2.5 Small)', price: 160, category: 'Appalam', description: 'Premium homemade New Star Appalam. Size 2.5 (Small). Available in bulk from 1kg up to 100kg.', isNew: true, image: 'https://images.unsplash.com/photo-1596541223130-f472280620ed?auto=format&fit=crop&w=600&q=80' },
  { id: '2', name: 'New Star Appalam (3.5 Medium)', price: 160, category: 'Appalam', description: 'Premium homemade New Star Appalam. Size 3.5 (Medium). Available in bulk from 1kg up to 100kg.', isNew: false, image: 'https://images.unsplash.com/photo-1596541223130-f472280620ed?auto=format&fit=crop&w=600&q=80' },
  { id: '3', name: 'New Star Appalam (4.5 Large)', price: 160, category: 'Appalam', description: 'Premium homemade New Star Appalam. Size 4.5 (Large). Available in bulk from 1kg up to 100kg.', isNew: true, image: 'https://images.unsplash.com/photo-1596541223130-f472280620ed?auto=format&fit=crop&w=600&q=80' },
];

export default function Shop() {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Appalam', 'Snacks', 'Masala'];
  
  const filteredProducts = filter === 'All' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="bg-neutral-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-heading mb-4">Our Shop</h1>
            <p className="text-gray-600">Discover authentic taste, directly from our home to yours.</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-2 overflow-x-auto pb-2">
            <span className="bg-primary text-white shadow-md px-6 py-2 rounded-full font-medium whitespace-nowrap">
              Appalam
            </span>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <h3 className="text-2xl mb-2">No products found</h3>
            <p>Try selecting a different category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
