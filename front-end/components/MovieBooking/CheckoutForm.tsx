"use client"; // This line is necessary for Next.js client components

import React, { useEffect, useState, useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { AppContext } from "../../AppContext";
import { AppContext, useAppContext } from "@/AppContext";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import {useSearchParams} from "next/navigation";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  // const { user, backendDomain } = useContext(AppContext); // Context for user and backend URL
  const appContext = useContext(AppContext);
  // const backendDomain = appContext?.backendDomain || process.env.BACKEND_DOMAIN_URL || "http://localhost:5000";
  const {user, backendDomain} = useAppContext();
  const [numberOfTickets1, setNumberOfTickets1] = useState(0);
  const [numberOfTickets2, setNumberOfTickets2] = useState(0);
  const [totalStudentPrice, setTotalStudentPrice] = useState(0);
  const [totalSeniorPrice, setTotalSeniorPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const searchParams = useSearchParams();
  const selectedSeats = searchParams.get("selectedSeats");
  const movieListing = JSON.parse(searchParams.get("movieListing") || "[]");

  const router = useRouter();
  // const { selectedSeats, movieListing } = router.query; // Fetch query params from URL

  const selectedSeatsArray = selectedSeats ? selectedSeats.split(",") : [];
  const totalSeats = selectedSeatsArray.length;
  const date = new Date();

  const priceByDay = (date: Date) => {
    if (date.getDay() === 6 || date.getDay() === 0) {
      return "Weekend";
    } else if (date.getDay() === 3) {
      return "Wed";
    } else {
      return "Weekday";
    }
  };

  let seatPrice = 0;
  const day = priceByDay(date);
  if (day === "Weekend") seatPrice = 23;
  else if (day === "Wed") seatPrice = 12;
  else if (day === "Weekday") seatPrice = 18;

  let calculatedStudentPrice = seatPrice * 0.7;
  let calculatedSeniorPrice = seatPrice * 0.5;

  const handleNumberOfTickets1Change = (e: any) => {
    const value = parseInt(e.target.value, 10);
    let calculatedRegularPrice = (totalSeats - value - numberOfTickets2) * seatPrice;

    setTotalStudentPrice(value * calculatedStudentPrice);
    setNumberOfTickets1(value);

    if (value + numberOfTickets2 > totalSeats) {
      setNumberOfTickets2(0);
    }

    setTotalPrice(totalSeniorPrice + value * calculatedStudentPrice + calculatedRegularPrice);
  };

  const handleNumberOfTickets2Change = (e: any) => {
    const value = parseInt(e.target.value, 10);
    let calculatedRegularPrice = (totalSeats - value - numberOfTickets1) * seatPrice;

    setTotalSeniorPrice(value * calculatedSeniorPrice);
    setNumberOfTickets2(value);

    if (value + numberOfTickets1 > totalSeats) {
      setNumberOfTickets1(0);
    }

    setTotalPrice(totalStudentPrice + value * calculatedSeniorPrice + calculatedRegularPrice);
  };

  useEffect(() => {
    const regularPriceTickets = seatPrice * totalSeats;
    setTotalPrice(regularPriceTickets);
  }, [seatPrice, totalSeats]);

  const confirmPayment = async (clientSecret: string) => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement not loaded");
      return;
    }

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: user?.firstname + " " + user?.lastname,
        },
      },
    });

    if (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      alert("Payment successful!");
    }
  };

  const onConfirmPurchase = async () => {
    let seniorTicketPrice = 0;
    let studentTicketPrice = 0;

    if (numberOfTickets1) studentTicketPrice = seatPrice * 0.7;
    if (numberOfTickets2) seniorTicketPrice = seatPrice * 0.5;

    let totalPrice =
      studentTicketPrice * numberOfTickets1 +
      seniorTicketPrice * numberOfTickets2 +
      seatPrice * (totalSeats - numberOfTickets1 - numberOfTickets2);

    try {
      const response = await fetch(`${backendDomain}/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalPrice: totalPrice,
          currency: "myr",
        }),
      });

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("Failed to initialize payment. Please try again.");
      }

      confirmPayment(clientSecret);
    } catch (error) {
      console.error("Error confirming purchase:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            {movieListing?.cinemaDetails?.halls?.hall_name}
          </h3>
          <p className="text-gray-600">
            Movie: {movieListing?.movieDetails?.movieName}
          </p>
          <p className="text-gray-600">Showtime: {movieListing?.showTime}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Selected Seats</h3>
          <ul className="list-disc list-inside">
            {selectedSeatsArray.map((seat, index) => (
              <li key={index} className="text-gray-700">
                {seat}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <label className="font-bold" htmlFor="ticketClass1">
            Ticket class
          </label>
          <select id="ticketClass1" name="ticketClass1" disabled>
            <option value="Student">Student</option>
          </select>
          <label className="font-bold" htmlFor="ticketClass1">
            Number of tickets
          </label>
          <select
            id="numberOfTickets1"
            name="numberOfTickets1"
            onChange={handleNumberOfTickets1Change}
            value={numberOfTickets1}
          >
            <option value="0">Select a seat</option>
            {Array.from({ length: totalSeats - numberOfTickets2 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="font-bold" htmlFor="ticketClass2">
            Ticket class
          </label>
          <select id="ticketClass2" name="ticketClass2" disabled>
            <option value="Senior">Senior</option>
          </select>
          <label className="font-bold" htmlFor="ticketClass2">
            Number of tickets
          </label>
          <select
            id="numberOfTickets2"
            name="numberOfTickets2"
            onChange={handleNumberOfTickets2Change}
            value={numberOfTickets2}
          >
            <option value="0">Select a seat</option>
            {Array.from({ length: totalSeats - numberOfTickets1 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">Total Price</h3>
          <div className="text-lg font-semibold">
            Total: <span className="text-green-600">${totalPrice}</span>
          </div>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
            width: "300px",
          }}
        >
          <CardElement />
        </div>

        <div className="flex md:justify-start justify-center mt-4">
          <button
            onClick={onConfirmPurchase}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md w-1/3 md:w-1/5 hover:bg-blue-700 transition duration-300"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
