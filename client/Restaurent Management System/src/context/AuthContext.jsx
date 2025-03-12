import React, { createContext, useContext, useEffect, useState } from "react";
import { verifyUser } from "../services/userServices";

// Create the context
const AuthContext = createContext();

// Provider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  // Login function to update user state
  const login = (userData) => {
    setUser(userData);
  };

   // Auto-login on page refresh
   useEffect(() => {
    verifyUser().then(res=>{
      console.log(res.data);
      setUser(res.data)
    }).catch(err=>{
      console.log(err);
      setUser(null)
    })
  }, []);


  // Logout function to clear user state
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth state
export const useAuth = () => {
  return useContext(AuthContext);
};