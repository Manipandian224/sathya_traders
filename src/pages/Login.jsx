import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn, ShieldCheck, UserPlus, Mail, Lock, User, Phone } from 'lucide-react';

import SEO from '../components/SEO';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const { loginWithGoogle, loginWithEmail, signup } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      const user = await loginWithGoogle();
      if (user) {
        const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || ['admin@sathyatraders.com'];
        if (adminEmails.includes(user.email)) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      // Errors are handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isSignUp) {
        await signup(name, email, phone, password);
        toast.success(`Welcome, ${name}!`);
      } else {
        await loginWithEmail(email, password);
      }
      const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || ['admin@sathyatraders.com'];
      if (adminEmails.includes(email)) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      // toast.error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      toast.success('Admin access granted!');
      navigate('/admin');
    } catch (error) {
      toast.error('Invalid owner credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center px-4 py-20">
      <SEO title="Account Login | Sathya Traders" noindex={true} />
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-primary p-8 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {isSignUp ? <UserPlus size={32} /> : <LogIn size={32} />}
          </div>
          <h1 className="text-3xl font-heading font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-white/80 mt-2">{isSignUp ? 'Join Sathya Traders family' : 'Sign in to continue shopping'}</p>
        </div>

        <div className="p-8 md:p-10">
          {!showAdminLogin ? (
            <div className="space-y-6">
              {/* Google Login remains static at top for customers */}
              <button
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-secondary font-bold py-4 rounded-xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-400 font-medium uppercase tracking-widest">Or use email</span></div>
              </div>

              {/* Main Auth Form (Sign In / Sign Up) */}
              <form onSubmit={handleAuth} className="space-y-4">
                {isSignUp && (
                  <>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        required
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : isSignUp ? 'Create My Account' : 'Sign In'}
                </button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-secondary font-bold hover:text-primary transition-colors text-sm"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <button 
                  onClick={() => setShowAdminLogin(true)}
                  className="w-full text-xs text-gray-400 hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={14} /> Owner / Admin Access
                </button>
              </div>
            </div>
          ) : (
            /* Admin Section */
            <form onSubmit={handleAdminLogin} className="space-y-6">
               <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Admin Email"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Admin Password"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Owner Sign In'}
              </button>

              <button 
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="w-full py-2 text-sm text-gray-400 hover:text-secondary transition-colors"
              >
                Back to Customer Login
              </button>
            </form>
          )}
        </div>

        <div className="bg-gray-50 p-6 text-center">
           <p className="text-gray-400 text-xs">Premium Quality Authentic Appalam Since 1990</p>
        </div>
      </div>
    </div>
  );
}
