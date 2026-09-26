import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="bg-neutral-bg min-h-screen py-24 flex items-center justify-center">
      <SEO
        title="404 - Page Not Found | Sathya Traders"
        description="The page you are looking for does not exist."
        noindex={true}
      />
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg mx-auto">
        <span className="text-6xl font-black text-primary mb-4 block">404</span>
        <h1 className="text-3xl font-heading font-bold text-secondary mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sorry, the page you are looking for does not exist or has been moved. Explore our appalam collection or return home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all inline-flex items-center justify-center"
          >
            <Home size={18} className="mr-2" /> Go to Home
          </Link>
          <Link
            to="/shop"
            className="bg-gray-100 hover:bg-gray-200 text-secondary font-bold py-3.5 px-6 rounded-xl transition-all inline-flex items-center justify-center"
          >
            <ShoppingBag size={18} className="mr-2" /> Visit Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
