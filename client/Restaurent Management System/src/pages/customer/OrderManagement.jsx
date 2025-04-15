import React, { useState, useEffect } from "react";
import { Trash2, ChevronUp, ChevronDown, ShoppingBag } from "lucide-react";
import {
  deleteOrder,
  deleteOrderItem,
  getNewOrders,
} from "../../services/orderServices";
import { toast } from "react-toastify";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  //get orders
  useEffect(() => {
    getNewOrders()
      .then((res) => {
        console.log(res);
        setOrders(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  }, []);

  //remove order
  const handleRemoveOrder = (orderId) => {
    deleteOrder(orderId)
      .then((res) => {
        console.log(res);
        return getNewOrders();
    })
    .then((response) => {
        console.log(response);
        toast.success("Order removed successfully");
        setOrders(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemoveOrderItem = (orderId, orderItemId) => {
    deleteOrderItem(orderId, orderItemId)
      .then((res) => {
        console.log(res);
        return getNewOrders();
      })
      .then((response) => {
        console.log(response);
        setOrders(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-blue-600 text-lg font-medium">
          Loading your orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 mt-20">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          No orders found
        </h2>
        <p className="mt-2 text-gray-500">
          You don't have any active orders at the moment.
        </p>
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
        {orders?.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            {/* Order header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer bg-gray-50"
              onClick={() => toggleOrderExpand(order._id)}
            >
              <div>
                <div className="font-semibold text-gray-900">
                  Order ID : {order._id}
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(order.order_time).toLocaleString()} •{" "}
                  {order.order_items?.length} items
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === "Processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="font-semibold text-lg">
                  ${order.total_amount?.toFixed(2)}
                </div>
                {expandedOrder === order._id ? (
                  <ChevronUp className="ml-2 h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="ml-2 h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            <div className="text-end m-2">
                <button
                  className="ml-4 p-2 text-gray-500 hover:text-red-600 transition-colors"
                  onClick={() => handleRemoveOrder(order._id)}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

            {/* Order details */}
            {expandedOrder === order._id && (
              <div className="p-4 border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {order.order_items.map((item) => (
                    <li
                      key={item.item_id._id}
                      className="py-4 flex items-center"
                    >
                      <img
                        src={item.item_id.image}
                        alt={item.item_id.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          ${item.item_id.price?.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                      <div className="ml-4 font-medium">
                        ${(item.item_id.price * item.quantity)?.toFixed(2)}
                      </div>
                      <button
                        className="ml-4 p-2 text-gray-500 hover:text-red-600 transition-colors"
                        onClick={() =>
                          handleRemoveOrderItem(order._id, item.item_id._id)
                        }
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
                    <span>${order.total_amount?.toFixed(2)}</span>
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
