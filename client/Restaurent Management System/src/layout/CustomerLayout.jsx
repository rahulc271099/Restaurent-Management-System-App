import React from "react";
import Header from "../components/user/Header";
import Footer from "../components/user/Footer";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
