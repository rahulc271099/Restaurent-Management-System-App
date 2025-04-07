const { default: mongoose, model } = require("mongoose");
const orderItemDB = require("../Models/orderItemModel");
const orderDB = require("../Models/orderModel");
const menuItemDB = require("../Models/menuItemModel");
const paymentDB = require("../Models/paymentModel");

const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log("Received user_id:", req.user?.id);
    console.log("Received body:", req.body);
    const {
      order_type,
      table_id,
      total_amount,
      tax,
      order_items,
      delivery_address,
      contact_info,
      transaction_id,
      gateway_response,
    } = req.body;
    let { payment_method } = req.body;

    if (
      !user_id ||
      !order_type ||
      !total_amount ||
      !order_items ||
      order_items.length === 0
    ) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    // For delivery orders, contact info is required
    if (order_type === "delivery" && !contact_info) {
      return res
        .status(400)
        .json({ error: "Contact info is required for delivery orders" });
    }

    if (order_type === "dine-in") {
      payment_method = "pay-later";
    }

    // Create the order document. Initially, order_items will be an empty array.
    const order = new orderDB({
      user_id,
      order_type,
      table_id: order_type === "dine-in" ? table_id : undefined,
      total_amount,
      tax,
      order_items: [],
      delivery_address,
      contact_info: order_type === "delivery" ? contact_info : undefined, // Only set for delivery
      payment_method,
    });

    if (payment_method === "card") {
      // Now update the payment record to link with this order
      const updatedPayment = await paymentDB.findOneAndUpdate(
        { transaction_id },
        { order_id: order._id },
        { status: "completted" },
        { new: true }
      );

      //if payment was successful, increase sales_count for each item
      if (updatedPayment) {
        for (const item of order_items) {
          await menuItemDB.findByIdAndUpdate(item.item_id, {
            $inc: { salesCount: item.quantity },
          });
        }
      }
    }
    const savedOrder = await order.save();

    // Create order items documents for each item provided
    const orderItemIds = [];
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
      orderItemIds.push(savedOrderItem._id); //store the orderItem _id
    }

    // Update the order with the array of created order item IDs.
    savedOrder.order_items = orderItemIds;
    const updatedOrder = await savedOrder.save();

    // Create a payment entry after the order is placed
    // const paymentStatus = payment_method === "cash" ? "success" : "pending"; // Cash payments are directly marked as success
    let paymentStatus;
    if (order_type === "dine-in") {
      paymentStatus = payment_method === "pay-later" ? "pending" : "success";
    } else if (order_type === "takeaway") {
      paymentStatus =
        payment_method === "online" || payment_method === "card"
          ? "success"
          : "pending"; // Cash is paid immediately, other methods are pending
    } else if (order_type === "delivery") {
      paymentStatus =
        payment_method === "online" || payment_method === "card"
          ? "success"
          : "pending"; // Online payment is instant
    }

    let savedPayment = null; // Declare it at the top

    if (payment_method === "cash" || payment_method === "pay-later") {
      const payment = new paymentDB({
        order_id: savedOrder._id,
        user_id,
        payment_method,
        amount: total_amount,
        tax,
        payment_status: paymentStatus,
        transaction_id: transaction_id || null,
        gateway_response: gateway_response || {},
      });

      savedPayment = await payment.save(); // Assign it here
    }

    return res.status(201).json({
      success: true,
      data: updatedOrder,
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    let orders;
    if (req.user.role === "admin") {
      orders = await orderDB
        .find()
        .populate("user_id", "_id name")
        .populate("table_id", "_id name");
      for (let order of orders) {
        order.order_items = await orderItemDB
          .find({ order_id: order._id })
          .populate("item_id", "name price image");
      }
    } else {
      orders = await orderDB
        .find({ user_id })
        .lean() // Convert to plain JSON
        .populate("user_id", "_id name");
      for (let order of orders) {
        order.order_items = await orderItemDB
          .find({ order_id: order._id })
          .populate("item_id", "name price image");
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

const getNewOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const pendingOrders = await orderDB
      .find({ user_id, status: ["pending", "preparing", "out-to-delivery"] })
      .lean() // Convert to plain JSON
      .populate("user_id", "_id name");
    for (let order of pendingOrders) {
      order.order_items = await orderItemDB
        .find({ order_id: order._id })
        .populate("item_id", "name price image");
    }
    res.status(200).json({
      success: true,
      data: pendingOrders,
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
    });
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

const getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await orderDB.aggregate([
      {
        $match: {
          order_type: { $in: ["dine-in", "takeaway"] },
        },
      },
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "order_id",
          as: "orderedItems",
        },
      },
      {
        $unwind: {
          path: "$orderedItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "menuitems",
          localField: "orderedItems.item_id",
          foreignField: "_id",
          as: "menuDetails",
        },
      },
      {
        $lookup: {
          from: "tables",
          localField: "table_id",
          foreignField: "_id",
          as: "tableInfo",
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "order_id",
          as: "paymentDetails",
        },
      },
      {
        $unwind: {
          path: "$menuDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$paymentDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "paymentDetails.payment_status": "pending", // Only fetch orders with pending payments
        },
      },
      {
        $group: {
          _id: "$_id",
          order_time: { $first: "$order_time" },
          order_type: { $first: "$order_type" },
          total_amount: { $first: "$total_amount" },
          tableInfo: { $first: { $arrayElemAt: ["$tableInfo", 0] } },
          status: { $first: "$status" },
          payment_status: { $first: "$paymentDetails.payment_status" },
          order_items: {
            $push: {
              quantity: "$orderedItems.quantity",
              price: "$orderedItems.price",
              details: "$menuDetails",
            },
          },
        },
      },
    ]);

    if (!pendingOrders.length) {
      return res
        .status(404)
        .json({ error: "No pending orders with pending payments found" });
    }

    return res.status(200).json({
      success: true,
      data: pendingOrders,
    });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getLatestOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch the latest order by sorting in descending order of `createdAt`
    const latestOrder = await orderDB
      .findOne({ user_id })
      .sort({ createdAt: -1 }) // Get the most recent order
      .populate({
        path: "order_items", // Order items reference
        model: "orderItems",
        populate: {
          path: "item_id", // Menu item reference inside order_items
          model: "menuItems", // Make sure this is your correct model name
          select: "name image price", // Select only necessary fields
        },
      })
      .exec();
    console.log("Latest Order:", latestOrder);

    if (!latestOrder) {
      return res.status(404).json({ error: "No orders found" });
    }

    return res.status(200).json({ success: true, data: latestOrder });
  } catch (error) {
    console.error("Error fetching latest order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
    const order = await orderDB.findById(orderId);
    const previousStatus = order.status; //store previous status
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
    //update sales count
    if (
      previousStatus !== "completed" &&
      status.toLowerCase() === "completed"
    ) {
      for (const item of order.order_items) {
        await menuItemDB.findByIdAndUpdate(item.item_id, {
          $inc: { salesCount: item.quantity },
        });
      }
    }
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
  getNewOrders,
  getOneOrder,
  getPendingOrders,
  getLatestOrder,
  getOrderItems,
  updateOrder,
  updateOrderItems,
  deleteOrderItem,
  deleteOrder,
};
