import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Edit2, Save, X, Plus, Trash2, Home, Briefcase, 
  ChevronRight, Package, Loader2, LayoutDashboard, ShoppingBag, Settings, LogOut, ShieldCheck, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rtdb, auth } from '../firebase/config';
import { ref, get, update, push, set, remove, serverTimestamp, query, orderByChild, equalTo } from 'firebase/database';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import SEO from '../components/SEO';

export default function Profile() {
  const { currentUser, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Forms
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', altPhone: '', street: '', landmark: '',
    city: '', district: '', state: '', pincode: '', type: 'Home', isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser, authLoading]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch User Info
      const userSnap = await get(ref(rtdb, `users/${currentUser.uid}`));
      if (userSnap.exists()) {
        setUserData(userSnap.val());
        setProfileForm({ name: userSnap.val().name || '', phone: userSnap.val().phone || '' });
      }

      // 2. Fetch Addresses
      const addrSnap = await get(ref(rtdb, `addresses/${currentUser.uid}`));
      if (addrSnap.exists()) {
        const addrData = Object.entries(addrSnap.val()).map(([id, val]) => ({ ...val, _id: id }));
        setAddresses(addrData);
      } else {
        setAddresses([]);
      }

      // 3. Fetch Orders
      const ordersRef = query(ref(rtdb, 'orders'), orderByChild('userId'), equalTo(currentUser.uid));
      const orderSnap = await get(ordersRef);
      if (orderSnap.exists()) {
        const ordersArray = Object.entries(orderSnap.val()).map(([id, val]) => ({
          ...val,
          orderId: id
        })).reverse(); // newest first
        setOrders(ordersArray);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile(auth.currentUser, { displayName: profileForm.name });
      await update(ref(rtdb, `users/${currentUser.uid}`), { name: profileForm.name, phone: profileForm.phone });
      setUserData(prev => ({ ...prev, name: profileForm.name, phone: profileForm.phone }));
      setIsEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newRef = push(ref(rtdb, `addresses/${currentUser.uid}`));
      await set(newRef, { ...addressForm, userId: currentUser.uid, createdAt: serverTimestamp() });
      toast.success("Address added successfully");
      setShowAddressForm(false);
      setAddressForm({ fullName: '', phone: '', altPhone: '', street: '', landmark: '', city: '', district: '', state: '', pincode: '', type: 'Home', isDefault: false });
      fetchAllData();
    } catch (error) {
      toast.error("Failed to add address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await remove(ref(rtdb, `addresses/${currentUser.uid}/${id}`));
      toast.success("Address deleted");
      setAddresses(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'address', label: 'Address Book', icon: MapPin },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const getStatusColor = (status) => {
    switch((status || '').toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-secondary font-medium tracking-wide animate-pulse">Loading secure profile...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-secondary">{orders.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-secondary/5 rounded-xl flex items-center justify-center">
                  <MapPin className="text-secondary" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Saved Addresses</p>
                  <p className="text-2xl font-bold text-secondary">{addresses.length}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-secondary text-lg">Recent Activity</h3>
                <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold hover:underline">View All</button>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">No recent orders found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => (
                     <div key={order.orderId} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl border ${getStatusColor(order.status)}`}>
                            <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-secondary text-sm">Order #{order.orderId.slice(-6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                         <p className="font-bold text-secondary">₹{order.totalAmount}</p>
                         <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                           {order.status || 'Pending'}
                         </span>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                <User size={24} className="text-primary" /> Personal Information
              </h3>
              {!isEditingProfile && (
                <button onClick={() => setIsEditingProfile(true)} className="text-primary bg-primary/5 hover:bg-primary/10 p-2.5 rounded-xl transition-all">
                  <Edit2 size={18} />
                </button>
              )}
            </div>
            
            <div className="p-6 md:p-8">
              {isEditingProfile ? (
                 <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-2xl">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                     <input required type="text" className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                     <input required type="tel" className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} />
                   </div>
                 </div>
                 <div className="flex gap-4 pt-4 border-t border-gray-100">
                   <button type="button" onClick={() => setIsEditingProfile(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Cancel</button>
                   <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2 text-sm">
                     {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
                   </button>
                 </div>
               </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-2"><User size={12}/> Full Name</p>
                    <p className="text-base font-bold text-secondary truncate">{userData?.name || 'Not Set'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-2"><Mail size={12}/> Email Address</p>
                    <p className="text-base font-bold text-secondary truncate">{currentUser?.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-2"><Phone size={12}/> Phone Number</p>
                    <p className="text-base font-bold text-secondary truncate">{userData?.phone || 'Not Set'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-wider mb-2"><ShieldCheck size={12}/> Account Role</p>
                    <div className="inline-flex items-center px-2 py-1 rounded bg-secondary text-white text-[10px] font-bold uppercase tracking-wider">
                      {userData?.role || 'Customer'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                <MapPin size={24} className="text-primary" /> Address Book
              </h3>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                className={`flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm ${showAddressForm ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-primary text-white hover:bg-black hover:shadow-md hover:-translate-y-0.5'}`}
              >
                {showAddressForm ? <><X size={16} /> Cancel Form</> : <><Plus size={16} /> Add New Address</>}
              </button>
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {showAddressForm ? (
                   <motion.div key="form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200">
                   <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <input required placeholder="Full Name" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} />
                     <input required placeholder="10-digit Mobile Number" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} />
                     <input required placeholder="Pincode (6 digits)" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} />
                     <input placeholder="Landmark (Optional)" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} />
                     <textarea required placeholder="House No, Building Name, Street Area" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium md:col-span-2" rows="2" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} />
                     <input required placeholder="City / Town" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} />
                     <input required placeholder="State" className="p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} />
                     
                     <div className="flex gap-4 md:col-span-2 mt-2">
                       <button type="button" onClick={() => setAddressForm({...addressForm, type: 'Home'})} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold flex justify-center items-center gap-2 transition-all ${addressForm.type === 'Home' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                         <Home size={16} /> Home
                       </button>
                       <button type="button" onClick={() => setAddressForm({...addressForm, type: 'Work'})} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold flex justify-center items-center gap-2 transition-all ${addressForm.type === 'Work' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                         <Briefcase size={16} /> Work
                       </button>
                     </div>
                     <button type="submit" disabled={isSubmitting} className="md:col-span-2 w-full bg-secondary text-white font-bold py-4 rounded-xl mt-2 hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-50">
                       {isSubmitting && <Loader2 size={16} className="animate-spin" />} Save Address details
                     </button>
                   </form>
                 </motion.div>
                ) : (
                  <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                       <div key={addr._id} className="relative p-6 rounded-2xl border border-gray-200 bg-white hover:border-primary/30 hover:shadow-lg transition-all group flex flex-col h-full">
                         <div className="flex justify-between items-start mb-4">
                           <span className="bg-gray-100 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded text-gray-600 flex items-center gap-1.5">
                             {addr.type === 'Home' ? <Home size={12} /> : <Briefcase size={12} />} {addr.type}
                           </span>
                           <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 size={16} />
                           </button>
                         </div>
                         <h4 className="font-bold text-secondary text-lg mb-1">{addr.fullName}</h4>
                         <p className="font-medium text-gray-700 text-sm mb-4">{addr.phone}</p>
                         <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{addr.street}<br/>{addr.city}, {addr.state} - <span className="font-semibold text-secondary">{addr.pincode}</span></p>
                       </div>
                    ))}
                    {addresses.length === 0 && (
                       <div className="lg:col-span-2 py-16 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                         <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                           <MapPin className="text-gray-300" size={32} />
                         </div>
                         <h4 className="text-lg font-bold text-secondary">No saved addresses</h4>
                         <p className="text-gray-400 text-sm mt-2 mb-6">Add a shipping address to speed up your checkout.</p>
                         <button onClick={() => setShowAddressForm(true)} className="text-primary font-bold hover:underline text-sm">Add New Address</button>
                       </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50">
              <h3 className="text-xl font-bold text-secondary flex items-center gap-3">
                <ShoppingBag size={24} className="text-primary" /> Order History
              </h3>
            </div>
            
            <div className="p-6 md:p-8">
              {orders.length === 0 ? (
                <div className="py-16 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                    <Package className="text-gray-300" size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-secondary">No orders yet</h4>
                  <p className="text-gray-400 text-sm mt-2 mb-6">Looks like you haven't placed any orders.</p>
                  <button onClick={() => navigate('/shop')} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg shadow-primary/20 transition-all text-sm">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                     <div key={order.orderId} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-md transition-all">
                       <div className="bg-gray-50/50 p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                            <p className="font-bold text-secondary">#{order.orderId}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                            <p className="font-bold text-secondary">{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total</p>
                            <p className="font-bold text-secondary">₹{order.totalAmount}</p>
                          </div>
                          <div className="sm:text-right">
                             <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                               {order.status || 'Pending'}
                             </div>
                          </div>
                       </div>
                       <div className="p-4 sm:p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                             <p className="font-bold text-sm text-secondary mb-2">Items:</p>
                             <div className="flex flex-wrap gap-2">
                               {(order.products || []).map((prod, idx) => (
                                 <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg border border-gray-200">
                                   {prod.name} x{prod.quantity}
                                 </span>
                               ))}
                             </div>
                          </div>
                          {/* Future Details Button */}
                          <button className="text-primary text-sm font-bold hover:underline whitespace-nowrap">View Invoice</button>
                       </div>
                     </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-neutral-bg min-h-screen pt-24 pb-20">
      <SEO title="My Account | Sathya Traders" noindex={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-secondary">My Account</h1>
          <p className="text-gray-500 mt-1">Manage your profile, orders, and addresses.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            {/* User Mini Profile Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-primary text-white flex items-center justify-center rounded-2xl text-xl font-bold shadow-inner">
                {userData?.name?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 font-medium tracking-wide">Hello,</p>
                <p className="font-bold text-secondary truncate text-lg">{userData?.name || 'User'}</p>
              </div>
            </div>

            {/* Default Sidebar Navigation */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'orders') navigate('/orders');
                      else setActiveTab(item.id);
                    }}
                    className={`flex items-center gap-3 p-4 lg:p-5 transition-all text-sm font-bold min-w-[max-content] lg:min-w-0 border-b border-gray-50 last:border-b-0
                      ${isActive 
                        ? 'bg-primary/5 text-primary border-r-0 lg:border-l-4 lg:border-l-primary' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-secondary lg:border-l-4 lg:border-transparent'
                      }`}
                  >
                    <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400'} />
                    {item.label}
                  </button>
                );
              })}
              <div className="lg:border-t border-gray-100 p-2 lg:p-0">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 p-3 lg:p-5 w-full text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-all min-w-[max-content] lg:min-w-0"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9 w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
