import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Package, ChevronDown, ChevronUp, MapPin, 
  Clock, CheckCircle2, Truck, AlertCircle, RotateCcw, 
  ArrowRight, Loader2, List
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rtdb } from '../firebase/config';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import SEO from '../components/SEO';

const STATUS_CONFIG = {
  'Pending': { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock, step: 1 },
  'Processing': { color: 'text-blue-600', bg: 'bg-blue-100', icon: List, step: 2 },
  'Shipped': { color: 'text-orange-600', bg: 'bg-orange-100', icon: Truck, step: 3 },
  'Delivered': { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2, step: 4 },
  'Cancelled': { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle, step: 0 }
};

export default function Orders() {
  const { currentUser, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser) {
      const ordersRef = query(ref(rtdb, 'orders'), orderByChild('userId'), equalTo(currentUser.uid));
      
      const unsubscribe = onValue(ordersRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = Object.entries(snapshot.val()).map(([id, val]) => ({
            ...val,
            _id: id
          })).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          setOrders(data);
        } else {
          setOrders([]);
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Order Fetch Error:", error);
        toast.error("Failed to load orders");
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser, authLoading, navigate]);

  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-bg pt-20">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-secondary font-bold tracking-widest uppercase text-sm animate-pulse">Fetching your history...</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-bg min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <SEO title="My Orders | Sathya Traders" noindex={true} />
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-secondary">My Orders</h1>
            <p className="text-gray-500 mt-2">Track and manage your recent purchases</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 hidden md:block">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Total Orders:</span>
            <span className="text-xl font-bold text-primary">{orders.length}</span>
          </div>
        </header>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-16 text-center shadow-xl border border-gray-100"
          >
            <div className="bg-gray-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={60} className="text-gray-200" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-secondary mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">It looks like you haven't placed any orders. Start your journey with our premium homemade Appalams!</p>
            <button 
              onClick={() => navigate('/shop')}
              className="bg-primary hover:bg-black text-white px-10 py-5 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 mx-auto"
            >
              Start Shopping <ArrowRight size={20} />
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <OrderCard 
                key={order._id} 
                order={order} 
                isExpanded={expandedOrders[order._id]}
                onToggle={() => toggleExpand(order._id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, isExpanded, onToggle, index }) {
  const status = order.status || 'Pending';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Pending'];
  const StatusIcon = config.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all ${isExpanded ? 'ring-4 ring-primary/5 shadow-xl' : 'hover:shadow-lg'}`}
    >
      {/* Summary Header */}
      <div 
        onClick={onToggle}
        className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner shrink-0">
             {order.cartItems?.[0]?.image || order.cartItems?.[0]?.image1 ? (
               <img src={order.cartItems[0].image || order.cartItems[0].image1} alt="" className="w-full h-full object-cover" />
             ) : (
               <Package className="text-gray-300" size={32} />
             )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
              <p className="font-mono text-xs font-bold text-secondary">#{order.orderId || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <h3 className="text-xl font-bold text-secondary">₹{order.totalAmount}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
              <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${config.bg} ${config.color} shrink-0`}>
            <StatusIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
          </div>
          <button className="ml-auto md:ml-0 bg-gray-50 p-3 rounded-xl text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-50 overflow-hidden"
          >
            <div className="p-8 space-y-10">
              
              {/* Product List */}
              <div>
                <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                  <List size={16} className="text-primary" /> Order Items
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(order.cartItems || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shadow-sm shrink-0">
                        {item.image ? (
                           <img src={item.image || item.image1} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                           <Package size={24} className="m-auto text-gray-200 mt-5" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-bold text-secondary text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-bold text-primary text-sm whitespace-nowrap">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Timeline & Info Container */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-gray-50">
                
                {/* Status Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">Delivery Progress</h4>
                  <div className="relative flex justify-between">
                    {/* Background Progress Bar */}
                    <div className="absolute top-4 left-0 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                    <div 
                      className="absolute top-4 left-0 h-1 bg-green-500 rounded-full z-0 transition-all duration-1000" 
                      style={{ width: status === 'Cancelled' ? '0%' : `${((config.step - 1) / 3) * 100}%` }}
                    ></div>

                    {/* Timeline Steps */}
                    {['Pending', 'Processing', 'Shipped', 'Delivered'].map((s, i) => {
                      const stepConfig = STATUS_CONFIG[s];
                      const isActive = config.step >= stepConfig.step && status !== 'Cancelled';
                      const isCurrent = status === s;
                      const Icon = stepConfig.icon;
                      
                      return (
                        <div key={s} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${isActive ? 'bg-green-500 text-white scale-110' : 'bg-white text-gray-300 border-2 border-gray-100'} ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                            <Icon size={18} />
                          </div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{s}</p>
                        </div>
                      );
                    })}
                  </div>
                  {status === 'Cancelled' && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-red-700">
                      <AlertCircle size={20} />
                      <p className="text-xs font-bold ring-red-100">This order has been cancelled.</p>
                    </div>
                  )}
                </div>

                {/* Shipping & Payment Info */}
                <div className="space-y-6">
                   <div>
                     <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <MapPin size={12} /> Shipping To
                     </h4>
                     <p className="text-sm font-bold text-secondary">{order.userName}</p>
                     <p className="text-xs text-gray-500 leading-relaxed mt-1">
                       {order.shippingAddress ? (
                         <>
                           {order.shippingAddress.street}, {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
                           {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                         </>
                       ) : (
                         'Address info missing'
                       )}
                     </p>
                   </div>
                   <div className="pt-4 border-t border-dotted border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Info</span>
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">{order.paymentStatus || 'Paid'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Method:</span>
                        <span className="font-bold text-secondary uppercase">{order.paymentMethod}</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => {
                      toast.success("Re-adding items to cart...");
                      // Reorder logic could go here
                    }}
                    className="w-full py-4 rounded-xl bg-secondary text-white font-bold text-sm hover:translate-y-[-2px] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                     <RotateCcw size={16} /> Reorder Now
                   </button>
                </div>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
