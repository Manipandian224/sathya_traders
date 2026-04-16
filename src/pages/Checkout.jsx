import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, CheckCircle, MapPin, Truck, CreditCard, Wallet, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { rtdb, auth, functions } from '../firebase/config';
import { ref, push, set, serverTimestamp } from 'firebase/database';
import { httpsCallable } from 'firebase/functions';
import AddressManager from '../components/AddressManager';
import emailjs from '@emailjs/browser';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error('Please login to continue checkout');
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    setIsProcessing(true);
    const totalAmount = cartTotal > 500 ? cartTotal : cartTotal + 50;

    try {
      if (paymentMethod === 'RAZORPAY') {
        // 1. Call Cloud Function to create Razorpay Order
        const createOrderFn = httpsCallable(functions, 'createRazorpayOrder');
        const { data: orderResponse } = await createOrderFn({ 
          amount: totalAmount,
          receipt: `order_${Date.now()}`
        });

        // 2. Open Razorpay Modal
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderResponse.amount,
          currency: orderResponse.currency,
          name: "Sathya Traders",
          description: "Order Payment",
          order_id: orderResponse.id,
          handler: async function (response) {
            // Payment Success callback
            await saveOrderToDB(response.razorpay_payment_id);
          },
          prefill: {
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            contact: selectedAddress.phone || ''
          },
          theme: { color: "#F97316" }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          toast.error("Payment failed. Please try again.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        // Direct COD or Manual UPI/Bank
        await saveOrderToDB();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process order. Please check if you have upgraded to Firebase Blaze Plan.");
      setIsProcessing(false);
    }
  };

  const saveOrderToDB = async (paymentId = '') => {
    try {
      const orderRef = push(ref(rtdb, 'orders'));
      const orderData = {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Guest',
        products: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: cartTotal > 500 ? cartTotal : cartTotal + 50,
        shippingAddress: selectedAddress,
        paymentMethod: paymentMethod,
        razorpayPaymentId: paymentId,
        status: 'Pending',
        paymentStatus: (paymentMethod === 'COD' || paymentMethod === 'Bank' || paymentMethod === 'UPI') ? 'Pending' : 'Completed',
        createdAt: serverTimestamp()
      };

      await set(orderRef, orderData);
      setOrderId(orderRef.key);

      // Send Order Notification Email
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            from_name: orderData.userName,
            from_email: currentUser?.email || 'N/A',
            subject: `New Order Received - ${orderRef.key}`,
            message: `New order of ₹${orderData.totalAmount} placed by ${orderData.userName}. Payment Method: ${orderData.paymentMethod}`,
            to_name: "Sathya Traders Owner"
          }
        );
      } catch (err) {
        console.error("Order notification email failed:", err);
      }

      clearCart();
      setIsSuccess(true);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Error saving order details.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-neutral-bg px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl text-center max-w-lg w-full border border-gray-100"
        >
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={50} className="text-green-500" />
          </div>
          <h2 className="text-4xl font-heading font-bold text-secondary mb-4">Order Placed!</h2>
          <p className="text-gray-500 mb-2">Order ID: <span className="font-mono font-bold text-secondary">{orderId}</span></p>
          <p className="text-gray-600 mb-10 leading-relaxed">Thank you for your trust. We've received your order and are preparing it for authentic homemade goodness.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/shop')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl transition-all shadow-lg active:scale-95"
            >
              Continue Shopping
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full bg-gray-50 hover:bg-gray-100 text-secondary font-bold py-5 rounded-2xl transition-all active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-neutral-bg">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
            <button onClick={() => navigate('/shop')} className="bg-primary px-8 py-3 rounded-xl text-white font-bold hover:shadow-lg transition-all">Go to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Content */}
          <div className="w-full lg:w-2/3 space-y-8">
            <h1 className="text-4xl font-heading font-bold text-secondary">Checkout</h1>
            
            <AddressManager 
              onSelect={setSelectedAddress} 
              selectedId={selectedAddress?._id} 
            />

             <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                   <CreditCard className="text-primary" />
                   <h3 className="text-xl font-bold text-secondary">Payment Method</h3>
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {[
                      { id: 'RAZORPAY', label: 'Online Pay', icon: CreditCard },
                      { id: 'UPI', label: 'UPI / QR', icon: Wallet },
                      { id: 'Bank', label: 'Bank Transfer', icon: Landmark },
                      { id: 'COD', label: 'Cash on Delivery', icon: Truck }
                    ].map((method) => (
                     <button
                       key={method.id}
                       onClick={() => setPaymentMethod(method.id)}
                       className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-gray-50 bg-white hover:border-gray-100'}`}
                     >
                       <method.icon size={24} className={paymentMethod === method.id ? 'text-primary' : 'text-gray-400'} />
                       <span className={`text-xs font-bold ${paymentMethod === method.id ? 'text-secondary' : 'text-gray-500'}`}>{method.label}</span>
                     </button>
                   ))}
                </div>
                
                {paymentMethod !== 'COD' && (
                  <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100 text-xs text-orange-800">
                    <p className="font-bold mb-1 italic">Payment Instructions:</p>
                    {paymentMethod === 'UPI' ? (
                      <p>Please send the amount to <span className="font-bold">sathyatraders@upi</span> and mention your name in the notes.</p>
                    ) : (
                      <p>Bank: <span className="font-bold">HDFC Bank</span> | A/c: <span className="font-bold">501004562718</span> | IFSC: <span className="font-bold">HDFC0001234</span></p>
                    )}
                  </div>
                )}
             </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
               <div className="flex items-center gap-3 mb-6">
                  <Truck className="text-primary" />
                  <h3 className="text-xl font-bold text-secondary">Delivery Date</h3>
               </div>
               <p className="text-gray-600 text-sm">Estimated delivery by: <span className="font-bold text-secondary">{new Date(Date.now() + 5*24*60*60*1000).toLocaleDateString()}</span></p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 sticky top-32">
                <h3 className="text-2xl font-heading font-bold text-secondary mb-8">Order Summary</h3>
                <div className="space-y-6 mb-8 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                   {cartItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-4">
                            <div className="bg-gray-100 rounded-xl w-10 h-10 flex items-center justify-center text-secondary font-bold">
                               {item.quantity}
                            </div>
                            <div>
                               <p className="font-bold text-secondary line-clamp-1">{item.name}</p>
                               <p className="text-gray-400 text-xs">₹{item.price} per pack</p>
                            </div>
                         </div>
                         <strong className="text-secondary">₹{item.price * item.quantity}</strong>
                      </div>
                   ))}
                </div>
                
                <div className="space-y-4 text-sm mb-8 border-t border-gray-50 pt-8">
                   <div className="flex justify-between text-gray-500">
                     <span>Subtotal</span>
                     <span>₹{cartTotal}</span>
                   </div>
                   <div className="flex justify-between text-gray-500">
                     <span>Delivery Charges</span>
                     <span>{cartTotal > 500 ? <span className="text-green-500 font-bold uppercase text-[10px]">Free</span> : '₹50'}</span>
                   </div>
                </div>
                
                <div className="flex justify-between items-center text-xl mb-10">
                   <strong className="text-secondary font-heading">Total Amount</strong>
                   <strong className="text-primary font-bold text-3xl">₹{cartTotal > 500 ? cartTotal : cartTotal + 50}</strong>
                </div>
                
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isProcessing ? (
                    <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                       Place Order <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </>
                  )}
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-[10px] uppercase tracking-widest">
                   <Lock size={12} /> Secure Checkout
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

