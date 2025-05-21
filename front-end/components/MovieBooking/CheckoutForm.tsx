"use client"; // This line is necessary for Next.js client components

import React, { useEffect, useState, useContext } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
// import { AppContext } from "../../AppContext";
import { AppContext, useAppContext } from "@/AppContext";
import { useRouter } from "next/navigation"; // Use Next.js router for navigation
import {useSearchParams} from "next/navigation";
import{addPoints, getUserPoints} from "../../src/utils/blockchain";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const {user, backendDomain} = useAppContext();
  const [blockchainPoints, setBlockchainPoints] = useState("");
  
  const [numberOfTickets1, setNumberOfTickets1] = useState(0);
  const [numberOfTickets2, setNumberOfTickets2] = useState(0);
  const [totalStudentPrice, setTotalStudentPrice] = useState(0);
  const [totalSeniorPrice, setTotalSeniorPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [originalTotalPrice, setOriginalTotalPrice] = useState(0);

  const searchParams = useSearchParams();
  const selectedSeats = searchParams.get("selectedSeats");
  const movieListing = JSON.parse(localStorage.getItem('movieListing') ?? 'null');

  if (!movieListing || !movieListing[0]) {
    return <div className="p-4 text-red-500">Missing movie listing info.</div>;
  }

  const router = useRouter();
  // const { selectedSeats, movieListing } = router.query; // Fetch query params from URL
  console.log(selectedSeats);
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

  const updateUserPoints = async () => {
    try {
      const res = await fetch(`${backendDomain}/api/v1/membershipPoints/get-user-points`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      setTotalPoints(data.totalPoints);
    } catch (error){
      console.error("Error fetching user points:", error);
    }
  }

  useEffect(() => {
    const fetchBlockchainPoints = async () => {
      try {
        const points = await getUserPoints();
        setBlockchainPoints(points);
        console.log("Blockchain Points: ", points);
      } catch (err){
        console.error("Error fetching blockchain points: ", err);
      }
    }

    fetchBlockchainPoints();
  }, [user?.userId]);
  
  useEffect(() => {
    const regularPriceTickets = seatPrice * totalSeats;
    updateUserPoints();
    setTotalPrice(regularPriceTickets);
    setOriginalTotalPrice(regularPriceTickets);
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

      try {
        let res = await fetch(`${backendDomain}/api/v1/movieListing/book-seats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            movieListingId: movieListing[0]?._id,
            seatIds: selectedSeatsArray,
            userId: user?.userId
          }),
        });
      
        const data = await res.json();
        if (!res.ok) {
          console.error("Booking failed:", data);
        } else {
          console.log("Booking success:", data);
        }
        try {
          await addPoints(Math.round(totalPrice * 100));
          console.log("Points written to blockchain");
        } catch (err) {
          console.error("Error writing points to blockchain:", err);
        }
      } catch (err) {
        console.error("Network or server error:", err);
      }
      alert("Payment successful!");

      await fetch(`${backendDomain}/api/v1/booking/create-booking`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.userId,
          movieListingId: movieListing[0]?._id,
          movieTitle: movieListing[0]?.movieName,
          cinemaId: movieListing[0]?.cinema,
          hallName: movieListing[0]?.hallName,
          seats: selectedSeatsArray,
          bookingDate: movieListing[0]?.showDate,
          timeSlot: movieListing[0]?.showTime,
          totalPrice: totalPrice,
          studentSeat: numberOfTickets1,
          seniorSeat: numberOfTickets2,
          paymentId: paymentIntent.id
        })
      });

      let res = await fetch(`${backendDomain}/api/v1/membershipPoints/update-membership-points`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId : user?.userId,
          amountInCents: totalPrice * 100,
          redemptionAmount: pointsToRedeem
        })
      })
      // router.push('homepage');
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
            Movie: {movieListing[0].movieName}
          </p>
          <p className="text-gray-600">Showtime: {movieListing[0].showTime}</p>
          <p className="text-gray-600">Hall : {movieListing[0].hallName}</p>
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
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Total Price</h3>
          <p className="text-xl font-bold text-green-600">
            RM {totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="mt-4 border-t pt-4">
          <h2 className="text-lg font-semibold">Redeem Membership Points</h2>

          <p className="text-sm text-gray-600">
            You have <span className="font-bold">{totalPoints}</span> points available.
          </p>

          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min="0"
              max={totalPoints}
              value={pointsToRedeem}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), totalPoints);
                setPointsToRedeem(val);

                const discount = val * 0.0001;
                setDiscountAmount(discount);

                setTotalPrice(
                  Math.max(originalTotalPrice - discount, 0)
                );
              }}
              className="w-28 border px-2 py-1 rounded"
            />
            <span className="text-sm text-gray-700">points</span>
          </div>

          <p className="mt-1 text-sm text-green-600">
            Discount applied: ${discountAmount.toFixed(2)}
          </p>
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
