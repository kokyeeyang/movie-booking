"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppContext } from "../../src/AppContext";
import MainStage from "../MainStage"; // Assuming this is the component to show booking details

const MovieBookingPage = () => {
  const { backendDomain } = useAppContext();
  const [movieListing, setMovieListing] = useState(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // State for the selected time
  const router = useRouter();

  const movieListingId = router.query?.movieListingId as string | undefined;

  useEffect(() => {
    if (!movieListingId) return;

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
        console.error("Error fetching movie listing:", error);
      }
    };

    fetchMovieListing();
  }, [backendDomain, movieListingId]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time); // Set the selected time when user clicks on a time slot
  };

  return (
    <div className="p-4 sm:p-6">
      {movieListing ? (
        <>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Select a Show Time</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {timings.map((timing) => (
                <div
                  key={timing.id}
                  onClick={() => handleTimeSelect(timing.value)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-full text-center hover:bg-blue-600 cursor-pointer transition duration-300"
                >
                  {timing.value}
                </div>
              ))}
            </div>
          </div>

          {selectedTime && <MainStage selectedTime={selectedTime} />}
        </>
      ) : (
        <div>Loading movie listing...</div>
      )}
    </div>
  );
};

export default MovieBookingPage;
