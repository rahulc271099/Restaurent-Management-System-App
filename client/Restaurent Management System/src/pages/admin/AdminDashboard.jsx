import React, { useEffect, useState } from "react";
import { getMenuItems } from "../../services/menuServices";
import { useAuth } from "../../context/AuthContext";
import { userLogout } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ThemeToggleButton from "../../components/shared/ThemeToggleButton";

const AdminDashboard = () => {
  // State for active order
  const [activeOrder, setActiveOrder] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [currentDate, setCurrentDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const data = user;

  const navigate = useNavigate();

  useEffect(() => {
    getMenuItems()
      .then((res) => {
        console.log(res.data);
        setMenuItems(res.data);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(res.data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    setCurrentDate(today);
  }, []);

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

  useEffect(() => {
    // Apply the theme to the <html> tag
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Store the theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]); // Run when theme changes

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className={`min-h-screen ${
      theme === "dark" ? "bg-slate-900 text-gray-100" : "bg-white text-black"
    }`}>
      {/* Header */}
      <header className="bg-slate-800 py-2 px-4 flex flex-col lg:flex-row justify-between shadow-md">
        {/* Logo and Mobile Toggle */}
        <div className="flex items-center w-full lg:w-auto justify-between">
          <span className="text-2xl font-bold transition-colors duration-300 text-amber-600 mr-4">
            <span className="font-light">G</span>usto
          </span>
          
          {/* Date and IP visible only on large screens */}
          <div className="hidden lg:flex items-center">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-3">
              {currentDate}
            </div>
            <div className="text-gray-400 text-sm">103.176.184.192</div>
          </div>
          
          <div className="flex items-center space-x-3 lg:hidden">
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Date and IP for small and medium screens */}
        <div className="lg:hidden flex items-center justify-center my-2">
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-3">
            {currentDate}
          </div>
          <div className="text-gray-400 text-sm">103.176.184.192</div>
        </div>

        {/* Navigation buttons and controls */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center w-full lg:w-auto space-y-2 lg:space-y-0 mt-2 lg:mt-0`}>
          {/* Utils buttons - only show on lg+ screens */}
          <div className="hidden lg:flex items-center space-x-3 mr-4">
            <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <ThemeToggleButton theme={theme} setTheme={setTheme} />
            <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Navigation buttons - responsively adjust across all screen sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-row gap-2 w-full lg:w-auto">
            <button
              onClick={() => navigate("/admin/menu/manageTables")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-center"
            >
              Admin Panel
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-center">
              Sales
            </button>
            <button 
              onClick={()=>navigate("/admin/billingpage")} 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-center"
            >
              Billing
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-center">
              Menu item
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-center">
              New
            </button>
            <button
              onClick={handleLogout}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded text-center"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Location and user info */}
      <div className="px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-2 sm:mb-0">
          <button className="flex items-center space-x-2 bg-slate-800 py-2 px-3 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Calicut</span>
          </button>

          <button className="flex items-center space-x-2 bg-slate-800 py-2 px-3 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span>{data ? data.name : "admin"}</span>
          </button>
        </div>

        <div className="text-green-400 text-center sm:text-right">
          {activeOrder ? "Active Order: #123456" : "No Active Order"}
        </div>
      </div>

      {/* Category filters - Horizontal scrollable */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-1">
          {categories.length > 0 ? (
            ["All", ...categories].map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm border border-green-600 text-green-400 transition flex-shrink-0
                  ${
                    selectedCategory === category
                      ? "bg-green-400/10 text-white border-green-500" // Active Category
                      : "bg-transparent" // Default Style
                  }`}
              >
                {category}
              </button>
            ))
          ) : (
            <p className="text-center text-gray-600 w-full">
              No categories found
            </p>
          )}
        </div>
      </div>

      {/* Menu items grid - Responsive across all screen sizes */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-800 rounded-md overflow-hidden hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <div className="p-4 flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm">$</span>
                    <span
                      className={`ml-1 ${
                        item.price === 0 ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No items found</p>
        )}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-10">
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
