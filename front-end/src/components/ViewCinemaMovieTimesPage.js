import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import { AppContext } from "../AppContext";
import { useAlert } from "../AlertContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router-dom";

const CinemaMovieTimesPage = () => {
  const { backendDomain } = useContext(AppContext);
  const [movieListings, setMovieListing] = useState([]);
  const { showAlert } = useAlert();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date
  const history = useHistory();
  const location = useLocation();
  const cinemaId = location.state.data || {};

  // Generate 7 days starting from today
  const getNext7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split("T")[0]);
    }
    return dates;
  };

  const [weekDates, setWeekDates] = useState(getNext7Days());

  useEffect(() => {
    const fetchMovieListings = async () => {
      try {
        const today = new Date();
        const startDate = today.toISOString();
        const endDate = new Date(
          today.setDate(today.getDate() + 6)
        ).toISOString();

        const response = await fetch(
          `${backendDomain}/api/v1/movieListing/view-cinema-movie-listings/${cinemaId}?startDate=${startDate}&endDate=${endDate}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();
        setMovieListing(data);
      } catch (error) {
        console.log(error);
        showAlert("Failed to fetch movie listings", "error");
      }
    };

    fetchMovieListings();
  }, [backendDomain, showAlert, cinemaId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const redirectToBooking = (movieId) => {
    history.push("book-movie", { data: movieId });
  };

  const filteredListings = movieListings.filter((listing) => {
    console.log("ShowDate:", listing);
    const listingDate = new Date(listing.showDate).toISOString().split("T")[0];
    console.log(listingDate);
    return listingDate === selectedDate;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Date Filter Carousel */}
      <Box className="flex overflow-x-scroll mb-4" sx={{ gap: 2 }}>
        {weekDates.map((date) => (
          <Button
            key={date}
            variant={date === selectedDate ? "contained" : "outlined"}
            onClick={() => handleDateSelect(date)}
          >
            {new Date(date).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            })}
          </Button>
        ))}
      </Box>

      {/* Movie Listings */}
      <Box className="bg-white border-2 border-black p-4 mb-4">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Movie Listings for {new Date(selectedDate).toLocaleDateString()}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <section className="movie-listings">
            <h2>Showtimes</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <li key={listing._id} className="mb-4">
                      <div className="text-sm mb-2">
                        {listing.movieName} @{" "}
                        {listing.cinemaDetails.operator +
                          " " +
                          listing.cinemaDetails.location}
                        <Button onClick={() => redirectToBooking(listing._id)}>
                          Book now!
                        </Button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No movie listings available for the selected date.</p>
                )}
              </ul>
            )}
          </section>
        </Typography>
      </Box>
    </div>
  );
};

export default CinemaMovieTimesPage;
