import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, rtdb } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';
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
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'admin@sathyatraders.com').split(',').map(e => e.trim());
        const isUserAdmin = adminEmails.includes(user.email);
        setIsAdmin(isUserAdmin);

        // Auto-sync admin role in database if they are an admin
        if (isUserAdmin) {
          const userRef = ref(rtdb, 'users/' + user.uid);
          get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              if (data.role !== 'admin') {
                set(ref(rtdb, 'users/' + user.uid + '/role'), 'admin');
              }
            } else {
              // Create record if it doesn't exist (e.g. first time admin login)
              set(userRef, {
                name: user.displayName || 'Admin',
                email: user.email,
                role: 'admin',
                createdAt: Date.now()
              });
            }
          });
        }
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

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      const userRef = ref(rtdb, 'users/' + user.uid);
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        await set(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: Date.now()
        });
      } else {
        const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || 'admin@sathyatraders.com').split(',').map(e => e.trim());
        const isUserAdmin = adminEmails.includes(user.email);
        
        await set(userRef, {
          ...snapshot.val(),
          name: user.displayName,
          photoURL: user.photoURL,
          role: isUserAdmin ? 'admin' : (snapshot.val().role || 'user'),
          lastLogin: Date.now()
        });
      }
      
      toast.success(`Welcome back, ${user.displayName}!`);
      return user;
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        toast.error("Popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === 'auth/cancelled-popup-request') {
        // No toast for cancellation
      } else {
        toast.error(error.message);
      }
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
      loginWithGoogle,
      logout, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

