import React, { useState, useContext, useEffect } from "react";
import "../styles/ViewAllMovieListingsPage.css";
import Box from "@mui/material/Box";
import { AppContext } from "../src/AppContext";
import { useAlert } from "../src/AlertContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import {useRouter} from "next/navigation";

interface MovieListingProps {
  _id: string;
  cinemaDetails :{
    operator: string;
    location: string;
  };
  movieDetails : {
    movieName: string;
  };
  showTime: string;
}

const MovieListingsPage = () => {
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || process.env.BACKEND_DOMAIN || "http://localhost:5000";
  const [movieListings, setMovieListing] = useState<MovieListingProps[]>([]);
  const { showAlert } = useAlert();

  const [ loading, setLoading ] = useState(true);
  const router = useRouter();
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
        setMovieListing(data);
        console.log(data);
      } catch (error) {
        console.log(error);
        showAlert("Failed to fetch movie listings", "error");
      } finally {
        // setLoading(false);
      }
    };
    fetchMovieListings();
  }, [backendDomain, showAlert]);

  const redirectToBooking = (movieId: string) => {
    router.push(`book-movie?movieId=${movieId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <Box className="bg-white border-2 border-black p-4 mb-4">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Movie Listings
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
                      <div className="text-sm">
                        Cinema:
                        {listing.cinemaDetails.operator +
                          " " +
                          listing.cinemaDetails.location +
                          " "}
                        Movie: {listing.movieDetails.movieName + " "}
                        {listing.showTime}
                        <Button onClick={() => redirectToBooking(listing._id)}>
                          Book now!
                        </Button>
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
