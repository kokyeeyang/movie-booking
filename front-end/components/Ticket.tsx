// /pages/ticket/[bookingId].tsx

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/AppContext";

type Cinema = {
  _id: string;
  capacity: number;
  halls: string[];
  location: string;
};

type Booking = {
  _id: string;
  movieTitle: string;
  bookingDate: string;
  hallName: string;
  timeSlot: string;
  cinema: Cinema;
  seats: string[];
};

export default function TicketPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const { backendDomain } = useAppContext();
  const router = useRouter();
  const bookingId = useSearchParams().get("bookingId");

  useEffect(() => {
    if (bookingId) {
      const fetchBooking = async () => {
        try {
          const res = await fetch(`${backendDomain}/api/v1/booking/${bookingId}`, {
            method: "GET",
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          });
          const data = await res.json();
          console.log("Fetched booking data:", data);
          setBooking(data);
        } catch (error) {
          console.error("Error fetching booking:", error);
        }
      };
      fetchBooking();
    }
  }, [backendDomain, bookingId]);

  if (!booking) {
    return <p>Loading...</p>;
  }

  return (
    // <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8">
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mt-8 dark:bg-gray-900 dark:text-white">
      {/* Ticket Header */}
      <h1 className="text-4xl font-semibold text-center text-blue-600 mb-6">Your Movie Ticket</h1>

      {/* Booking Details */}
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">{booking.movieTitle}</h2>
          <p className="text-lg text-gray-600">Date: {booking.bookingDate}</p>
          <p className="text-lg text-gray-600">Time: {booking.timeSlot}</p>
          <p className="text-lg text-gray-600">Cinema: {booking.cinema.location}</p>
          <p className="text-lg text-gray-600">Hall: {booking.hallName}</p>
          <p className="text-lg text-gray-600">Seats: {booking.seats.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
