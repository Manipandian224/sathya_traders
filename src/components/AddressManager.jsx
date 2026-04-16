import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Home, Briefcase, Trash2, MapPin } from 'lucide-react';
import { rtdb, auth } from '../firebase/config';
import { ref, push, set, get, remove, serverTimestamp } from 'firebase/database';
import toast from 'react-hot-toast';

export default function AddressManager({ onSelect, selectedId }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', altPhone: '', street: '', landmark: '',
    city: '', district: '', state: '', pincode: '', type: 'Home', isDefault: false
  });

  const fetchAddresses = async () => {
    if (!auth.currentUser) return;
    try {
      const snapshot = await get(ref(rtdb, 'addresses/' + auth.currentUser.uid));
      if (snapshot.exists()) {
        const data = Object.entries(snapshot.val()).map(([id, val]) => ({
          ...val,
          _id: id
        }));
        setAddresses(data);
        if (data.length > 0 && !selectedId) {
          const defaultAddr = data.find(a => a.isDefault) || data[0];
          onSelect(defaultAddr);
        }
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Please login to save address");
      return;
    }
    try {
      const newRef = push(ref(rtdb, 'addresses/' + auth.currentUser.uid));
      await set(newRef, {
        ...formData,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      const newAddress = { ...formData, _id: newRef.key };
      toast.success("Address saved successfully");
      setShowForm(false);
      setFormData({ fullName: '', phone: '', altPhone: '', street: '', landmark: '', city: '', district: '', state: '', pincode: '', type: 'Home', isDefault: false });
      fetchAddresses();
      onSelect(newAddress);
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    try {
      await remove(ref(rtdb, `addresses/${auth.currentUser.uid}/${id}`));
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-secondary">Shipping Address</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="text-primary font-bold flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> Add New Address</>}
        </button>
      </div>

      {showForm ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Full Name" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            <input required placeholder="Phone Number" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input placeholder="Alternate Phone (Optional)" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.altPhone} onChange={e => setFormData({...formData, altPhone: e.target.value})} />
            <input required placeholder="Pincode (6 digits)" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
            <textarea required placeholder="House No, Street, Area" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary md:col-span-2" rows="2" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
            <input placeholder="Landmark (Optional)" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} />
            <input required placeholder="City" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
            <input required placeholder="District" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
            <input required placeholder="State" className="p-3 rounded-lg border outline-none focus:ring-2 focus:ring-primary" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
            
            <div className="flex gap-4 md:col-span-2 mt-2">
              <button 
                type="button" 
                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'Home' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200'}`}
                onClick={() => setFormData({...formData, type: 'Home'})}
              >
                <Home size={18} /> Home
              </button>
              <button 
                type="button" 
                className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${formData.type === 'Work' ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200'}`}
                onClick={() => setFormData({...formData, type: 'Work'})}
              >
                <Briefcase size={18} /> Work
              </button>
            </div>

            <button type="submit" className="md:col-span-2 bg-secondary text-white font-bold py-4 rounded-xl mt-4 hover:bg-black transition-all">
              Save and Deliver Here
            </button>
          </form>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div 
              key={addr._id}
              onClick={() => onSelect(addr)}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedId === addr._id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="bg-gray-100 text-[10px] font-bold uppercase px-2 py-0.5 rounded text-gray-500 flex items-center gap-1">
                  {addr.type === 'Home' ? <Home size={10} /> : <Briefcase size={10} />} {addr.type}
                </span>
                {selectedId === addr._id && <Check className="text-primary" size={20} />}
              </div>
              <h4 className="font-bold text-secondary mb-1">{addr.fullName}</h4>
              <p className="text-gray-500 text-sm line-clamp-2 mb-1">{addr.street}, {addr.landmark && addr.landmark + ','} {addr.city}</p>
              <p className="text-gray-500 text-sm mb-3">{addr.state} - {addr.pincode}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-secondary">{addr.phone}</span>
                <button onClick={(e) => handleDelete(e, addr._id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !loading && (
            <div className="md:col-span-2 py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
               <MapPin className="mx-auto text-gray-300 mb-2" size={40} />
               <p className="text-gray-400">No saved addresses found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
