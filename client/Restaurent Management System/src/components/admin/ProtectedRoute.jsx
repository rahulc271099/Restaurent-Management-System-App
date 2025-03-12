import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  console.log(user);
  

  const data = user
   //loading screen while verifying user
   if (data === null) {
    return <p>Loading...</p>; // Or a spinner component
  }

  if (!data.token) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(data.user.role)) {
    return <Navigate to="/customer/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
