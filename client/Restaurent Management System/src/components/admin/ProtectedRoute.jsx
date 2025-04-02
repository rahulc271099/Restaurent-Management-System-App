import React, { Children } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  console.log(user);
  

  const data = user
   //loading screen while verifying user
   if (data === null) {
    return <p>Loading...</p>; // Or a spinner component
  }

  // if (!data.token) {
  //   return <Navigate to="/login" replace />;
  // }

   // Ensure user object is valid before accessing properties
   if (!user?.token) {
    return <Navigate to="/login" replace />;
  }


  // if (allowedRoles && !allowedRoles.includes(data.user.role)) {
  //   return <Navigate to="/customer/home" replace />;
  // }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
