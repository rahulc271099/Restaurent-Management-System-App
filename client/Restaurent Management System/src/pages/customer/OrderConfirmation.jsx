import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Package,
  Truck,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  CreditCard,
} from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getLatestOrder } from "../../services/orderServices";

const OrderConfirmation = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [orderData,setOrderData] = useState(null)
  const navigate = useNavigate();

  useEffect(()=>{
    getLatestOrder().then(res=>{
        console.log(res);
        setOrderData(res.data.data)
    }).catch(err=>{
        console.log(err);
    })
  },[])

  useEffect(() => {
    // Trigger the animation after component mounts
    setTimeout(() => {
      setShowAnimation(true);
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating back button */}
      <div className="fixed top-4 left-4 z-10">
        <button
          onClick={() => navigate("/customer/home")}
          className="flex items-center bg-white text-gray-700 hover:text-gray-900 py-2 px-4 rounded-full shadow-md transition-all hover:shadow-lg"
        >
          <FiArrowLeft size={18} className="mr-2" />
          <span>Back to Home</span>
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Success Message */}
        <div
          className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-700 ease-out transform ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 md:p-8">
            <div className="flex items-center justify-center mb-4">
              <div
                className={`rounded-full bg-white/20 p-3 transition-all duration-1000 ${
                  showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
                }`}
              >
                <CheckCircle size={32} className="text-white" />
              </div>
            </div>
            <h1
              className={`text-2xl md:text-3xl font-bold text-center transition-all duration-700 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Order Confirmed!
            </h1>
            <p
              className={`text-center mt-2 transition-all duration-700 delay-100 ${
                showAnimation
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
            >
              Thank you for your purchase. Your order #ORD:{orderData ?._id} has
              been confirmed.
            </p>
          </div>

          {/* Order Progress */}
          <div className="p-6 border-b">
            <div
              className={`flex justify-between max-w-md mx-auto transition-all duration-1000 ${
                showAnimation ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <CheckCircle size={20} />
                </div>
                <p className="text-xs mt-2 text-green-600 font-medium">
                  Confirmed
                </p>
              </div>
              <div className="w-1/4 h-1 bg-gray-200 mt-5 relative">
                <div className="absolute h-1 bg-green-500 w-full transition-all duration-1000 delay-300"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-green-100 p-2 text-green-600">
                  <Package size={20} />
                </div>
                <p className="text-xs mt-2 text-green-600 font-medium">
                  Processing
                </p>
              </div>
              <div className="w-1/4 h-1 bg-gray-200 mt-5 relative">
                <div className="absolute h-1 bg-green-500 w-1/3 transition-all duration-1000 delay-500"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-gray-200 p-2 text-gray-500">
                  <Truck size={20} />
                </div>
                <p className="text-xs mt-2 text-gray-500">Shipped</p>
              </div>
              <div className="w-1/4 h-1 bg-gray-200 mt-5"></div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-gray-200 p-2 text-gray-500">
                  <ShoppingBag size={20} />
                </div>
                <p className="text-xs mt-2 text-gray-500">Delivered</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-3 font-medium text-sm transition-all ${
                  activeTab === "summary"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Order Summary
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-4 py-3 font-medium text-sm transition-all ${
                  activeTab === "details"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Order Details
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "summary" ? (
              <div
                className={`transition-all duration-500 ${
                  showAnimation
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
              >
                <h2 className="text-lg font-semibold mb-4">Items Ordered</h2>
                <div className="space-y-4">
                  {orderData ?.order_items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg overflow-hidden"
                    >
                      <div className="w-16 h-16 bg-white rounded-md overflow-hidden flex-shrink-0 border">
                        <img
                          src={item.item_id.image}
                          alt={item.item_id.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="font-medium">{item.item_id.name}</h3>
                        <p className="text-sm text-gray-500">
                          Color: {item.color}
                        </p>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                          <p className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${orderData ?.total_amount.toFixed(2)}</span>
                    </div>
                    {orderData ?.order_type === "delivery" && (
                        <div className="flex justify-between">
                        <span className="text-gray-600">shipping</span>
                        {/* <span>${orderData.shipping.toFixed(2)}</span> */}
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>${orderData ?.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${orderData ?.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`transition-all duration-500 ${
                  showAnimation
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-start mb-4">
                      <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Shipping Address</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          {orderData.shippingAddress}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CreditCard
                        size={18}
                        className="text-gray-500 mr-2 mt-0.5"
                      />
                      <div>
                        <h3 className="font-medium">Payment Method</h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          {orderData.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start mb-4">
                      <Package
                        size={18}
                        className="text-gray-500 mr-2 mt-0.5"
                      />
                      <div>
                        <h3 className="font-medium">Order Information</h3>
                        <div className="text-gray-600 mt-1 text-sm">
                          <p>Order ID: {orderData.orderId}</p>
                          <p>Order Date: {orderData.orderDate}</p>
                          <p>
                            Estimated Delivery: {orderData.estimatedDelivery}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 flex justify-between items-center">
            <button onClick={()=>navigate("/customer/menu")} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={16} className="mr-1" />
              Continue Shopping
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
              Track Order
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div
          className={`mt-6 text-center text-gray-500 text-sm transition-all duration-700 delay-700 ${
            showAnimation ? "opacity-100" : "opacity-0"
          }`}
        >
          <p>
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="mt-1">
            Need help? Contact our{" "}
            <span className="text-green-600">customer support</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
