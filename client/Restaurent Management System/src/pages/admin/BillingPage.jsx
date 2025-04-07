import React, { useEffect, useState } from "react";
import {
  Search,
  Truck,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Menu,
  X,
} from "lucide-react";
import { getPendingOrders, updateOrder } from "../../services/orderServices";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/shared/CheckoutForm";
import { updatePayment } from "../../services/paymentServices";
import { updateTable } from "../../services/tableServices";

const BillingPage = () => {
  const [orders, setOrders] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState({});
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getPendingOrders()
      .then((res) => {
        console.log(res);
        setOrders(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePaymentSubmission = (order) => {
    const orderStatus = "completed"; // For updating order status
    const tableStatus = "available";
    const tableId = order.tableInfo?._id;
    const updatedData = {
      payment_method: "cash",
      payment_status: "success",
    };
    const orderId = order._id;
    updatePayment(orderId, updatedData)
      .then(() => updateOrder({ status: orderStatus }, orderId)) // Update order status
      .then(() => {
        const tableUpdatePromise = tableId
          ? updateTable(tableId, { status: tableStatus })
          : Promise.resolve();
        Promise.all([tableUpdatePromise, getPendingOrders()]);
      }) // Run updates in parallel
      .then(([_, response]) => {
        console.log(response);
        setOrders(response.data.data);
        setPaymentModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCardPayment = (order, paymentIntent) => {
    const orderStatus = "completed"; // For updating order status
    const tableStatus = "available";
    const tableId = order.tableInfo._id;
    const updatedData = {
      payment_method: "card",
      payment_status: "success",
      transaction_id: paymentIntent.id,
      gateway_response: paymentIntent,
    };
    const orderId = order._id;
    updatePayment(orderId, updatedData)
      .then(() => updateOrder({ status: orderStatus }, orderId))
      .then(() => {
        const tableUpdatePromise = tableId
          ? updateTable(tableId, { status: tableStatus })
          : Promise.resolve();
        Promise.all([tableUpdatePromise, getPendingOrders()]);
      }) // Runs both in parallel
      .then(([_, response]) => {
        setOrders(response.data.data);
        setPaymentModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  // Toggle item visibility for a specific order
  const toggleOrderItems = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Filter orders based on selected filter type and search query
  const filteredOrders = orders.filter((order) => {
    const matchesType = filterType === "all" || order.order_type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      order._id.includes(searchQuery) ||
      (order.table_info.name &&
        order.table_info.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Floating back button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center bg-white  border-2 text-gray-700 hover:text-gray-900 py-2 px-4 rounded-full shadow-md transition-all hover:shadow-lg"
        >
          <FiArrowLeft size={18} className="mr-2" />
          <span>Back to Home</span>
        </button>
      </div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm mt-10">
        <h1 className="text-xl font-bold text-gray-800">Restaurant Billing</h1>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 hover:shadow-lg transition-all flex items-center gap-2">
            <span>New Order</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Search and Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search Field */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by order ID or table..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                filterType === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilterType("all")}
            >
              All Orders
            </button>
            <button
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                filterType === "dine-in"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilterType("dine-in")}
            >
              <Truck className="h-4 w-4" />
              Dine-in
            </button>
            <button
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
                filterType === "takeaway"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setFilterType("takeaway")}
            >
              <ShoppingBag className="h-4 w-4" />
              Takeaway
            </button>
          </div>
        </div>

        {/* Orders Display */}
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col"
            >
              {/* Order Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-800">
                    ORD: {order._id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.tableInfo?.name
                      ? order.tableInfo.name
                      : order.order_type === "dine-in"
                      ? "Dine-in"
                      : "Takeaway"}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
                      {new Date(order.order_time).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary - Always visible */}
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Menu className="h-5 w-5 text-gray-500" />
                  <span className="font-medium">
                    {order.order_items?.length} items
                  </span>
                </div>
                <button
                  onClick={() => toggleOrderItems(order._id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {expandedOrders[order._id] ? (
                    <>
                      <span>Hide items</span>
                      <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>View items</span>
                      <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Order Items - Conditionally rendered */}
              {expandedOrders[order._id] && (
                <div className="p-4 flex-1">
                  {order.order_items.map((item) => (
                    <div
                      key={item.details._id}
                      className="flex items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="h-12 w-12 rounded overflow-hidden bg-gray-100 mr-3">
                        <img
                          src={item.details.image}
                          alt={item.details.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">
                          {item.details.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium text-gray-800">
                        ${item.price?.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* payment option   */}
              {paymentModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white rounded-2xl shadow-lg p-6 w-1/2 relative">
                    {/* Close Button */}
                    <button
                      onClick={() => setPaymentModalOpen(false)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-6 w-6" />
                    </button>

                    {/* Modal Content */}
                    <h2 className="text-lg font-semibold mb-4">
                      Select Payment Method
                    </h2>
                    <div className="space-y-4">
                      {/* Card Payment Option */}
                      <div className="flex items-center">
                        <input
                          id="card"
                          name="paymentMethod"
                          type="radio"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                        />
                        <label
                          htmlFor="card"
                          className="ml-3 flex items-center"
                        >
                          <span className="text-gray-700 mr-3">
                            Credit/Debit Card
                          </span>
                          <div className="flex space-x-1">
                            <div className="h-6 w-10 bg-blue-600 rounded">
                              <div className="h-3 w-3 bg-white rounded-full mt-1 ml-1"></div>
                            </div>
                            <div className="h-6 w-10 bg-red-500 rounded-sm flex items-center justify-center">
                              <div className="h-4 w-4 bg-yellow-400 rounded-full"></div>
                            </div>
                            <div className="h-6 w-10 bg-gray-800 rounded-sm"></div>
                          </div>
                        </label>
                      </div>

                      {paymentMethod === "card" && (
                        <CheckoutForm
                          amount={order.total_amount}
                          onPaymentSuccess={(paymentIntent) =>
                            handleCardPayment(order, paymentIntent)
                          }
                        />
                      )}

                      {/* Cash Payment Option */}
                      <div className="flex items-center mt-4">
                        <input
                          id="cash"
                          name="paymentMethod"
                          type="radio"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                        />
                        <label htmlFor="cash" className="ml-3 text-gray-700">
                          Cash/Pickup
                        </label>
                      </div>
                    </div>

                    {/* Confirm Button */}
                    {paymentMethod === "cash" && (
                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handlePaymentSubmission(order)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
                        >
                          Confirm Payment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="font-bold text-lg">
                    ${order.total_amount?.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                  >
                    Pay
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all">
                    Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 mb-2">
              <ShoppingBag className="h-16 w-16 mx-auto mb-2" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">
              No orders found
            </h3>
            <p className="text-gray-500 mt-1">
              Try changing your filters or search criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BillingPage;
