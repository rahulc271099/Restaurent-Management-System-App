import React, { useEffect, useState } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiClock,
} from "react-icons/fi";
import {
  deleteOrder,
  getOrders,
  updateOrder,
  updateOrderItems,
} from "../../services/orderServices";
import { getMenuItems } from "../../services/menuServices";
import { toast } from "react-toastify";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    customer: "",
    date: new Date().toISOString().split("T")[0],
    items: 0,
    menu_items: [],
    quantity: 0,
    table_id: "",
    total_amount: 0,
    status: "Pending",
  });

  useEffect(() => {
    getOrders()
      .then((res) => {
        console.log(res);
        setOrders(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getMenuItems()
      .then((res) => {
        console.log(res);
        setMenuItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Handle order creation
  const handleAddOrder = () => {
    setShowAddModal(false);
    setFormData({
      customer: "",
      date: new Date().toISOString().split("T")[0],
      items: 0,
      menu_items: [],
      total_amount: 0,
      status: "Pending",
    });
  };

  // Handle edit order
  const handleEditOrder = async () => {
    try {
      // Convert menu_items to order_items
      // const formattedOrderData = {
      //   ...formData,
      //   order_items: formData.menu_items, // Rename menu_items to order_items
      // };

      // delete formattedOrderData.menu_items; // Remove menu_items to avoid duplication

      // Update Order Details
      await updateOrder(
        { status: formData.status, total_amount: formData.total_amount },
        currentOrder._id
      );
      console.log(formData);
      // Update Order Items
      if (formData.menu_items.length > 0) {
        const itemsToUpdate = formData.menu_items.map((item) => ({
          _id: item._id || undefined, // If existing, keep _id; otherwise, null for new items
          item_id: item.item_id?._id || item.item_id,
          quantity: item.quantity,
          price: item.price,
        }));

        await updateOrderItems({ orderItems: itemsToUpdate }, currentOrder._id);
      }
      toast.success("Order updated successfully");
      // Fetch updated orders
      const updatedOrders = await getOrders();
      setOrders(updatedOrders.data.data);

      // Close modal
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating order:", err);
      toast.error(err.response.data.error);
    }
  };

  // Handle delete order
  const handleDeleteOrder = () => {
    deleteOrder()
      .then((res) => {
        console.log(res);
        return getOrders();
      })
      .then((response) => {
        console.log(response);
        setOrders(response.data.data);
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Open edit modal with current order data
  const openEditModal = (order) => {
    setCurrentOrder(order);
    setFormData({
      customer: order.user_id.name,
      date: new Date(order.order_time).toISOString().slice(0, 16),
      total_amount: order.total_amount,
      items: order.order_items.length,
      menu_items: order.order_items,
      status: order.status,
    });
    setShowEditModal(true);
  };

  // Open delete modal with current order
  const openDeleteModal = (order) => {
    setCurrentOrder(order);
    setShowDeleteModal(true);
  };

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(
        (o) =>
          o.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.status?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle menu item change
  const handleMenuItemChange = (item) => {
    const existingItem = formData.menu_items.find(
      (menuItem) => menuItem.item_id._id === item._id
    );

    let updatedItems;

    if (existingItem) {
      // Remove item if already selected
      updatedItems = formData.menu_items.filter(
        (menuItem) => menuItem.item_id._id !== item._id
      );
    } else {
      // Add item with default quantity = 1
      updatedItems = [
        ...formData.menu_items,
        { item_id: { ...item }, quantity: 1 },
      ];
    }

    // Calculate new total amount
    const newTotal = updatedItems.reduce(
      (sum, menuItem) => sum + menuItem.item_id.price * menuItem.quantity,
      0
    );

    setFormData({
      ...formData,
      menu_items: updatedItems,
      total_amount: newTotal,
    });
  };

  //handle menu item quantity change
  const handleMenuItemQuantityChange = (item, quantity) => {
    let updatedItems = formData.menu_items.map((menuItem) =>
      menuItem.item_id._id === item._id
        ? { ...menuItem, quantity: parseInt(quantity, 10) }
        : menuItem
    );

    // Remove items if quantity is set to 0
    updatedItems = updatedItems.filter((menuItem) => menuItem.quantity > 0);

    // Recalculate total amount
    const newTotal = updatedItems.reduce(
      (sum, menuItem) => sum + menuItem.item_id.price * menuItem.quantity,
      0
    );

    setFormData({ ...formData, menu_items: updatedItems, total: newTotal });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="h-full">
      {/* Header with search and add button */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Search orders by customer or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 flex items-center"
        >
          <FiPlus className="mr-2" />
          Add New Order
        </button>
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Items
                </th>
                <th scope="col" className="px-6 py-3">
                  Table
                </th>
                <th scope="col" className="px-6 py-3">
                  Order type
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{order._id.toString().padStart(4, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-400" />
                      {order.user_id.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-gray-400" />
                      {/* {order.order_time} */}
                      {new Date(order.order_time).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid items-center whitespace-nowrap">
                      {/* <FiPackage className="mr-2 text-gray-400" /> */}
                      {/* {order.items} */}
                      {order.order_items.map((item) => (
                        <p key={item.item_id._id} className="flex items-center">
                          <FiPackage className="mr-2 text-gray-400" />
                          {item ?.item_id.name}
                        </p>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center whitespace-nowrap">
                      <FiPackage className="mr-2 text-gray-400" />
                      {order.table_id?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center whitespace-nowrap">
                      <FiPackage className="mr-2 text-gray-400" />
                      {order.order_type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FiDollarSign className="mr-1 text-gray-400" />
                      {formatCurrency(order.total_amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="px-6 py-4 flex items-center justify-center space-x-3">
                      <button
                        onClick={() => openEditModal(order)}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(order)}
                        className="font-medium text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr className="bg-white border-b">
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Add New Order
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    placeholder="Name"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiCalendar className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Items
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiPackage className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="items"
                    value={formData.items}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiClock className="text-gray-400" />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Add Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Order</h3>
            </div>
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer"
                  value={formData.customer}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Items
                </label>
                <input
                  type="number"
                  name="items"
                  value={formData.items}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  min="1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <input
                  type="number"
                  name="total"
                  value={formData.total_amount}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="out-to-delivery">Out to delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {/* Menu Items Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Menu Items
                </label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {menuItems?.map((item) => {
                    const selectedItem = formData.menu_items?.find(
                      (menuItem) => menuItem.item_id._id === item._id
                    );
                    return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between border p-2 rounded-md"
                      >
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            value={item._id}
                            checked={!!selectedItem}
                            onChange={() => handleMenuItemChange(item)}
                            className="mr-2"
                          />
                          {item.name}-₹{item.price}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={selectedItem?.quantity || 0}
                          onChange={(e) =>
                            handleMenuItemQuantityChange(item, e.target.value)
                          }
                          className="w-16 border border-gray-300 rounded-md text-center"
                          disabled={!selectedItem} // Disable if item is not selected
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleEditOrder}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Order Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm Delete
              </h3>
            </div>
            <div className="px-6 py-4 text-gray-700">
              Are you sure you want to delete this order?
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-white border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
