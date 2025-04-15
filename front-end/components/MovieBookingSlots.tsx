"use client";
import { useEffect, useState } from "react";
import MainStage from "../components/MainStage";
import { useAppContext } from "@/AppContext";

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
  const [timeSlot, setTimeSlot] = useState<string[]>([]);
  const {backendDomain} = useAppContext();

  useEffect(() => {
    const storedListing = localStorage.getItem("movieListing");
    if(storedListing){
      setListing(JSON.parse(storedListing));
    }
  }, []);

  const handleTimeSelect = async (time: string) => {
    const selectedDay = localStorage.getItem('selectedDate')?.replace(/^"|"$/g, ""); // Removes surrounding quotes
    const encodedDate = encodeURIComponent(selectedDay ?? "");
    const cleanedTime = time?.replace(/^"|"$/g, "")
    const encodedTime = encodeURIComponent(cleanedTime);
  
    try {
      const timeSlot = await fetch(
        `${backendDomain}/api/v1/movieListing/select-single-time-slot/${encodedDate}/${encodedTime}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const timeSlotData = await timeSlot.json(); // assuming the response is JSON
      console.log('Time slot:', timeSlotData);
      localStorage.setItem('movieListing', JSON.stringify(timeSlotData));
  
      // If `listing` comes from somewhere else (e.g., context or props), make sure it's accessible
      console.log('weeeee');
      console.log(timeSlotData);

      setSelectedTime(time);
      setTimeSlot(timeSlotData);
    } catch (error) {
      console.error('Error selecting time slot:', error);
    }
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
      {selectedTime && timeSlot.length > 0 && <MainStage timeSlot={timeSlot} />} {/* Conditionally render MainStage */}
    </div>
  );
};

export default MovieBookingSlots;
