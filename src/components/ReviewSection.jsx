import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, User, Calendar, CheckCircle, Send, Loader2 } from 'lucide-react';
import { rtdb, auth } from '../firebase/config';
import { ref, push, get, set, query, orderByChild, equalTo, serverTimestamp } from 'firebase/database';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const fetchReviews = async () => {
    try {
      const q = query(ref(rtdb, 'reviews'), orderByChild('productId'), equalTo(productId));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, val]) => ({
          ...val,
          _id: id
        }));
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPurchase = async () => {
    if (!currentUser) return;
    try {
      const q = query(ref(rtdb, 'orders'), orderByChild('userId'), equalTo(currentUser.uid));
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const myOrders = Object.values(snapshot.val());
        const hasPurchased = myOrders.some(order => 
          order.status === 'Delivered' &&
          order.products.some(p => p.productId === productId)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const reviewRef = push(ref(rtdb, 'reviews'));
      await set(reviewRef, {
        productId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Guest',
        rating,
        title,
        description,
        verifiedPurchase: true,
        createdAt: serverTimestamp()
      });
      toast.success("Review submitted!");
      setShowReviewForm(false);
      setTitle('');
      setDescription('');
      fetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="mt-20 border-t border-gray-100 pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-heading font-bold text-secondary mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill={s <= Math.round(averageRating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-xl font-bold text-secondary">{averageRating}</span>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>
        
        {canReview && !showReviewForm && (
          <button 
            onClick={() => setShowReviewForm(true)}
            className="bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            Write a Review
          </button>
        )}
        
        {!canReview && currentUser && (
          <div className="bg-gray-50 px-6 py-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-500 flex items-center gap-2">
            <MessageSquare size={16} />
            You can review this product after your order is delivered.
          </div>
        )}
      </div>

      {showReviewForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-8 rounded-3xl border border-gray-100 mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <label className="text-lg font-bold text-secondary mb-2">Your Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                    className="text-yellow-400 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star 
                      size={40} 
                      fill={(hoverRating || rating) >= s ? "currentColor" : "none"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <input 
                required 
                placeholder="Review Title (e.g. Authentic Taste!)" 
                className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-primary outline-none transition-all shadow-sm"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea 
                required 
                rows="4" 
                placeholder="Share your detailed experience with our products..." 
                className="w-full p-4 rounded-2xl bg-white border border-transparent focus:border-primary outline-none transition-all shadow-sm resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Submit Review</>}
              </button>
              <button 
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-8 py-4 rounded-2xl bg-white border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <motion.div 
              key={review._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {review.userName.charAt(0)}
                   </div>
                   <div>
                      <h4 className="font-bold text-secondary">{review.userName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                         {review.verifiedPurchase && (
                           <span className="text-[10px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-green-100">
                             <CheckCircle size={10} /> Verified Purchase
                           </span>
                         )}
                         <span className="text-gray-400 text-[10px] flex items-center gap-1">
                           <Calendar size={10} /> {new Date(review.createdAt).toLocaleDateString()}
                         </span>
                      </div>
                   </div>
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>
              <h5 className="font-bold text-secondary mb-2">{review.title}</h5>
              <p className="text-gray-600 text-sm leading-relaxed italic">"{review.description}"</p>
            </motion.div>
          ))}

          {reviews.length === 0 && (
            <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-100">
               <MessageSquare className="mx-auto text-gray-300 mb-4" size={50} />
               <h3 className="text-2xl font-bold text-secondary">No reviews yet</h3>
               <p className="text-gray-400">Be the first to share your experience!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
