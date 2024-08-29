import React, { useState, useContext, useEffect } from "react";
import "../styles/ViewAllMovieListingsPage.css";
// import "../styles/style.css";
// import MainStage from "../MainStage";
import Box from "@mui/material/Box";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const MovieListingsPage = () => {
  const { backendDomain } = useContext(AppContext);
  const [movieListings, setMovieListing] = useState([]);
  const { showAlert } = useAlert();
  const { loading, setLoading } = useState(true);
  const history = useHistory();
  useEffect(() => {
    const fetchMovieListings = async () => {
      try {
        const response = await fetch(
          `${backendDomain}/api/v1/movieListing/show-all-movie-listings`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data);
        setMovieListing(data);
      } catch (error) {
        showAlert("Failed to fetch movie listings", "error");
      } finally {
        // setLoading(false);
      }
    };
    fetchMovieListings();
  }, [backendDomain, showAlert]);
  const handleAction = (movieId) => {
    alert(`Action clicked for movie ID: ${movieId}`);
  };
  const redirectToBooking = () => {
    history.push('book-movie');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movie Listings</h1>
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: {
          xs: "90%",
          sm: "80%",
          md: "60%",
          lg: "40%",
        },
        // bgcolor: "background.paper",
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        top: "30%"
      }}
      className="relative bg-white border-2 border-black shadow-lg p-4 mb-16 transform translate-x-1/2 translate-y-1/2"
      >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <section className="movie-listings">
              <h2>Current Movie Listings</h2>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <ul>
                  {movieListings.length > 0 ? (
                    movieListings.map((listing) => (
                      <li key={listing._id}>
                        <div className="">
                          Cinema: -
                          {listing.cinemaDetails.operator +
                            " " +
                            listing.cinemaDetails.location +
                            " "}
                          Movie: {listing.movieDetails.movieName}
                          <Button onClick={redirectToBooking}>Book now!</Button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p>No movie listings available.</p>
                  )}
                </ul>
              )}
            </section>
          </Typography>
        </Box>
    </div>
  );
};

export default MovieListingsPage;
