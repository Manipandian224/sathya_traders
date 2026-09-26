import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ALL_PRODUCTS, CATEGORIES } from '../data/products';
import SEO from '../components/SEO';

const shopBreadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://sathyatraders.in/'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Shop',
      'item': 'https://sathyatraders.in/shop'
    }
  ]
};

export default function Shop() {
  const [filter, setFilter] = useState('All');
  
  const filteredProducts = filter === 'All' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="bg-neutral-bg min-h-screen py-16">
      <SEO
        title="Buy Appalam Online | New Star Appalam | Sathya Traders"
        description="Explore New Star Appalam products from Sathya Traders. View available appalam sizes, prices and product details."
        canonical="https://sathyatraders.in/shop"
        keywords="Buy Appalam Online, New Star Appalam, Sathya Traders Shop, Appalam Madurai, Appalam sizes"
        ogType="website"
        ogImage="/images/appalam-packaging.jpg"
        schema={shopBreadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters focused on Shop experience */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-secondary mb-4 tracking-tight">
              Shop New Star Appalam
            </h1>
            <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
              Explore authentic New Star Appalam products from Sathya Traders. Prepared in Madurai with pure ingredients and traditional craftsmanship, available in Small (2.5), Medium (3.5), and Large (4.5) sizes for retail and bulk delivery.
            </p>
          </div>
          <div className="mt-10 md:mt-0 flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-2xl font-bold transition-all ${filter === cat ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white text-gray-400 hover:text-secondary border border-gray-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - centered, responsive 3-2-1 */}
        <motion.div 
          layout 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-content-center justify-items-center"
        >
          {filteredProducts.map(product => (
            <div key={product.id} className="w-full max-w-[400px]">
              <ProductCard product={product} />
            </div>
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
