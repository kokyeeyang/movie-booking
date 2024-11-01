import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QDe7hJBWqEZm7T0TlvqYyNmp9PMGEQpdCMkopTfyg9ClHw5jhPk6Ya6A48OOq75NNTJNscFyu34fwcJ5Vt3P6jL00Rxor7Kro"
); // Replace with your Stripe Publishable Key

const StripeCheckout = ({ totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Fetch Payment Intent client secret from backend
    const response = await fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalPrice: totalPrice, currency: "RM" }),
    });
    const { clientSecret } = await response.json();

    const cardElement = elements.getElement(CardElement);
    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: "Customer Name",
        },
      },
    });

    if (paymentResult.error) {
      setError(`Payment failed: ${paymentResult.error.message}`);
      setIsProcessing(false);
    } else if (paymentResult.paymentIntent.status === "succeeded") {
      setError(null);
      setIsProcessing(false);
      alert("Payment successful!");
      // Additional logic to update your Orders and Payments tables
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default function StripeWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckout totalPrice={2300} /> {/* Example total price */}
    </Elements>
  );
}
