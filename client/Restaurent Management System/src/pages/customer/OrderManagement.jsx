import React, { useState, useEffect } from 'react';
import { Trash2, ChevronUp, ChevronDown, ShoppingBag } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Simulated data fetch - in a real app, this would call your API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/customer/orders');
        // const data = await response.json();
        
        // Simulated response data
        const data = [
          {
            id: "ord-123456",
            date: "2025-03-18T10:30:00",
            status: "Processing",
            total: 42.97,
            items: [
              { id: 1, name: "Margherita Pizza", price: 12.99, quantity: 1, image: "/api/placeholder/80/80" },
              { id: 2, name: "Caesar Salad", price: 8.99, quantity: 1, image: "/api/placeholder/80/80" },
              { id: 3, name: "Garlic Bread", price: 4.99, quantity: 2, image: "/api/placeholder/80/80" },
              { id: 4, name: "Tiramisu", price: 6.99, quantity: 1, image: "/api/placeholder/80/80" }
            ]
          },
          {
            id: "ord-123457",
            date: "2025-03-17T18:45:00",
            status: "Delivered",
            total: 27.98,
            items: [
              { id: 5, name: "Chicken Alfredo", price: 15.99, quantity: 1, image: "/api/placeholder/80/80" },
              { id: 6, name: "Chocolate Brownie", price: 5.99, quantity: 2, image: "/api/placeholder/80/80" }
            ]
          }
        ];
        
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load your orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleRemoveItem = (orderId, itemId) => {
    // In a real app, make an API call to remove the item
    // Then update the state based on the response
    
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          // Filter out the removed item
          const updatedItems = order.items.filter(item => item.id !== itemId);
          
          // Recalculate total
          const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            ...order,
            items: updatedItems,
            total: parseFloat(newTotal.toFixed(2))
          };
        }
        return order;
      }).filter(order => order.items.length > 0) // Remove orders with no items
    );
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-blue-600 text-lg font-medium">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">No orders found</h2>
        <p className="mt-2 text-gray-500">You don't have any active orders at the moment.</p>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
          Start Ordering
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
        <p className="text-gray-600">Manage your food orders here</p>
      </div>
      
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer bg-gray-50"
              onClick={() => toggleOrderExpand(order.id)}
            >
              <div>
                <div className="font-semibold text-gray-900">{order.id}</div>
                <div className="text-sm text-gray-600">
                  {new Date(order.date).toLocaleString()} • {order.items.length} items
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "Processing" ? "bg-blue-100 text-blue-800" : 
                    order.status === "Delivered" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="font-semibold text-lg">${order.total.toFixed(2)}</div>
                {expandedOrder === order.id ? <ChevronUp className="ml-2 h-5 w-5 text-gray-400" /> : <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />}
              </div>
            </div>
            
            {/* Order details */}
            {expandedOrder === order.id && (
              <div className="p-4 border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {order.items.map(item => (
                    <li key={item.id} className="py-4 flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-16 w-16 rounded-md object-cover" 
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</div>
                      </div>
                      <div className="ml-4 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <button 
                        className="ml-4 p-2 text-gray-500 hover:text-red-600 transition-colors"
                        onClick={() => handleRemoveItem(order.id, item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;