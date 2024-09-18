import React from "react";
import { useLocation } from "react-router-dom";
import MainStage from "../MainStage";
import "../../styles/style.css";

const MovieBookingPage = () => {
  console.log("inside movie booking page");
  const location = useLocation();
  const movieListingId = location.state || {};

  console.log(movieListingId);
  return <MainStage />;
};

export default MovieBookingPage;
