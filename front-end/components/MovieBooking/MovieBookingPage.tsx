import React, { useState, useContext, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { useRouter } from "next/router";
import MainStage from "../MainStage";
import "../../styles/style.css";
import { useAppContext, AppContext } from "../../src/AppContext";
import { useAlert } from "../../src/AlertContext";

const MovieBookingPage = () => {
  const { backendDomain } = useAppContext();
  const { showAlert } = useAlert();
  const [movieListing, setMovieListing] = useState(null);
  const router = useRouter();
  // const movieListingId = location.state || {};

  const movieListingId = router.query?.movieListingId as string | undefined;
  
  useEffect(() => {
    if (!movieListingId) {
      return;
    }
    const fetchMovieListing = async () => {
      try {
        const response = await fetch(
          `${backendDomain}/api/v1/movieListing/show-movie-listing/${movieListingId}`,
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
    fetchMovieListing();
  }, [backendDomain, movieListingId, showAlert]);
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
