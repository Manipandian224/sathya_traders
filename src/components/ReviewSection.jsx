import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Calendar, CheckCircle, Send, Loader2, ChevronDown, Filter } from 'lucide-react';
import { rtdb } from '../firebase/config';
import { ref, push, get, set, query, orderByChild, equalTo, serverTimestamp, update } from 'firebase/database';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, highest
  const { currentUser } = useAuth();

  const fetchReviews = async () => {
    try {
      // Fetch reviews for this product
      // Note: In a production app, we might store reviews under reviews/productId to make this simpler
      const q = query(ref(rtdb, 'reviews'), orderByChild('productId'), equalTo(productId));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, val]) => ({
          ...val,
          _id: id
        }));
        setReviews(data);
        
        // Check if current user has already reviewed
        if (currentUser) {
          const userReview = data.find(r => r.userId === currentUser.uid);
          setAlreadyReviewed(!!userReview);
        }
      } else {
        setReviews([]);
        setAlreadyReviewed(false);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchase = async () => {
    if (!currentUser) {
      setCanReview(false);
      return;
    }
    try {
      const q = query(ref(rtdb, 'orders'), orderByChild('userId'), equalTo(currentUser.uid));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const myOrders = Object.values(snapshot.val());
        const hasPurchased = myOrders.some(order => 
          order.status === 'Delivered' &&
          (order.cartItems || []).some(item => item.id === productId)
        );
        setCanReview(hasPurchased);
      }
    } catch (error) {
      console.error("Failed to check purchase status");
    }
  };

  useEffect(() => {
    fetchReviews();
    checkPurchase();
  }, [productId, currentUser]);

  const sortedReviews = useMemo(() => {
    const list = [...reviews];
    if (sortBy === 'newest') {
      return list.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === 'highest') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [reviews, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (alreadyReviewed) {
      toast.error("You have already reviewed this product");
      return;
    }
    
    setSubmitting(true);
    try {
      const newReviewRef = push(ref(rtdb, 'reviews'));
      const reviewData = {
        productId,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        rating,
        title,
        description,
        verifiedPurchase: true,
        createdAt: Date.now()
      };

      // 1. Save the review
      await set(newReviewRef, reviewData);

      // 2. Recalculate Average Rating for this product
      const allReviews = [...reviews, reviewData];
      const totalRatings = allReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const avgRating = parseFloat((totalRatings / allReviews.length).toFixed(1));

      // 3. Update the products node as requested
      await update(ref(rtdb, `products/${productId}`), {
        averageRating: avgRating,
        totalReviews: allReviews.length
      });

      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      setTitle('');
      setDescription('');
      fetchReviews();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRatingForDisplay = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-24 border-t border-gray-100 pt-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
            Community Feedback
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary">Customer Experience</h2>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
               <span className="text-5xl font-bold text-secondary">{averageRatingForDisplay}</span>
               <div className="flex text-yellow-400 mt-1">
                 {[1, 2, 3, 4, 5].map((s) => (
                   <Star key={s} size={18} fill={s <= Math.round(averageRatingForDisplay) ? "currentColor" : "none"} />
                 ))}
               </div>
            </div>
            <div className="h-12 w-px bg-gray-100 mx-2"></div>
            <div className="flex flex-col justify-center">
               <span className="text-gray-500 font-medium">{reviews.length} total reviews</span>
               <p className="text-xs text-gray-400 mt-1">Most customers recommend this product</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-10 py-3 text-sm font-bold text-secondary outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer transition-all"
            >
              <option value="newest">Latest Reviews</option>
              <option value="highest">Highest Rated</option>
            </select>
            <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {canReview && !alreadyReviewed && !showReviewForm && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all active:scale-95 flex items-center gap-2"
            >
              <MessageSquare size={18} /> Write a Review
            </button>
          )}

          {alreadyReviewed && (
            <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 font-bold flex items-center gap-2">
               <CheckCircle size={16} className="text-green-500" />
               You have already reviewed this product
            </div>
          )}
          
          {!canReview && !alreadyReviewed && currentUser && (
            <div className="bg-gray-50 px-6 py-3 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 font-medium flex items-center gap-2 max-w-[280px]">
              <MessageSquare size={14} />
              Verified purchase required to leave a review.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-primary/10 mb-20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="flex flex-col items-center">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Tap to Rate</p>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <motion.button
                      key={s}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="text-yellow-400 transition-colors"
                    >
                      <Star 
                        size={48} 
                        fill={(hoverRating || rating) >= s ? "currentColor" : "none"} 
                        strokeWidth={1.5}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="mt-4 font-bold text-secondary">
                  {['Terrible', 'Bad', 'Okay', 'Good', 'Amazing'][rating-1]}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-4">Title</label>
                  <input 
                    required 
                    placeholder="E.g. Authentic Taste, must try!" 
                    className="w-full p-5 rounded-[1.5rem] bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-4">Detailed Experience</label>
                  <textarea 
                    required 
                    rows="4" 
                    placeholder="What did you like the most? How was the crispiness?" 
                    className="w-full p-5 rounded-[1.5rem] bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 outline-none transition-all resize-none"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-grow bg-secondary text-white font-extrabold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Experience</>}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="sm:px-10 py-5 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-gray-400 font-medium">Fetching community thoughts...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedReviews.map((review, idx) => (
            <motion.div 
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/10 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-secondary/5 rounded-2xl flex items-center justify-center text-secondary font-bold text-xl border border-secondary/5 group-hover:bg-primary transition-colors group-hover:text-white">
                      {review.userName.charAt(0)}
                   </div>
                   <div>
                      <h4 className="font-extrabold text-secondary tracking-tight">{review.userName}</h4>
                      <div className="flex items-center gap-3 mt-1.5">
                         {review.verifiedPurchase && (
                           <span className="text-[9px] bg-green-50 text-green-600 font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 border border-green-100 uppercase tracking-tighter">
                             <CheckCircle size={10} /> Verified Purchase
                           </span>
                         )}
                         <span className="text-gray-300 text-[10px] font-medium flex items-center gap-1">
                           <Calendar size={10} /> {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </span>
                      </div>
                   </div>
                </div>
                <div className="flex text-yellow-400 bg-yellow-400/5 px-3 py-1.5 rounded-xl border border-yellow-400/10">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h5 className="font-extrabold text-secondary text-lg leading-tight">{review.title}</h5>
                <p className="text-gray-500 text-sm leading-relaxed italic">"{review.description}"</p>
              </div>
            </motion.div>
          ))}

          {reviews.length === 0 && (
            <div className="md:col-span-2 text-center py-24 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                 <MessageSquare className="text-gray-200" size={40} />
               </div>
               <h3 className="text-3xl font-heading font-bold text-secondary mb-2">Voice of Customers</h3>
               <p className="text-gray-400 max-w-xs mx-auto">This product hasn't been reviewed yet. Be the first to share your kitchen story!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
