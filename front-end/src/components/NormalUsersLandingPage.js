import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAlert } from "../AlertContext";

const NormalUsersLandingPage = () => {
  // const [bookedTickets, setBookedTickets]
  const history = useHistory();
  const location = useLocation();
  const { backendDomain } = useContext(AppContext);
  const { showAlert } = useAlert();

  console.log(location.state.data);
  const userFirstname = JSON.parse(location.state.data).firstname;

  const handleLogout = () => {
    fetch(`${backendDomain}/api/v1/auth/logout`, { method: "DELETE" }).then(
      (response) => {
        if (response.ok) {
          showAlert("logged out successfully", "success");
          history.push("login");
        } else {
          alert("something went wrong with logging out");
        }
      }
    );
  };
  const redirectToMovieListingsPage = () => {
    history.push("view-all-movie-listings");
  };
  return (
    <div className="landing-page">
      <h1>Welcome! {userFirstname} </h1>
      <h2>Here are your movie bookings so far</h2>
      <div className="movie-bookings"></div>
      <p>
        {/* <Link href={`${backendDomain}/api/v1/auth/logout`}>Logout */}
        <button onClick={redirectToMovieListingsPage}>Movie Listings</button>
      </p>
    </div>
  );
};

export default NormalUsersLandingPage;
