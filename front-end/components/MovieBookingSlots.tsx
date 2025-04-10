"use client";
import { useEffect, useState } from "react";
import MainStage from "../components/MainStage";

const timings = [
  { id: 1, value: "11.00 am" },
  { id: 2, value: "1.30 pm" },
  { id: 3, value: "4.00 pm" },
  { id: 4, value: "6.30 pm" },
  { id: 5, value: "9.00 pm" },
  { id: 6, value: "11.30 pm" },
];

const MovieBookingSlots = () => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [listing, setListing] = useState<any[]>([]);
  console.log('listing! = ', listing);

  useEffect(() => {
    const storedListing = localStorage.getItem("movieListing");
    if(storedListing){
      setListing(JSON.parse(storedListing));
    }
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Select a Show Time</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {timings.map((timing) => (
          <div
            key={timing.id}
            onClick={() => handleTimeSelect(timing.value)} // Set the selected time
            className="bg-blue-500 text-white py-2 px-4 rounded-full text-center hover:bg-blue-600 cursor-pointer transition duration-300"
          >
            {timing.value}
          </div>
        ))}
      </div>

      {/* {selectedTime && <MainStage movie={"testing"} selectedTime={selectedTime} />} Conditionally render MainStage */}
      {selectedTime && <MainStage movieListing={listing} />} {/* Conditionally render MainStage */}
    </div>
  );
};

export default MovieBookingSlots;
