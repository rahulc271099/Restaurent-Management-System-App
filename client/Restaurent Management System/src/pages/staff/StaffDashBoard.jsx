import React, { useEffect, useState } from "react";
import {
  LayoutGrid,
  Coffee,
  IceCreamIcon,
  CakeSlice,
  Salad,
  Soup,
  Utensils,
  Sandwich,
  ClipboardList,
  CoffeeIcon,
} from "lucide-react";
import { MapPin, ShoppingBag, X } from "lucide-react";
import { getMenuItems } from "../../services/menuServices";
import { createOrder } from "../../services/orderServices";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTable } from "../../services/tableServices";

const menuCategories = [
  {
    name: "Fast Moving",
    icon: <LayoutGrid />,
    items: [
      { name: "Kopi", price: 2.0 },
      { name: "Kopi C", price: 2.0 },
      { name: "Kopi O", price: 0.0 },
    ],
  },
  {
    name: "Beverage",
    icon: <CoffeeIcon />,
    items: [
      { name: "Milo Ais", price: 3.0 },
      { name: "Kopi Ais", price: 2.0 },
      { name: "Minuman Jus", price: 2.5 },
    ],
  },
  {
    name: "Ice Cream",
    icon: <IceCreamIcon />,
    items: [{ name: "Ice Cream", price: 2.5 }],
  },
  {
    name: "Noodles",
    icon: <Soup />,
    items: [
      { name: "Maggi Goreng", price: 5.0 },
      { name: "Mee Goreng", price: 5.5 },
    ],
  },
  {
    name: "Bread",
    icon: <CakeSlice />,
    items: [
      { name: "Roti", price: 2.0 },
      { name: "Roti Nan", price: 2.5 },
      { name: "Idli", price: 1.3 },
    ],
  },
  {
    name: "Rice",
    icon: <Salad />,
    items: [
      { name: "Nasi Goreng", price: 5.0 },
      { name: "Nasi Lemak", price: 5.5 },
      { name: "Nasi Biryani", price: 6.0 },
    ],
  },
];

const orderTypes = [
  {
    type: "Delivery",
    icon: <MapPin className="w-6 h-6 text-blue-500" />,
    description: "Get food delivered to your doorstep",
  },
  {
    type: "Takeaway",
    icon: <ShoppingBag className="w-6 h-6 text-green-500" />,
    description: "Pickup your order from our store",
  },
  {
    type: "Dine-In",
    icon: <Utensils className="w-6 h-6 text-purple-500" />,
    description: "Enjoy your meal at our restaurant",
  },
];

const categoryIcons = {
  "Fast Moving": <LayoutGrid />,
  "Main Course": <Utensils />, // 🍽️ Main dish
  Appetizer: <Salad />, // 🥗 Starters
  Dessert: <CakeSlice />, // 🍰 Sweets
  Beverage: <Coffee />,
  "Ice Cream": <IceCreamIcon />,
  Bread: <Sandwich />, // 🥖 Closest match for bread
  Rice: <Soup />, // 🍚 Using Soup icon for rice
};

const StaffDashBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState(menuCategories[0]);
  const [cart, setCart] = useState([]);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [orderTypeModalOpen, setOrderTypeModalOpen] = useState(false);
  const selectedTable = location.state || null;
  const [selectedOrderType, setSelectedOrderType] = useState(null);

  useEffect(() => {
    console.log("selected table:", selectedTable);
    if (selectedTable && Object.keys(selectedTable).length > 0) {
      setIsOrderOpen(true); // Open sidebar only if selectedTable is present
    } else {
      setIsOrderOpen(false); // Ensure sidebar is closed when no table is selected
    }
    console.log(isOrderOpen);
  }, [selectedTable]);

  const formatCategoryName = (category) => {
    if (!category) return "Uncategorized";
    return category
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Converts "main course" → "Main Course"
      .join(" ");
  };

  useEffect(() => {
    getMenuItems()
      .then((res) => {
        console.log(res);
        const groupedMenu = res.data.reduce((acc, item) => {
          const categoryName = formatCategoryName(item.category); // Convert to Title Case
          const existingCategory = acc.find((cat) => cat.name === categoryName);
          if (existingCategory) {
            existingCategory.items.push(item);
          } else {
            acc.push({
              name: categoryName,
              icon: categoryIcons[categoryName] || <LayoutGrid />, // Default icon if category is not in `categoryIcons`
              items: [item],
            });
          }
          return acc;
        }, []);

        setMenuItems(groupedMenu);
        setSelectedCategory(groupedMenu[0] || null);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handlePlaceOrder = () => {
    const totalAmount = calculateTotal();
    const orderData = {
      order_type: selectedOrderType.toLowerCase(),
      table_id:
        selectedOrderType.toLowerCase() === "dine-in"
          ? selectedTable._id
          : null,
      total_amount: totalAmount,
      order_items: cart.map((item) => ({
        item_id: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    createOrder(orderData)
      .then((res) => {
        console.log(res);
        toast.success("Order placed successfully");

        // If it's a dine-in order, update the table status
        if (selectedOrderType.toLowerCase() === "dine-in" && selectedTable) {
          updateTable(selectedTable._id, { status: "occupied" })
            .then((response) => {
              console.log(response);
              console.log("Table status updated successfully");
            })
            .catch((err) => {
              console.error("Error updating table status:", err);
            });
        }

        //remove selected order type from localStorage
        localStorage.removeItem("selectedOrderType");

        //clear the state as well
        setSelectedOrderType(null);

        //navigate somewhere after placing the order
        navigate("");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.error);
      });
  };

  //   order type selection
  const handleOrderTypeSelect = (type) => {
    console.log("Order Type Selected:", type);
    setSelectedOrderType(type);
    localStorage.setItem("selectedOrderType", type);
    setOrderTypeModalOpen(false);
    if (type.toLowerCase() === "dine-in") {
      navigate("tableSelection");
    } else {
      setIsOrderOpen(true);
    }
  };

  useEffect(() => {
    const storedOrderType = localStorage.getItem("selectedOrderType");
    if (storedOrderType) {
      setSelectedOrderType(storedOrderType);
    }
  }, []);

  //hanlde order type modal close
  const handleClose = () => {
    localStorage.removeItem("selectedOrderType");
    setOrderTypeModalOpen(false);
  };

  //   handle menu item click
  const handleMenuItemClick = (isAvailable, item) => {
    console.log(selectedOrderType);
    if (!isAvailable) return; // Prevent adding unavailable items

    // ✅ Open modal only if order type is NOT selected
    if (!selectedOrderType) {
      setOrderTypeModalOpen(true);
      return; // Stop further execution
    }

    addToCart(item);
  };

  //   add to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem._id === item._id
      );

      if (existingItem) {
        // ✅ Use .map() properly to update the quantity
        return prevCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  //   remove from cart
  const removeFromCart = (item) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0) // Remove items with 0 quantity
    );
  };

  //   calculate total
  const calculateTotal = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Categories Sidebar */}
      <div className="w-1/6 bg-white border-r p-4 overflow-y-auto">
        <div
          onClick={() => navigate("orders")}
          className="group cursor-pointer flex items-center 
                 bg-blue-50 border border-blue-100 
                 rounded-lg p-3 mb-4 
                 hover:bg-blue-100 hover:shadow-md 
                 transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <ClipboardList
              className="text-blue-600 w-6 h-6 
                     group-hover:text-blue-700 
                     group-hover:rotate-6 
                     transition-transform duration-300"
            />
            <span
              className="font-semibold text-blue-800 
                         group-hover:text-blue-900 
                         transition-colors duration-300"
            >
              Orders
            </span>
          </div>
        </div>
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        {menuItems.map((category) => (
          <button
            key={category.name}
            className={`w-full flex items-center p-3 mb-2 rounded-lg ${
              selectedCategory.name === category.name
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            <span className="mr-3">{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
      {/* Open Order Button */}
      <div>
        <button
          className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-2 rounded shadow-lg"
          onClick={() => setOrderTypeModalOpen(true)}
        >
          New
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`${
          isOrderOpen ? "w-3/6" : "w-full"
        } p-4 bg-gray-50 overflow-y-auto transition-all duration-300`}
      >
        <h2 className="text-2xl font-bold mb-4">{selectedCategory.name}</h2>
        <div
          className={`grid ${
            isOrderOpen ? "grid-cols-2" : "grid-cols-3"
          } gap-4`}
        >
          {menuItems
            .filter((menuItem) => menuItem.name === selectedCategory.name) // 🔥 Show only the selected category
            .flatMap((menuItem) => menuItem.items) // 🔥 Extract items from the filtered category
            .map((item) => {
              const isAvailable = item.availability === "in-stock";

              return (
                <button
                  key={item._id}
                  className={`border rounded-lg p-4 text-center 
                      ${
                        isAvailable
                          ? "bg-white text-black hover:shadow-lg cursor-pointer"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                  onClick={() => handleMenuItemClick(isAvailable, item)} // Prevent click if unavailable
                  disabled={!isAvailable} // Disable button if unavailable
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-green-600">
                    $ {item.price?.toFixed(2)}
                  </div>
                  <div className="text-sm mt-2">
                    {isAvailable ? "Available" : "Out of Stock"}
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      {orderTypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  Select Order Type
                </h2>
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Order Type Buttons */}
            <div className="p-6 space-y-4">
              {orderTypes.map((orderType) => (
                <button
                  key={orderType.type}
                  onClick={() => handleOrderTypeSelect(orderType.type)}
                  className="w-full flex items-center p-4 bg-gray-100 rounded-xl 
                         hover:bg-blue-50 hover:shadow-md 
                         transition-all duration-300 
                         group"
                >
                  <div className="mr-4">{orderType.icon}</div>
                  <div className="text-left">
                    <h3
                      className="font-bold text-lg text-gray-800 
                               group-hover:text-blue-600 
                               transition-colors"
                    >
                      {orderType.type}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {orderType.description}
                    </p>
                  </div>
                  <div
                    className="ml-auto opacity-0 group-hover:opacity-100 
                              transition-opacity duration-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Sidebar */}
      {isOrderOpen && (
        <div
          className={`
    fixed top-20 right-0 w-96 h-full 
    bg-white shadow-2xl 
    transform ${isOrderOpen ? "translate-x-0" : "translate-x-full"}
    transition-transform duration-300 
    rounded-l-2xl 
    overflow-hidden relative ml-6
  `}
        >
          {/* Header with Order Type and Table Number */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <div className="flex justify-between items-center text-white">
              <div>
                <h3 className="text-sm uppercase tracking-wider opacity-75">
                  Order Type
                </h3>
                <p className="text-xl font-bold">
                  {selectedOrderType || "Not Selected"}
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wider opacity-75">
                  Table
                </h3>
                <p className="text-xl font-bold">
                  {selectedTable ? `#${selectedTable.name}` : "N/A"}
                </p>
              </div>
              <button
                onClick={() => setIsOrderOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col h-[calc(100%-80px)]">
            {/* Cart Items */}
            <div className={`p-4 overflow-y-auto flex-grow ${selectedOrderType.toLowerCase() === "takeaway" ? "max-h-[250px]": "max-h-[180px]"}`}>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300 mb-4"
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
                  Your cart is empty
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center mb-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    <div>
                      <span className="font-semibold block">{item.name}</span>
                      <span className="text-gray-600 text-sm">
                        RM {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(item)}
                        className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="font-bold">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Dynamic Sections Based on Order Type */}
            {selectedOrderType.toLowerCase() === "takeaway" && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <h3 className="text-md font-bold mb-3 flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 transition flex items-center justify-center">
                      <span className="text-blue-600 font-medium">Cash</span>
                    </button>
                    <button className="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 transition flex items-center justify-center">
                      <span className="text-blue-600 font-medium">Card</span>
                    </button>
                    <button className="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 transition flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        E-Wallet
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedOrderType.toLowerCase() === "delivery" && (
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-md font-bold mb-3 flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Delivery Address
                  </h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pl-10 bg-white"
                        placeholder="Enter delivery address"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-3 top-3.5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                        placeholder="Contact name"
                      />
                      <input
                        type="text"
                        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                        placeholder="Phone number"
                      />
                    </div>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none h-20 bg-white"
                      placeholder="Delivery instructions (optional)"
                    ></textarea>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="text-md font-bold mb-3 flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 transition flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          Cash on Delivery
                        </span>
                      </button>
                      <button className="flex-1 py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 transition flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          Online Payment
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total and Place Order */}
            <div className="absolute bottom-0 left-0 right-0 bg-white shadow-2xl p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  $ {calculateTotal()}
                </span>
              </div>
              <button
                className="
        w-full py-3 rounded-lg 
        bg-gradient-to-r from-blue-500 to-purple-600 
        text-white font-bold 
        hover:from-blue-600 hover:to-purple-700 
        transition transform hover:scale-105
      "
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashBoard;
