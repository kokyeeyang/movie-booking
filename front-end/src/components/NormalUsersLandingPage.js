import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAlert } from "../AlertContext";

const NormalUsersLandingPage = () => {
  // const [bookedTickets, setBookedTickets]
  const history = useHistory();
  const location = useLocation();
  const { backendDomain, user } = useContext(AppContext);
  const { showAlert } = useAlert();

  const userFirstname = user.firstname;
  const redirectToMovieListingsPage = () => {
    history.push("view-all-movie-listings");
  };

  const redirectToCinemaLocationsPage = () => {
    history.push("view-all-cinema-locations");
  };
  return (
    <div className="flex flex-col items-center p-4 mt-4 sm:p-10 mx-4 sm:mx-16 lg:mx-auto lg:mt-10 max-w-screen-lg border-2 border-black lg:border-red-900">
      <h1 className="text-xl sm:text-3xl font-bold mb-4">
        Welcome! {userFirstname}{" "}
      </h1>
      <h2 className="text-lg sm:text-2sm mb-6">
        Here are your movie bookings so far
      </h2>
      <div className="mb-8">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
          onClick={redirectToMovieListingsPage}
        >
          Movie Listings
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
          onClick={redirectToCinemaLocationsPage}
        >
          View all locations
        </button>
      </div>
    </div>
  );
};

export default NormalUsersLandingPage;
