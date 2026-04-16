import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';

const ALL_PRODUCTS = [
  { id: '1', name: 'New Star Appalam (2.5 Small)', price: 160, category: 'Appalam', description: 'Premium homemade New Star Appalam. Size 2.5 (Small). Pure ingredients and traditional recipe. Available in bulk from 1kg up to 100kg.', isNew: true, image: 'https://images.unsplash.com/photo-1596541223130-f472280620ed?auto=format&fit=crop&w=600&q=80', stock: 1000 },
  { id: '2', name: 'New Star Appalam (3.5 Medium)', price: 160, category: 'Appalam', description: 'Premium homemade New Star Appalam. Size 3.5 (Medium). Pure ingredients and traditional recipe. Available in bulk from 1kg up to 100kg.', isNew: false, image: 'https://images.unsplash.com/photo-1596541223130-f472280620ed?auto=format&fit=crop&w=600&q=80', stock: 1000 },
  { id: '3', name: 'New Star Appalam (4.5 Large)', price: 160, category: 'Appalam', description: 'Premium homemade New Star Appalam. Size 4.5 (Large). Pure ingredients and traditional recipe. Available in bulk from 1kg up to 100kg.', isNew: true, image: 'https://images.unsplash.com/photo-1596541223130-f472280620ed?auto=format&fit=crop&w=600&q=80', stock: 1000 },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [weight, setWeight] = React.useState(1);
  
  // Find product by ID
  const product = ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[0];

  return (
    <div className="bg-neutral-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-primary transition-colors mb-8 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-gray-50 p-12 flex items-center justify-center relative">
               <motion.img 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5 }}
                 src={product.image}
                 className="w-full max-w-md object-cover mix-blend-multiply drop-shadow-xl"
               />
               {product.isNew && (
                  <span className="absolute top-8 left-8 bg-tertiary text-secondary text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    Premium Quality
                  </span>
               )}
            </div>

            {/* Details Section */}
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
               <div className="text-primary font-bold tracking-widest uppercase text-sm mb-2">{product.category}</div>
               <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-4">{product.name}</h1>
               <div className="text-3xl font-bold text-secondary mb-2">₹{product.price * weight}</div>
               <div className="text-sm text-gray-400 mb-6">Price: ₹160 / kg</div>
               
               <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                 {product.description}
               </p>

               <div className="mb-10">
                 <label className="block text-sm font-bold text-secondary mb-4 uppercase tracking-wider">Select Weight (kg)</label>
                 <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={weight} 
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex items-center bg-gray-100 px-6 py-3 rounded-2xl border border-gray-200 min-w-[120px] justify-center">
                       <input 
                          type="number" 
                          min="1" 
                          max="100"
                          value={weight}
                          onChange={(e) => setWeight(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                          className="bg-transparent font-bold text-2xl text-secondary w-14 text-center focus:outline-none"
                       />
                       <span className="font-bold text-secondary ml-1">kg</span>
                    </div>
                 </div>
               </div>

               <div className="space-y-4 mb-10">
                 <div className="flex items-center text-gray-600">
                    <ShieldCheck className="text-green-500 mr-3" />
                    <span>100% Authentic & Homemade</span>
                 </div>
                 <div className="flex items-center text-gray-600">
                    <Truck className="text-primary mr-3" />
                    <span>Free delivery on bulk orders (5kg+)</span>
                 </div>
               </div>

               <button 
                 onClick={() => {
                   addToCart(product, weight);
                   toast.success(`${product.name} (${weight}kg) added to cart!`);
                 }}
                 className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center w-full md:w-auto active:scale-95"
               >
                 <ShoppingBag className="mr-2" /> Add {weight} kg to Cart
               </button>
            </div>
          </div>
        </div>
        
        <ReviewSection productId={product.id} />
      </div>
    </div>
  );
}
