import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase"; // Import Firebase auth
import {
  createUserWithEmailAndPassword, // For signup
  signInWithEmailAndPassword, // For login
  signOut, // For logout
  onAuthStateChanged, // Track user state
} from "firebase/auth";

// 1️⃣ Create the Auth Context
const AuthContext = createContext();

// 2️⃣ Auth Provider Component (Wrap your app with this)
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Track loading state

  // 3️⃣ Signup Function
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // 4️⃣ Login Function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // 5️⃣ Logout Function
  function logout() {
    return signOut(auth);
  }

  // 6️⃣ Track Auth State Changes (Runs when user logs in/out)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update user state
      setLoading(false); // Stop loading
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  // 7️⃣ Value passed to the context
  const value = {
    currentUser,
    signup,
    login,
    logout,
  };

  // 8️⃣ Provide the context to children
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children when not loading */}
    </AuthContext.Provider>
  );
}

// 9️⃣ Custom Hook to access auth context
export function useAuth() {
  return useContext(AuthContext);
}