import React from "react";
import Header from "../components/customer/Header";
import Footer from "../components/customer/Footer";
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
