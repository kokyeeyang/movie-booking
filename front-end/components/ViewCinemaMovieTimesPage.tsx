"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { useAlert } from "../src/AlertContext";
import { useAppContext } from "@/AppContext";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter, useSearchParams } from "next/navigation";

const CinemaMovieTimesPage = () => {
  const { showAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cinemaId, setCinemaId] = useState<string | null>(null);
  const [movieListings, setMovieListing] = useState<MovieListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<MovieListing[]>([]);
  console.log("filtered listings : ", filteredListings);
  const [loading, setLoading] = useState(true);
  const appContext = useAppContext();
  const backendDomain = appContext?.backendDomain || process.env.BACKEND_DOMAIN || "http://localhost:5000";
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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
  const [isClient, setIsClient] = useState(false);

  interface MovieListing {
    _id: string;
    movieName: string;
    image: string;
    showDates: string[];
    showTimes: string[];
  }

  useEffect(() => {
    setIsClient(true);  // This ensures the client-only rendering happens
  }, []);

  useEffect(() => {
    const cinemaIdFromQuery = searchParams.get("cinemaId");
    if (cinemaIdFromQuery) {
      setCinemaId(cinemaIdFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!cinemaId) return;
    const fetchMovieListings = async () => {
      try {
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
  }, [cinemaId, showAlert]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const updatedListings = movieListings
      .map((listing) => {
        const filteredShowDates = listing.showDates.filter((showDate) => {
          let listingDate = new Date(showDate).toISOString().split("T")[0]; // Format to "YYYY-MM-DD"
          return listingDate === date;
        });
        console.log('byeeeee');
        console.log(movieListings);
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
    setFilteredListings(updatedListings.filter((listing): listing is Listing => listing !== null));
  };

  interface Listing {
    _id: string;
    ageRating: string;
    duration: number;
    cinemaDetails: {
      _id: string; // assuming you want the cinema's _id too
      operator: string;
      location: string;
    };
    genre: string;
    hallId: string;
    image: string;
    movieName: string;
    showDates: string[]; // Array of date strings or you could use Date if necessary
    showTimes: string[]; // Array of time strings
    // Add other properties as needed
  }
  // const redirectToBookingSlots = (movieId: string) => {
  const redirectToBookingSlots = (listing: Listing) => {
    console.log('this is the listing', listing)
    localStorage.setItem('selectedDate', JSON.stringify(selectedDate));
    router.push(`movie-booking-slots`);
  };

  if (!isClient) return null;

  return (
    <div className="container mx-auto p-4">
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
                    src={`${backendDomain}/${listing.image}`}
                    alt={listing.movieName}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-80"
                    onClick={() => redirectToBookingSlots(listing)}
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
