import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import ReviewSection from '../components/ReviewSection';
import { ALL_PRODUCTS } from '../data/products';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [weight, setWeight] = React.useState(1);
  const [dbStats, setDbStats] = React.useState({ averageRating: 0, totalReviews: 0 });
  
  // Find product by ID
  const baseProduct = ALL_PRODUCTS.find(p => p.id === id) || ALL_PRODUCTS[0];
  const product = { ...baseProduct, ...dbStats };

  React.useEffect(() => {
    import('../firebase/config').then(({ rtdb }) => {
      import('firebase/database').then(({ ref, onValue }) => {
        const productRef = ref(rtdb, `products/${id}`);
        const unsub = onValue(productRef, (snapshot) => {
          if (snapshot.exists()) {
            setDbStats(snapshot.val());
          }
        });
        return () => unsub();
      });
    });
  }, [id]);

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
                 src={product.image1}
                 alt={product.name}
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
               <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary">{product.name}</h1>
                  {product.totalReviews > 0 && (
                    <div className="hidden md:flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                      <div className="flex text-yellow-400">
                        {Math.round(product.averageRating)} <Star size={14} fill="currentColor" className="ml-1" />
                      </div>
                      <span className="text-xs font-bold text-secondary">({product.totalReviews})</span>
                    </div>
                  )}
               </div>
               
               <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl font-bold text-secondary">₹{product.price * weight}</div>
                  {product.totalReviews > 0 && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= Math.round(product.averageRating) ? "currentColor" : "none"} />)}
                      </div>
                      <span className="text-gray-400 font-medium">({product.totalReviews} customer reviews)</span>
                    </div>
                  )}
               </div>
               <div className="text-sm text-gray-400 mb-6 font-medium">Standard Price: ₹{product.price} / kg</div>
               
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
