import React, { useEffect, useState } from "react";
import { getMenuItems } from "../../services/menuServices";
import { useAuth } from "../../context/AuthContext";
import { userLogout } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminDashboard = () => {

  // State for active order
  const [activeOrder, setActiveOrder] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const {user,logout} = useAuth()
  const data = user

  const navigate = useNavigate()

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


  const handleLogout = () =>{
    userLogout().then(res=>{
      console.log(res);
      logout()
      navigate('/login')
      toast.success("User logged out successfully")
    }).catch(err=>{
      console.log(err);
    })
  }
 
  return (
    <div className="min-h-screen bg-slate-900 text-gray-100">
      {/* Header */}
      <header className="bg-slate-800 py-2 px-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <span className="text-2xl font-bold transition-colors duration-300 text-amber-600 mr-4">
            <span className="font-light">G</span>usto
          </span>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-3">
            {currentDate}
          </div>
          <div className="text-gray-400 text-sm">103.176.184.192</div>
        </div>

        <div className="flex items-center space-x-3">
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
          <button className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
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

          <div className="ml-2 space-x-2">
            <button onClick={()=>navigate("/admin/menu/manageTables")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded">
              Admin Panel
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded">
              Sales
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded">
              Billing
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded">
              Menu item
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded">
              New
            </button>
            <button onClick={handleLogout} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Location and user info */}
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
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
            <span>{data ? data.name:"admin"}</span>
          </button>
        </div>

        <div className="text-green-400">
          {activeOrder ? "Active Order: #123456" : "No Active Order"}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
        {categories.length > 0 ? (
          categories.map((category,index) => (
            <button
              key={index}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm"
            >
              {category}
            </button>
          ))
        ): (
          <p className="text-center text-gray-600 col-span-3">No categories found</p>
        )}
      </div>

      {/* Menu items grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-800 rounded-md overflow-hidden hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <div className="p-4 flex items-center space-x-4">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
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
          <p className="text-center text-gray-600 col-span-3">No items found</p>
        )}
      </div>

      {/* Floating action button */}
      <div className="fixed bottom-6 right-6">
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
