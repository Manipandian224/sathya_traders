import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { rtdb } from '../firebase/config';
import { ref, push, serverTimestamp } from 'firebase/database';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await push(ref(rtdb, 'contacts'), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });

      // Send Email Notification
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
            time: new Date().toLocaleString(),
            to_name: "Sathya Traders Owner"
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
        const errorMsg = emailError?.text || emailError?.message || "Unknown error";
        toast(`Message saved, but email notification failed: ${errorMsg}`, {
          icon: '📧',
          duration: 6000
        });
      }

      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-bg min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-heading font-bold text-secondary mb-4"
          >
            Get In Touch
          </motion.h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Have questions about our authentic appalams or want to place a bulk order? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-1">Call Us</h3>
                <p className="text-gray-600">+91 96597 98598</p>
                <p className="text-gray-400 text-sm">Mon - Sat, 9am - 6pm</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-1">Email Us</h3>
                <p className="text-gray-600">Sathyasaravanan0183@gmail.com</p>
                <p className="text-gray-400 text-sm">We'll respond within 24 hours</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start space-x-6">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-secondary mb-1">Visit Us</h3>
                <p className="text-gray-600 mb-3">V4XR+6RR, Madurai, Tamil Nadu 625009,<br /> India</p>
                <a 
                  href="https://maps.app.goo.gl/szFDneifrcyNrMiTA" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center text-primary font-bold text-sm hover:underline border border-primary/20 px-4 py-2 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  Get Directions →
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Section (Right Column) */}
          <div className="h-full">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-secondary ml-1">Phone Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary ml-1">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="john@example.com"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary ml-1">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="How can we help?"
                  className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-secondary ml-1">Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Your message here..."
                  className="w-full p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
  );
}
