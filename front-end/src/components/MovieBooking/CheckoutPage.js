import React from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

const CheckoutPage = () => {
  // Example seat price for calculating total
  const location = useLocation();
  const { userId, selectedSeats, movieListing } = location.state || {};

  const priceByDay = (date) => {
    if (date.getDay() % 6 === 0) {
      return "Weekend";
    } else if (date.getDay() % 3 === 0) {
      return "Wed";
    } else {
      return "Weekday";
    }
  };

  const date = new Date();

  const day = priceByDay(date);
  console.log(movieListing[0]);

  let seatPrice = 0;
  if (day == "Weekend") {
    seatPrice = 23;
  } else if (day == "Wed") {
    seatPrice = 12;
  } else if (day == "Weekday") {
    seatPrice = 18;
  }

  const selectedSeatsArray = selectedSeats.split(",");
  selectedSeatsArray.map((seat, index) => {
    console.log(seat);
  });
  // const totalPrice = selectedSeats.length * seatPrice;

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 bg-gray-100">
      {/* Movie and Cinema Details */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold">
            {movieListing[0].cinemaDetails.halls.hall_name}
          </h3>
          <p className="text-gray-600">
            Movie: {movieListing[0].movieDetails.movieName}
          </p>
          <p className="text-gray-600">Showtime: {movieListing[0].showTime}</p>
        </div>

        {/* Selected Seats */}
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
        <div className="flex justify-center mt-4">
          <button
            // onClick={onConfirmPurchase}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md w-1/4 hover:bg-blue-700 transition duration-300"
          >
            Confirm Purchase
          </button>
        </div>

        {/* Total Price */}
        <div className="text-lg font-semibold">
          {/* Total: <span className="text-green-600">${totalPrice}</span> */}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
