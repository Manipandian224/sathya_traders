import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, rtdb } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { ref, set } from 'firebase/database';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || ['admin@sathyatraders.com'];
        setIsAdmin(adminEmails.includes(user.email));
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (name, email, phone, password) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      
      // Store user record for admin dashboard in Realtime Database
      await set(ref(rtdb, 'users/' + user.uid), {
        name,
        email,
        phone,
        role: 'user',
        createdAt: Date.now()
      });

      toast.success("Account created successfully!");
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      toast.success(`Welcome back!`);
      return user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAdmin, 
      signup, 
      loginWithEmail, 
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

