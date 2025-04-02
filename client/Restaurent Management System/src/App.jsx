import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

function App() {
  // const stripePromise = loadStripe(import.meta.env.STRIPE_PUBLISHABLE_KEY);
  const stripePromise = loadStripe("pk_test_51Qy7BkGKjpT4QTRLXpE0i1hF2YgCstfNbXOIxjWybW0uIEXsKSnsPnnTjsjbL8suVw0NYNgKiX6fvloqnFlB9oqp00ksu21pRT")
  return (
    <>
      <Elements stripe={stripePromise}>
        <RouterProvider router={router} />
      </Elements>
    </>
  );
}

export default App;
