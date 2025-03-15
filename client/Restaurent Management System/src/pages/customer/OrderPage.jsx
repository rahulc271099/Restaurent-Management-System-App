import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OrderPage = () => {
  const navigate = useNavigate();

  // This would be replaced with actual data from your backend
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic cheese and tomato sauce",
      price: 12.99,
      quantity: 2,
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      name: "Chicken Alfredo Pasta",
      description: "Creamy pasta with grilled chicken",
      price: 14.99,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing",
      price: 8.99,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
  ]);

  const [orderType, setOrderType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    instructions: "",
  });
  const [contactInfo, setContactInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = orderType === "delivery" ? 3.99 : 0;
  const tax = subtotal * 0.07;
  const total = subtotal + deliveryFee + tax;

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (section === "delivery") {
      setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
    } else if (section === "contact") {
      setContactInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePlaceOrder = () => {
    // This would send the order to your backend
    toast.success("Your order has been placed successfully!");
    setTimeout(() => {
      navigate("/customer/order-confirmation");
    }, 1500);
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Order Info */}
          <div className="lg:w-2/3 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contactInfo.name}
                    onChange={(e) => handleInputChange(e, "contact")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={(e) => handleInputChange(e, "contact")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={(e) => handleInputChange(e, "contact")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                    placeholder="johndoe@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Order Type */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order Type</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleOrderTypeChange("delivery")}
                  className={`flex-1 py-3 px-4 rounded-xl border ${
                    orderType === "delivery"
                      ? "bg-amber-50 border-amber-400 text-amber-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  } flex items-center justify-center gap-2 transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Delivery
                </button>
                <button
                  onClick={() => handleOrderTypeChange("takeaway")}
                  className={`flex-1 py-3 px-4 rounded-xl border ${
                    orderType === "takeaway"
                      ? "bg-amber-50 border-amber-400 text-amber-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  } flex items-center justify-center gap-2 transition-colors`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Take Away
                </button>
              </div>
            </div>

            {/* Delivery Address - Only show if delivery is selected */}
            {orderType === "delivery" && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={deliveryAddress.street}
                      onChange={(e) => handleInputChange(e, "delivery")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={(e) => handleInputChange(e, "delivery")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      placeholder="New York"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={deliveryAddress.state}
                        onChange={(e) => handleInputChange(e, "delivery")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={deliveryAddress.zip}
                        onChange={(e) => handleInputChange(e, "delivery")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="instructions"
                      value={deliveryAddress.instructions}
                      onChange={(e) => handleInputChange(e, "delivery")}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Apartment number, gate code, landmarks, etc."
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Info - Only show if takeaway is selected */}
            {orderType === "takeaway" && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Pickup Information
                </h2>
                <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                  <div className="flex-shrink-0 text-amber-500">
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Your order will be ready for pickup at our restaurant in
                      approximately 20-30 minutes.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Gusto Restaurant</p>
                  <p className="text-gray-600">123 Restaurant Ave</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                  <p className="text-gray-600 mt-2">Phone: (555) 123-4567</p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="card"
                    name="paymentMethod"
                    type="radio"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="h-4 w-4 text-amber-600 border-gray-300 focus:ring-amber-500"
                  />
                  <label htmlFor="card" className="ml-3 flex items-center">
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
                  <div className="ml-7 mt-3 grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                    Cash on Delivery/Pickup
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3 bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Delivery Fee</p>
                  <p>${deliveryFee.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax (7%)</p>
                  <p>${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <p>Total</p>
                  <p>${total.toFixed(2)}</p>
                </div>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="mt-6 w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
