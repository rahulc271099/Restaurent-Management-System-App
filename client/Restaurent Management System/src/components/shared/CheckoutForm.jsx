import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import {
  confirmPayment,
  createPaymentIntent,
} from "../../services/paymentServices";

const CheckoutForm = ({ amount, userId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create Payment Intent
      const response = await createPaymentIntent({
        user_id: userId,
        amount,
        payment_method: "card",
      });
      const { clientSecret, payment_id } = await response.data

      // Step 2: Process Stripe Payment
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        setMessage("Payment failed! Order not placed.");
        setLoading(false);
        return;
      }

      // Step 3: Confirm payment in backend
      await confirmPayment({
        payment_id,
        amount,
        transaction_id: paymentIntent.id,
        payment_status: "success",
        gateway_response: paymentIntent,
      });

      // Step 4: Notify Parent Component
      onPaymentSuccess(paymentIntent); // This will trigger order creation in the parent component

      setMessage("Payment successful!");
      setLoading(false);
    } catch (error) {
      setMessage("Something went wrong!");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white shadow-xl rounded-2xl max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Enter Payment Details
      </h2>

      <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#333",
                fontFamily: "Arial, sans-serif",
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full mt-6 py-3 rounded-lg text-white font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {message && <p className="mt-3 text-center text-red-500">{message}</p>}
    </form>
  );
};

export default CheckoutForm;

// 4242424242424242