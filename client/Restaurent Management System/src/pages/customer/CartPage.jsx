import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart, deleteCart, getCart } from "../../services/cartServices";

const CartPage = () => {
  const navigate = useNavigate();
  // This would be replaced with actual data from your backend
  //   const [cartItems, setCartItems] = useState([
  //     {
  //       id: 1,
  //       name: "Margherita Pizza",
  //       description: "Classic cheese and tomato sauce",
  //       price: 12.99,
  //       quantity: 2,
  //       image: "/api/placeholder/80/80",
  //     },
  //     {
  //       id: 2,
  //       name: "Chicken Alfredo Pasta",
  //       description: "Creamy pasta with grilled chicken",
  //       price: 14.99,
  //       quantity: 1,
  //       image: "/api/placeholder/80/80",
  //     },
  //     {
  //       id: 3,
  //       name: "Caesar Salad",
  //       description: "Fresh romaine lettuce with Caesar dressing",
  //       price: 8.99,
  //       quantity: 1,
  //       image: "/api/placeholder/80/80",
  //     },
  //   ]);

  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState("delivery");

  // Calculate totals
    const subtotal = cartItems ?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = orderType === "delivery" ? 3.99 : 0;
    const tax = subtotal * 0.07;
    const total = subtotal + deliveryFee + tax;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    deleteCart(id)
      .then((res) => {
        console.log(res);
        toast.success("Item removed from cart");
        return getCart();
      })
      .then((response) => {
        console.log(response);
        setCartItems(response.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClearCart = () =>{
    clearCart().then(res=>{
        console.log(res);
        return getCart()
    })
    .then((response)=>{
        console.log(response);
        setCartItems(response.data.items)
    })
    .catch(err=>{
        console.log(err);
    })
  }

  const handleCheckout = () => {
    navigate("/customer/order", {state:{orderType}});
  };

  useEffect(() => {
    getCart()
      .then((res) => {
        console.log(res);
        setCartItems(res.data.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
        <div className="text-end mb-4">
          <button onClick={handleClearCart} className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-md transition-all duration-300 hover:shadow-amber-400/20 hover:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
            Clear cart
          </button>
        </div>
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-amber-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Add some delicious items from our menu!
            </p>
            <button
              onClick={() => navigate("/customer/menu")}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-medium rounded-full shadow-md hover:shadow-lg transition duration-300"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {cartItems?.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.description}
                          </p>
                          <div className="flex flex-1 items-end justify-between mt-4">
                            <div className="flex items-center border border-gray-200 rounded-full">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.menuItemId._id,
                                    item.quantity - 1
                                  )
                                }
                                className="p-2 text-gray-600 hover:text-amber-600 focus:outline-none"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>
                              <span className="px-4 py-1 text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.menuItemId?._id,
                                    item.quantity + 1
                                  )
                                }
                                className="p-2 text-gray-600 hover:text-amber-600 focus:outline-none"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveItem(item.menuItemId._id)
                              }
                              className="text-sm font-medium text-amber-600 hover:text-amber-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Order Type</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setOrderType("delivery")}
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
                    onClick={() => setOrderType("takeaway")}
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
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="flow-root">
                  <div className="divide-y divide-gray-200">
                    <div className="py-4 flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">${subtotal.toFixed(2)}</p>
                    </div>
                    {orderType === "delivery" && (
                      <div className="py-4 flex justify-between">
                        <p className="text-gray-600">Delivery Fee</p>
                        <p className="font-medium">${deliveryFee.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="py-4 flex justify-between">
                      <p className="text-gray-600">Tax</p>
                      <p className="font-medium">${tax.toFixed(2)}</p>
                    </div>
                    <div className="py-4 flex justify-between">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-lg font-semibold text-amber-600">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-6 w-full py-3 px-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-white font-medium shadow-md hover:shadow-amber-400/20 hover:translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/customer/menu")}
                  className="mt-4 w-full py-3 px-4 rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
