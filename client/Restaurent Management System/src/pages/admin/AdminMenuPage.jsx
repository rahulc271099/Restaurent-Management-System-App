import React, { useEffect, useState } from 'react'
import { 
    FiMenu, 
    FiUsers, 
    FiClipboard, 
    FiShoppingCart, 
    FiCalendar,
    FiBarChart2, 
    FiSettings,
    FiGrid,
    FiX
  } from 'react-icons/fi';

const AdminMenuPage = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [active, setActive] = useState('tables');
  
    // Handle screen resize
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setCollapsed(true);
        }
      };
  
      // Set initial state
      handleResize();
  
      // Add event listener
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { id: 'tables', label: 'Manage Tables', icon: <FiGrid size={20} /> },
        { id: 'staff', label: 'Manage Staff', icon: <FiUsers size={20} /> },
        { id: 'menu', label: 'Manage Menu Items', icon: <FiClipboard size={20} /> },
        { id: 'orders', label: 'Manage Orders', icon: <FiShoppingCart size={20} /> },
        { id: 'reservations', label: 'Manage Reservations', icon: <FiCalendar size={20} /> },
        { id: 'reports', label: 'Reports', icon: <FiBarChart2 size={20} /> },
        { id: 'settings', label: 'Settings', icon: <FiSettings size={20} /> }
      ];
    
      const handleMenuItemClick = (itemId) => {
        setActive(itemId);
        if (window.innerWidth < 768) {
          setMobileOpen(false);
        }
      };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden">
    {/* Mobile header */}
    <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Restaurant Admin</h1>
      <button 
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-2 rounded-md hover:bg-gray-800"
      >
        {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
    </div>

    {/* Sidebar - hidden on mobile by default, shown when mobileOpen is true */}
    <div 
      className={`bg-gray-900 text-white transition-all duration-300 flex flex-col fixed md:relative inset-0 z-20
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        ${collapsed ? 'md:w-20' : 'md:w-64'} w-64 md:h-screen top-0
      `}
    >
      {/* Logo area - hidden on mobile as we have the mobile header */}
      <div className="p-4 hidden md:flex items-center justify-between border-b border-gray-700">
        {!collapsed && <h1 className="text-xl font-bold">Restaurant Admin</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-800"
        >
          <FiMenu size={20} />
        </button>
      </div>

      {/* Mobile close button and title */}
      <div className="p-4 md:hidden flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl font-bold">Menu</h1>
        <button 
          onClick={() => setMobileOpen(false)}
          className="p-2 rounded-md hover:bg-gray-800"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Menu items */}
      <div className="flex-1 py-4 overflow-y-auto">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuItemClick(item.id)}
                className={`flex items-center px-4 py-3 w-full hover:bg-gray-800 transition-colors ${
                  active === item.id ? 'bg-blue-600' : ''
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                {(!collapsed || window.innerWidth < 768) && <span>{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* User profile area */}
      <div className="p-4 border-t border-gray-700 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-sm">A</span>
        </div>
        {(!collapsed || window.innerWidth < 768) && (
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@restaurant.com</p>
          </div>
        )}
      </div>
    </div>

    {/* Overlay for mobile */}
    {mobileOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
        onClick={() => setMobileOpen(false)}
      />
    )}

    {/* Main content area */}
    <div className="flex-1 bg-gray-100 p-4 md:p-6 overflow-auto">
      <div className="bg-white rounded-lg shadow p-4 md:p-6 min-h-full">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
          {menuItems.find(item => item.id === active)?.label}
        </h2>
        <p className="text-gray-600">
          Content for {menuItems.find(item => item.id === active)?.label} will display here.
        </p>
      </div>
    </div>
  </div>
  )
}

export default AdminMenuPage
