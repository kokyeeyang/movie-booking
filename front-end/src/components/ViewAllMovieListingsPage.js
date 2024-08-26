import React, { useState, useContext, useEffect } from "react";
import "../styles/ViewAllMovieListingsPage.css";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";

// const movieListings = [
//   { id: 1, title: "Inception", cinema: "Cinema 1", time: "7:00 PM" },
//   { id: 2, title: "Interstellar", cinema: "Cinema 2", time: "8:30 PM" },
//   { id: 3, title: "The Dark Knight", cinema: "Cinema 3", time: "9:00 PM" },
// ];

const MovieListingsPage = () => {
  const { backendDomain } = useContext(AppContext);
  const [movieListings, setMovieListing] = useState([]);
  const { showAlert } = useAlert();
  // const { loading, setLoading } = useState(true);
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
        console.log(movieListings);

        // movieListings.map((listing) => {
        //   console.log(listing.cinemaDetails.location);
        // });
        // console.log(movieListings);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Movie Listings</h1>
      <ul className="space-y-4">
        {movieListings.map((movieListing) => {
          <li key={movieListing._id}>{movieListing.movieDetails.ageRating}</li>;
        })}
      </ul>
    </div>
  );
};

export default MovieListingsPage;
