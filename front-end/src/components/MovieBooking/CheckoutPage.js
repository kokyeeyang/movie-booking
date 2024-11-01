import React from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { AppContext } from "../../AppContext";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QDe7hJBWqEZm7T0TlvqYyNmp9PMGEQpdCMkopTfyg9ClHw5jhPk6Ya6A48OOq75NNTJNscFyu34fwcJ5Vt3P6jL00Rxor7Kro"
); // Replace with your Stripe Publishable Key

const CheckoutPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;
