import { useEffect, useState } from "react";
import { useAppContext } from "@/AppContext";
import clsx from "clsx";
// import { QRCode } from "next-qrcode";
import {useQRCode} from "next-qrcode";

type Cinema = {
  _id : string;
  capacity: number;
  halls: string[];
  location: string;
}

type Booking = {
  _id: string;
  movieTitle: string;
  bookingDate: string;
  hallName: string;
  timeSlot: string;
  cinema: Cinema;
  seats: string[];
}
export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("current");
  const {user, backendDomain} = useAppContext();
  const [status, setStatus] = useState("loading");
  const { Canvas } = useQRCode();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const res = await fetch(`${backendDomain}/api/v1/booking/my-bookings`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "content-type": "application/json"
              }
            }
          );
          const data = await res.json();
          setBookings(data);
          console.log("Fetched bookings IN TEST!!!!!:", data);
          setStatus("loaded");
        }
      } catch (error){
        console.error("Error fetching bookings:", error);
        setError("error fetching bookings");
      }
    };
    fetchBookings();
  }, [user, backendDomain]);

  console.log("Bookings:", bookings);
  // needs to be Date.now() to accomodate testing
  const today = new Date(Date.now());

  const currentBookings = bookings.filter((b) => new Date(b.bookingDate) >= today);
  const pastBookings = bookings.filter((b) => new Date(b.bookingDate) < today);

  console.log(currentBookings);
  const renderBooking = (booking: Booking) => {
    const ticketUrl = `${window.location.origin}/ticket-page?bookingId=${booking._id}`;
    // router.push("view-all-cinema-locations")

    return (
      <div
        key={booking._id}
        className="p-4 mb-4 border rounded-lg shadow-sm bg-white flex items-center justify-between dark:bg-gray-900 dark:text-white"
      >
        <div>
          <h3 className="text-lg font-semibold">{booking.movieTitle}</h3>
          <p className="text-sm text-gray-600">Date: {booking.bookingDate}</p>
          <p className="text-sm text-gray-600">Time: {booking.timeSlot}</p>
          <p className="text-sm text-gray-600">Hall: {booking.hallName}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
        <Canvas
            text={ticketUrl}
            options={{
              errorCorrectionLevel: 'M',
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: '#000000',
                light: '#FFBF60FF',
              },
            }}
          />
        </div>
      </div>
    )
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">My Bookings</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setActiveTab("current")}
          className={clsx(
            "px-4 py-2 border-b-2 font-medium",
            activeTab === "current"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Current
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={clsx(
            "px-4 py-2 border-b-2 font-medium ml-4",
            activeTab === "past"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Past
        </button>
      </div>

      {status === "loading" ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : !user ? (
        <p className="text-center text-red-500">Please log in to view bookings.</p>
      ) : (
        <>
          {activeTab === "current" &&
            (currentBookings.length > 0 ? (
              currentBookings.map(renderBooking)
            ) : (
              <p className="text-center text-gray-500">No current bookings.</p>
            ))}
          {activeTab === "past" &&
            (pastBookings.length > 0 ? (
              pastBookings.map(renderBooking)
            ) : (
              <p className="text-center text-gray-500">No past bookings.</p>
            ))}
        </>
      )}
    </div>
  );
}
