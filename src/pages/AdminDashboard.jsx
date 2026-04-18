import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, ShoppingCart, IndianRupee, Bell, AlertCircle, 
  MessageSquare, Star, Users, LayoutDashboard, ChevronRight, 
  Trash2, CheckCircle, Clock, Truck, Shield, Eye
} from 'lucide-react';
import { rtdb } from '../firebase/config';
import { ref, onValue, update, remove, query, limitToLast } from 'firebase/database';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function AdminDashboard() {
  const { currentUser, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Debugging logs for blank screen troubleshooting
  useEffect(() => {
    console.log("AdminDashboard: Auth State Check", { 
      hasUser: !!currentUser, 
      email: currentUser?.email,
      isAdmin, 
      authLoading 
    });
  }, [currentUser, isAdmin, authLoading]);
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    messages: 0,
    reviews: 0,
    customers: 0
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    console.warn("AdminDashboard: Unauthorized access attempt or auth mismatch. Redirecting to login.");
    return <Navigate to="/login" />;
  }

  const fetchData = () => {
    setLoading(true);
    
    // Using onValue for real-time updates as requested
    const unsubOrders = onValue(ref(rtdb, 'orders'), (snapshot) => {
      const data = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, _id: id })) : [];
      setOrders(data.reverse());
      const revenue = data.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
      setStats(prev => ({ ...prev, revenue, orders: data.length }));
    }, (error) => {
      console.error("Orders Error:", error);
      toast.error("Failed to load orders");
    });

    const unsubContacts = onValue(ref(rtdb, 'contacts'), (snapshot) => {
      const data = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, _id: id })) : [];
      setContacts(data.reverse());
      setStats(prev => ({ ...prev, messages: data.filter(c => c.status === 'unread').length }));
    }, (error) => {
      console.error("Contacts Error:", error);
    });

    const unsubReviews = onValue(ref(rtdb, 'reviews'), (snapshot) => {
      const data = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, _id: id })) : [];
      setReviews(data.reverse());
      setStats(prev => ({ ...prev, reviews: data.length }));
    }, (error) => {
      console.error("Reviews Error:", error);
    });

    const unsubUsers = onValue(ref(rtdb, 'users'), (snapshot) => {
      const data = snapshot.exists() ? Object.entries(snapshot.val()).map(([id, val]) => ({ ...val, _id: id })) : [];
      setUsers(data.reverse());
      setStats(prev => ({ ...prev, customers: data.length }));
      setLoading(false);
    }, (error) => {
      console.error(error);
      toast.error("Permission denied. Check your Firebase rules.");
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubContacts();
      unsubReviews();
      unsubUsers();
    };
  };

  useEffect(() => {
    const unsub = fetchData();
    return unsub;
  }, []);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await update(ref(rtdb, `orders/${orderId}`), { status });
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      await remove(ref(rtdb, `orders/${orderId}`));
      toast.success("Order record deleted");
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleMarkContactRead = async (id) => {
    try {
      await update(ref(rtdb, `contacts/${id}`), { status: 'read' });
      toast.success("Message marked as read");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await remove(ref(rtdb, `reviews/${id}`));
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 px-6 py-4 transition-all ${activeTab === id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
    >
      <Icon size={20} />
      <span className="font-bold">{label}</span>
      {activeTab === id && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <div className="bg-neutral-bg min-h-screen flex">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl min-h-screen sticky top-0 flex flex-col pt-8">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-white">
            <Shield size={24} />
          </div>
          <h2 className="text-2xl font-heading font-bold text-secondary">Admin Panel</h2>
        </div>
        
        <nav className="flex-grow">
          <SidebarItem id="overview" label="Overview" icon={LayoutDashboard} />
          <SidebarItem id="orders" label="Orders" icon={ShoppingCart} />
          <SidebarItem id="contacts" label="Messages" icon={MessageSquare} />
          <SidebarItem id="reviews" label="Reviews" icon={Star} />
          <SidebarItem id="customers" label="Customers" icon={Users} />
        </nav>

        <div className="p-6 border-t border-gray-50">
           <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold uppercase text-sm">
                 {(currentUser.displayName || currentUser.email || 'A').charAt(0)}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-bold text-secondary truncate">{currentUser.displayName || currentUser.email || 'Admin User'}</p>
                 <p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin Access</p>
              </div>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-10">
        <header className="flex justify-between items-center mb-10">
           <div>
              <h1 className="text-4xl font-heading font-bold text-secondary capitalize">{activeTab}</h1>
              <p className="text-gray-500 mt-1">Sathya Appalam Management Dashboard</p>
           </div>
           <div className="flex items-center gap-4">
              <button onClick={fetchData} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
                 <Clock size={20} className="text-gray-600" />
              </button>
              <div className="h-10 w-px bg-gray-100 mx-2"></div>
              <p className="text-sm text-gray-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
           </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10">
             {/* Stats */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Unread Messages', value: stats.messages, icon: MessageSquare, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Total Customers', value: stats.customers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((stat, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center">
                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl mr-4`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-secondary">{stat.value}</h3>
                    </div>
                  </motion.div>
                ))}
             </div>

             {/* Dynamic Section in Overview */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold text-secondary">Latest Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-primary text-sm font-bold hover:underline">View All</button>
                   </div>
                   <div className="space-y-4">
                      {orders.slice(0, 5).map(order => (
                        <div key={order._id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                           <div className="flex items-center gap-4">
                              <div className="bg-white p-2.5 rounded-xl text-primary shadow-sm"><Package size={20} /></div>
                              <div>
                                 <p className="font-bold text-secondary text-sm">₹{order.totalAmount}</p>
                                 <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">{order.status}</p>
                              </div>
                           </div>
                           <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                   <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold text-secondary">New Customers</h3>
                      <button onClick={() => setActiveTab('customers')} className="text-primary text-sm font-bold hover:underline">View All</button>
                   </div>
                   <div className="space-y-4">
                      {users.slice(0, 5).map(user => (
                        <div key={user._id} className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-secondary font-bold shadow-sm">{user.name.charAt(0)}</div>
                              <div>
                                 <p className="font-bold text-secondary text-sm">{user.name}</p>
                                 <p className="text-[10px] text-gray-400">{user.email}</p>
                              </div>
                           </div>
                           <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded truncate max-w-[80px] text-center">User</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-bold text-secondary">Manage Orders</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                      <tr>
                         <th className="px-8 py-5">Order ID</th>
                         <th className="px-8 py-5">Customer</th>
                         <th className="px-8 py-5">Amount</th>
                         <th className="px-8 py-5">Date</th>
                         <th className="px-8 py-5">Payment / ID</th>
                         <th className="px-8 py-5">Status</th>
                         <th className="px-8 py-5">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {orders.map(order => (
                          <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                             <td className="px-8 py-6">
                                <p className="font-mono text-xs font-bold text-secondary">#{order._id.slice(-8).toUpperCase()}</p>
                                <p className="text-[10px] text-primary font-bold">{order.paymentMethod || 'Manual'}</p>
                             </td>
                             <td className="px-8 py-6">
                                <p className="font-bold text-secondary text-sm">{order.userName || order.shippingAddress?.fullName || 'Guest'}</p>
                                <p className="text-[10px] text-gray-500 line-clamp-1">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                             </td>
                             <td className="px-8 py-6 font-bold text-primary">₹{order.totalAmount}</td>
                             <td className="px-8 py-6 text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Pending'}</td>
                             <td className="px-8 py-6">
                                 <p className={`text-xs font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>
                                   {order.paymentStatus || 'Pending'}
                                 </p>
                                 {order.cashfreePaymentId && (
                                   <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {order.cashfreePaymentId}</p>
                                 )}
                             </td>
                             <td className="px-8 py-6">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                   {order.status}
                                </span>
                             </td>
                             <td className="px-8 py-6 flex items-center gap-2">
                                <select 
                                  onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                  value={order.status}
                                  className="text-xs bg-gray-100 border-none rounded-lg p-2 outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                >
                                   <option value="Pending">Pending</option>
                                   <option value="Shipped">Shipped</option>
                                   <option value="Delivered">Delivered</option>
                                   <option value="Cancelled">Cancelled</option>
                                </select>
                                <button 
                                  onClick={() => setSelectedOrderForInvoice(order)}
                                  className="p-2 text-gray-300 hover:text-primary transition-colors"
                                  title="Generate Bill"
                                >
                                  <FileText size={18} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order._id)}
                                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                  title="Delete Order"
                                >
                                  <Trash2 size={18} />
                                </button>
                             </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {contacts.map(contact => (
               <div key={contact._id} className={`bg-white p-8 rounded-[2rem] shadow-sm border transition-all ${contact.status === 'unread' ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100 opacity-80'}`}>
                  <div className="flex justify-between items-start mb-6">
                     <div className="bg-primary/10 p-3 rounded-2xl text-primary"><MessageSquare size={20} /></div>
                     {contact.status === 'unread' && (
                       <button onClick={() => handleMarkContactRead(contact._id)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                          <CheckCircle size={14} /> Mark Read
                       </button>
                     )}
                  </div>
                  <div className="mb-4">
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{contact.subject}</p>
                     <p className="text-lg font-bold text-secondary leading-tight">{contact.message}</p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                     <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-secondary">
                        {contact.name?.charAt(0)}
                     </div>
                     <div>
                        <p className="text-xs font-bold text-secondary">{contact.name}</p>
                        <p className="text-[10px] text-gray-400">{contact.email} • {contact.phone}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {reviews.map(review => (
               <div key={review._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500">
                           <Star size={20} fill="currentColor" />
                        </div>
                        <div>
                           <p className="font-bold text-secondary text-sm">{review.userName || 'Anonymous'}</p>
                           <div className="flex text-yellow-400 scale-75 -ml-2 origin-left">
                              {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />)}
                           </div>
                        </div>
                     </div>
                     <button onClick={() => handleDeleteReview(review._id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                     </button>
                  </div>
                  <h4 className="font-bold text-secondary mb-2">{review.title}</h4>
                  <p className="text-gray-600 text-sm italic flex-grow">"{review.description}"</p>
                  <div className="mt-6 pt-6 border-t border-gray-50 text-[10px] text-gray-400 flex justify-between items-center">
                     <span>Product ID: {review.productId}</span>
                     <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50">
                <h3 className="text-xl font-bold text-secondary">Customer Directory</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                      <tr>
                         <th className="px-8 py-5">Name</th>
                         <th className="px-8 py-5">Email</th>
                         <th className="px-8 py-5">Phone</th>
                         <th className="px-8 py-5">Joined Date</th>
                         <th className="px-8 py-5">Role</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {users.map(user => (
                         <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-6 flex items-center gap-3">
                               <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">{user.name.charAt(0)}</div>
                               <span className="font-bold text-secondary text-sm">{user.name}</span>
                            </td>
                            <td className="px-8 py-6 text-sm text-gray-500">{user.email}</td>
                            <td className="px-8 py-6 text-sm text-secondary font-medium">{user.phone}</td>
                            <td className="px-8 py-6 text-xs text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</td>
                            <td className="px-8 py-6">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-secondary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                  {user.role}
                               </span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        <InvoiceModal 
          isOpen={!!selectedOrderForInvoice} 
          onClose={() => setSelectedOrderForInvoice(null)} 
          order={selectedOrderForInvoice} 
        />
      </div>
    </div>
  );
}
