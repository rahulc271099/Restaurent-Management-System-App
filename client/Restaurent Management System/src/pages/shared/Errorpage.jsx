import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft, FiHome, FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const ErrorPage = ({ error }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(10);
  const [errorDetails, setErrorDetails] = useState({
    title: "Page Not Found",
    message: "Sorry, the page you're looking for doesn't exist or has been moved.",
    code: "404",
    icon: "route"
  });

  useEffect(() => {
    // Determine error type based on error prop or route
    if (error) {
      if (error.status === 500) {
        setErrorDetails({
          title: "Internal Server Error",
          message: "Something went wrong on our end. We're working to fix the issue.",
          code: "500",
          icon: "server"
        });
      } else if (error.status === 403) {
        setErrorDetails({
          title: "Access Denied",
          message: "You don't have permission to access this resource.",
          code: "403",
          icon: "lock"
        });
      } else {
        setErrorDetails({
          title: error.title || "An Error Occurred",
          message: error.message || "Something went wrong. Please try again later.",
          code: error.status || "Error",
          icon: "generic"
        });
      }
    } else if (location.pathname.includes("notfound")) {
      // Keep default 404 error
    }

    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    // Redirect to home after countdown
    if (countdown === 0) {
      navigate("/");
    }

    return () => clearInterval(timer);
  }, [error, navigate, countdown, location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  const refresh = () => {
    window.location.reload();
  };

  // Select appropriate error illustration
  const renderErrorIllustration = () => {
    switch (errorDetails.icon) {
      case "server":
        return (
          <div className="flex items-center justify-center rounded-full bg-orange-100 h-32 w-32 mx-auto mb-6">
            <svg className="h-16 w-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
        );
      case "lock":
        return (
          <div className="flex items-center justify-center rounded-full bg-red-100 h-32 w-32 mx-auto mb-6">
            <svg className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center rounded-full bg-blue-100 h-32 w-32 mx-auto mb-6">
            <svg className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-16">
      <div className="max-w-md w-full mx-auto">
        {/* Error indicator pulse animation */}
        <div className="relative mb-8">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75 animate-ping"></span>
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-red-500"></span>
          </div>
        </div>
        
        {/* Error content card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Error header with code */}
          <div className="pt-8 px-6 pb-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
            
            {/* Error illustration */}
            {renderErrorIllustration()}
            
            {/* Error title and code */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
                <span>{errorDetails.title}</span>
                <span className="ml-3 text-sm font-medium px-2 py-1 rounded bg-gray-100 text-gray-600">
                  {errorDetails.code}
                </span>
              </h1>
              <p className="text-gray-600 mb-6 text-lg">{errorDetails.message}</p>
              
              {/* Auto-redirect message */}
              <div className="text-sm text-gray-500 mb-6">
                Redirecting to homepage in <span className="font-medium">{countdown}</span> seconds
                <span className="animate-pulse">...</span>
              </div>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button 
                  onClick={goBack}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </button>
                <button 
                  onClick={goHome}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiHome className="mr-2 h-4 w-4" />
                  Back to Home
                </button>
                <button 
                  onClick={refresh}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiRefreshCw className="mr-2 h-4 w-4" />
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
          
          {/* Helper links */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>Need help? Contact <a href="mailto:support@example.com" className="font-medium text-blue-600 hover:text-blue-800">support@example.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;