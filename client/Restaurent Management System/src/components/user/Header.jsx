import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userLogout } from "../../services/userServices";
import { toast } from "react-toastify";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/customer/home";

  const handleNavigation = (path, item) => {
    setActive(item.toLowerCase());
    navigate(path);
  };

  //logout function
  const handleLogout = () => {
    userLogout()
      .then((res) => {
        console.log(res);
        logout();
        navigate("/login");
        toast.success("User logged out successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          !isHomePage ? "shadow-md" : null
        } ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold transition-colors duration-300 text-amber-600">
                  <span className="font-light">G</span>usto
                </span>
              </div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {["Home", "Menu", "About", "Gallery", "Contact"].map(
                  (item, index) => {
                    const path =
                      item.toLowerCase() === "home"
                        ? "home"
                        : `${item.toLowerCase()}`;
                    return (
                      <NavLink
                        key={item}
                        to={path}
                        className={({ isActive }) =>
                          `group transition-colors duration-300 relative cursor-pointer flex items-center px-1 py-2 text-sm font-medium ${
                            !isHomePage
                              ? "text-black"
                              : isActive
                              ? "text-amber-600"
                              : isScrolled
                              ? "text-gray-600 hover:text-amber-600"
                              : "text-white/80 hover:text-white"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {item}
                            <span
                              className={`absolute bottom-0 left-0 w-full h-0.5 transform transition-transform duration-300 ${
                                isActive
                                  ? "scale-x-100"
                                  : "scale-x-0 group-hover:scale-x-100"
                              } ${
                                item.toLowerCase() === "home"
                                  ? "bg-amber-500"
                                  : "bg-amber-400"
                              }`}
                            ></span>
                          </>
                        )}
                      </NavLink>
                    );
                  }
                )}
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="cart" // Replace with your actual cart route
                className={`transition-colors duration-300 ${
                  isScrolled
                    ? "text-gray-600 hover:text-amber-600"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                </svg>
              </Link>

              <button
                type="button"
                onClick={() => navigate("/customer/orderManagement")}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => navigate("/customer/reservationManagement")}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Reservations
              </button>
              <button
                type="button"
                onClick={() => navigate("/customer/reservation")}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Book a Table
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Logout
              </button>
            </div>

            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-full ${
                  isScrolled
                    ? "text-gray-500 hover:bg-gray-100"
                    : "text-black hover:bg-white/10"
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500`}
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - with animation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div
            className={`px-2 pt-2 pb-3 space-y-1  overflow-y-auto max-h-96 ${
              isScrolled
                ? "bg-white/80 backdrop-blur-md"
                : "bg-black/30 backdrop-blur-lg"
            }`}
          >
            {["Home", "Menu", "About", "Gallery", "Contact"].map(
              (item, index) => {
                const path =
                  item.toLowerCase() === "home"
                    ? "home"
                    : `${item.toLowerCase()}`;
                return (
                  <NavLink
                    key={item}
                    to={path}
                    className={`block px-3 py-2 rounded-lg text-base font-medium ${
                      index === 0
                        ? isScrolled
                          ? "bg-amber-50 text-amber-700"
                          : "bg-white/10 text-amber-300"
                        : isScrolled
                        ? "text-gray-600 hover:bg-gray-50 hover:text-amber-600"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item}
                  </NavLink>
                );
              }
            )}
            <div className="mt-4 px-3">
              <div className="flex w-full items-center justify-center px-5 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mb-2">
                <Link
                  to="cart" // Replace with your actual cart route
                  className={`transition-colors duration-300 flex items-center gap-2 ${
                    isScrolled
                      ? "text-gray-600 hover:text-amber-600"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
                  </svg>
                  Cart
                </Link>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/customer/orderManagement");
                }}
                className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mb-2"
              >
                Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/customer/reservationManagement");
                }}
                className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mb-2"
              >
                Reservations
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/customer/reservation");
                }}
                className="w-full flex items-center justify-center px-5 py-3 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Book a Table
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
