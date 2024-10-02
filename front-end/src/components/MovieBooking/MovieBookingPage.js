import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MainStage from "../MainStage";
import "../../styles/style.css";
import { AppContext } from "../../AppContext";
import { useAlert } from "../../AlertContext";

const MovieBookingPage = () => {
  const { backendDomain } = useContext(AppContext);
  const { showAlert } = useAlert();
  const [movieListing, setMovieListing] = useState(null);
  const location = useLocation();
  const movieListingId = location.state || {};

  console.log(movieListingId.data);

  useEffect(() => {
    const fetchMovieListing = async () => {
      try {
        const response = await fetch(
          `${backendDomain}/api/v1/movieListing/show-movie-listing/${movieListingId.data}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setMovieListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (movieListingId.data) {
      fetchMovieListing();
    }
  }, [backendDomain, movieListingId.data, showAlert]);
  // return <MainStage movieListing={movieListing} />;
  return (
    <>
      {movieListing ? (
        <MainStage movieListing={movieListing} />
      ) : (
        <div>Loading movie listing...</div>
      )}
    </>
  );
};

export default MovieBookingPage;
