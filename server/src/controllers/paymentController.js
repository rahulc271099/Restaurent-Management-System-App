const paymentDB = require("../Models/paymentModel");
// const Stripe = require("stripe");
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    // Create a Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      transaction_id: paymentIntent.id, // Send transaction ID to frontend
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const {
      payment_id,
      amount,
      transaction_id,
      payment_status,
      gateway_response,
    } = req.body;
    const user_id = req.user.id;

    // Save payment in DB (without order_id for now)
    const payment = new paymentDB({
      user_id,
      amount,
      payment_method: "card",
      payment_status,
      transaction_id, // Store transaction_id
      gateway_response,
    });

    await payment.save();

    res.json({ message: "Payment confirmed", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error confirming payment" });
  }
};

const updatePaymentStatus = async (req, res) => {
    try {
      const { orderId } = req.params; // Get order ID from URL params
      const { newStatus } = req.body; // New payment status (e.g., "completed")
  
      if (!newStatus) {
        return res.status(400).json({ error: "Payment status is required" });
      }
  
      // Update the payment status in the "payments" collection
      const updatedPayment = await paymentDB.findOneAndUpdate(
        { order_id: orderId }, // Find payment by order ID
        { $set: { payment_status: newStatus } }, // Update status
        { new: true } // Return updated document
      );
  
      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment record not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Payment status updated successfully",
        data: updatedPayment,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };

module.exports = { createPaymentIntent, confirmPayment, updatePaymentStatus};
