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
  const [filteredListings, setFilteredListings] = useState([]);
  const { showAlert } = useAlert();
  // const [selectedShowtime, setSelectedShowtime] = useState(null);
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
        // const startDate = today.toISOString();
        // const endDate = new Date(
        //   today.setDate(today.getDate() + 6)
        // ).toISOString();
        const response = await fetch(
          `${backendDomain}/api/v1/movieListing/view-cinema-movie-listings/${cinemaId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const moviesData = await response.json();
        setMovieListing(moviesData);
      } catch (error) {
        console.log(error);
        showAlert("Failed to fetch movie listings", "error");
      }
    };

    fetchMovieListings();
  }, [backendDomain, showAlert, cinemaId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    console.log(date);
    // Filter movie listings for the selected date
    const updatedListings = movieListings
      .map((listing) => {
        const filteredShowDates = listing.showDates.filter((showDate) => {
          let listingDate = new Date(showDate).toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
          return listingDate === date;
        });
        if (filteredShowDates.length > 0) {
          return {
            ...listing,
            showDates: filteredShowDates,
            showTimes: listing.showTimes,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);
    console.log(updatedListings);
    setFilteredListings(updatedListings);
  };

  const redirectToBooking = (movieId) => {
    history.push("book-movie", { data: movieId });
  };

  // const filteredListings = movieListings.filter((listing) => {
  //   listing.showDates.forEach((showDate) => {
  //     let listingDate = new Date(showDate).toISOString().split("T")[0];
  //     return listingDate === selectedDate;
  //   });
  // });

  // const filteredListings = movieListings.filter((listing) =>
  //   listing.showDates.some((showDate) => {
  //     let listingDate = new Date(showDate).toString().split("T")[0];
  //     return listingDate === selectedDate;
  //   })
  // );
  console.log(filteredListings);
  return (
    <div className="container mx-auto p-4">
      {/* Parent container with vertical layout */}
      <Box className="flex flex-col gap-4">
        {/* Date Filter Carousel */}
        <Box className="overflow-x-scroll" sx={{ gap: 2 }}>
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

        {/* Movie Listings Carousel */}
        <Box className="bg-white border-2 border-black p-4 w-full">
          <Typography variant="h6">
            Movies Available on {new Date(selectedDate).toLocaleDateString()}
          </Typography>
          {filteredListings.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4 p-2">
              {filteredListings.map((listing) => (
                <div key={listing._id} className="flex-shrink-0 w-48">
                  <img
                    src={listing.image}
                    alt={listing.movieName}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    onClick={() => redirectToBooking(listing._id)}
                  />
                  <Typography className="text-center mt-2 font-semibold">
                    {listing.movieName}
                  </Typography>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No movies available</p>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default CinemaMovieTimesPage;
