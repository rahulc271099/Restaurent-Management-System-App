const orderItemDB = require("../Models/orderItemModel");
const orderDB = require("../Models/orderModel");

const createOrder = async (req, res) => {
  try {
    const { user_id, order_type, table_id, total_amount, order_items } =
      req.body;

    if (
      !user_id ||
      !order_type ||
      !total_amount ||
      !order_items ||
      order_items.length === 0
    ) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    // Create the order document. Initially, order_items will be an empty array.
    const order = new orderDB({
      user_id,
      order_type,
      table_id: order_type === "dine-in" ? table_id : undefined,
      total_amount,
      order_items: [],
    });

    const savedOrder = await order.save();

    // Create order items documents for each item provided
    const orderItemIds = [];
    for (const item of order_items) {
      if (!item.item_id || !item.quantity || !item.price) {
        return res.status(400).json({
          error: "Each order item must have item_id, quantity, and price",
        });
      }
      const orderItem = new orderDB({
        order_id: savedOrder._id,
        item_id: item.item_id,
        quantity: item.quantity,
        price: item.price,
      });
      const savedOrderItem = await orderItem.save();
      orderItemIds.push(savedOrderItem._id);
    }

    // Update the order with the array of created order item IDs.
    savedOrder.order_items = orderItemIds;
    const updatedOrder = await savedOrder.save();

    return res.status(201).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderDB.find();
    if (orders.length === 0) {
      return res.status(403).json({
        error: "No orders found",
      });
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
    const { orderId } = req.params;
    const updateData = req.body;
    // Note: If you want to update order items, you might need separate logic for that.
    const order = await orderDB.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const updatedOrder = await orderDB.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
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
          updatedOrderItemIds.push(updatedItem._id);
        }
      } else {
        const newItem = new orderItemDB({ order_id: orderId, ...item });
        const savedItem = await newItem.save();
        updatedOrderItemIds.push(savedItem._id);
      }
    }
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

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
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
  updateOrder,
  updateOrderItems,
  deleteOrder,
};
