const { default: mongoose } = require("mongoose");
const orderItemDB = require("../Models/orderItemModel");
const orderDB = require("../Models/orderModel");
const menuItemDB = require("../Models/menuItemModel");
const paymentDB = require("../Models/paymentModel");

const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("Received user_id:", req.user?.id);
    console.log("Received body:", req.body);
    const { order_type, table_id, total_amount, order_items,delivery_address,contact_info,payment_method,transaction_id,gateway_response } = req.body;

    if (
      !user_id ||
      !order_type ||
      !total_amount ||
      !order_items ||
      order_items.length === 0 ||
      !contact_info ||
      !payment_method
    ) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const orderItemIds = order_items.map((item) => item.item_id);

    // Create the order document. Initially, order_items will be an empty array.
    const order = new orderDB({
      user_id,
      order_type,
      table_id: order_type === "dine-in" ? table_id : undefined,
      total_amount,
      order_items: orderItemIds,
      delivery_address,
      contact_info,
      payment_method,
    });

    const savedOrder = await order.save();

    // Create order items documents for each item provided
    for (const item of order_items) {
      if (!item.item_id || !item.quantity || !item.price) {
        return res.status(400).json({
          error: "Each order item must have item_id, quantity, and price",
        });
      }
      const orderItem = new orderItemDB({
        order_id: savedOrder._id,
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.price,
      });
      const savedOrderItem = await orderItem.save();
    }

    // Update the order with the array of created order item IDs.
    const updatedOrder = await savedOrder.save();

    // Create a payment entry after the order is placed
    const paymentStatus = payment_method === "cash" ? "success" : "pending"; // Cash payments are directly marked as success
    const payment = new paymentDB({
      order_id: savedOrder._id,
      user_id,
      payment_method,
      amount: total_amount,
      payment_status: paymentStatus,
      transaction_id: transaction_id || null,
      gateway_response: gateway_response || {},
    });

    const savedPayment = await payment.save();

    return res.status(201).json({
      success: true,
      data: updatedOrder,
      payment:savedPayment,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    // let orders = await orderDB.find({ user_id }).lean(); // Convert to plain JSON
    // for (let order of orders) {
    //   order.order_items = await orderItemDB
    //     .find({ order_id: order._id })
    //     .populate("item_id", "name price");
    // }

    // if (req.user.role === "admin") {
    //   orders = await orderDB.find().populate("user_id", "_id name");
    // }

    let orders;
    if (req.user.role === "admin") {
      orders = await orderDB
        .find()
        .populate("user_id", "_id name")
        .populate("table_id", "_id name");
      for (let order of orders) {
        order.order_items = await orderItemDB
          .find({ order_id: order._id })
          .populate("item_id", "name price");
      }
    } else {
      orders = await orderDB
        .find({ user_id })
        .lean() // Convert to plain JSON
        .populate("user_id", "_id name");
      for (let order of orders) {
        order.order_items = await orderItemDB
          .find({ order_id: order._id })
          .populate("item_id", "name price");
      }
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOneOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderDB.findById(orderId);
    if (!order) {
      return res.status(403).json({
        error: "No order found",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    let { orderId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid Order ID format" });
    }

    orderId = new mongoose.Types.ObjectId(orderId);
    // const updatedData = req.body;
    const { status, total_amount } = req.body;
    // Note: If you want to update order items, you might need separate logic for that.
    // const order = await orderDB.findById(orderId);
    const order = await orderDB.findById(orderId);
    // console.log(order);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const updatedOrder = await orderDB.findByIdAndUpdate(
      orderId,
      { status, total_amount },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderItems } = req.body; // Expect an array of order item objects
    console.log(orderItems);
    if (!orderItems || !Array.isArray(orderItems)) {
      return res
        .status(400)
        .json({ error: "Order items must be provided as an array" });
    }
    const updatedOrderItemIds = [];

    for (const item of orderItems) {
      if (item._id) {
        const updatedItem = await orderItemDB.findByIdAndUpdate(
          item._id,
          item,
          { new: true }
        );
        if (updatedItem) {
          console.log(updatedItem);
          updatedOrderItemIds.push(updatedItem._id);
        }
      } else {
        const itemId =
          typeof item.item_id === "object" ? item.item_id._id : item.item_id;

        if (!itemId) {
          return res
            .status(400)
            .json({ error: "Invalid item format. item_id is required" });
        }
        console.log(itemId);
        //get price details for newly added item
        let itemPrice = item.price;
        if (!itemPrice) {
          const menuItem = await menuItemDB.findById(itemId); // Fetch item from menu
          if (!menuItem) {
            return res.status(400).json({ error: "Menu item not found" });
          }
          itemPrice = menuItem.price; // Assign price from menu item
        }
        //ensure itemId is a valid ObjectId
        const validItemId = new mongoose.Types.ObjectId(itemId);
        const newItem = new orderItemDB({
          order_id: orderId,
          item_id: validItemId,
          quantity: item.quantity,
          price: itemPrice,
        });
        console.log(newItem);
        const savedItem = await newItem.save();
        updatedOrderItemIds.push(savedItem._id);
      }
    }
    console.log("Updated Order Item IDs:", updatedOrderItemIds);
    const updatedOrder = await orderDB.findByIdAndUpdate(
      orderId,
      { order_items: updatedOrderItemIds },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: {
        order: updatedOrder,
        orderItems: updatedOrderItemIds,
      },
    });
  } catch (error) {
    console.error("Error updating order items:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderItems = await orderItemDB.find({ order_id: orderId });
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

const deleteOrderItem = async (req, res) => {
  try {
    const { orderId, orderItemId } = req.params; // Extract IDs from request parameters
    console.log(orderId, orderItemId);

    // Find the order to ensure it exists
    const order = await orderDB.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const orderItem = await orderItemDB.findOne({ item_id: orderItemId });
    if (!orderItem) {
      return res.status(404).json({ error: "Order item not found" });
    }
    // Find and delete the order item
    const delettedItem = await orderItemDB.findOneAndDelete({
      item_id: orderItemId,
    });

    // Remove the order item reference from the order
    await orderDB.findByIdAndUpdate(orderId, {
      $pull: { order_items: orderItemId },
    });

    res
      .status(200)
      .json({ success: true, message: "Order item deleted successfully" });
  } catch (error) {
    console.error("Error deleting order item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(orderId);
    const order = await orderDB.findById(orderId);
    if (!order) {
      return res.status(400).json({
        error: "Order not found",
      });
    }
    const delettedOrder = await orderDB.findByIdAndDelete(orderId);
    res.status(200).json({
      success: true,
      data: delettedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOneOrder,
  getOrderItems,
  updateOrder,
  updateOrderItems,
  deleteOrderItem,
  deleteOrder,
};
