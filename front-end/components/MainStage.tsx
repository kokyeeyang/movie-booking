"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { useAppContext } from "../src/AppContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "../styles/style.css";
import PurchaseTicketFooter from "./MovieBooking/PurchaseTicketFooter";

const ClientOnlyStage = dynamic(() => import("../components/ClientOnlyStage"), {
  ssr: false,
});

interface Bay {
  layout: Record<string, string[]>; // This will map bay sections (e.g., "A", "B", etc.) to seat statuses (e.g., "available", "booked")
  seats_per_row: number;            // Number of seats per row in the bay
  rows: number;                     // Number of rows in the bay
  bay_name: string;                 // Name of the bay (e.g., "Bay 1", "Bay 2")
  _id: string;                      // Unique identifier for the bay
}

interface MovieDetails {
  stageWidth: number;      // The width of the stage for rendering the seating layout
  paddingBottom: number;   // Padding for layout
  image: string;           // Image URL of the movie (e.g., from the "movie" field in your MovieListing)
}

export interface MovieListing {
  _id: string;                 // Unique identifier for the movie listing
  seatingAvailability: Bay[];  // Array of seating availability data for the showtime
  showDate: string;            // Date the show is scheduled for
  showTime: string;            // Time of the show
  movie: MovieDetails;         // Movie details including image and layout information
  cinema: string;              // Reference to the cinema (probably stored as an ObjectId)
  hallId: string;              // Hall ID for this movie listing
}

interface MovieScreenProps {
  imageUrl: string;      // URL of the movie image
  stageWidth: number;    // Width of the stage for rendering the layout
  paddingBottom: number; // Padding for the layout
}


// if (!imageUrl) return null;
const MovieScreen = ({ imageUrl, stageWidth, paddingBottom = 0 }: MovieScreenProps) => {

  if (!imageUrl) return null;
  return(
    <img
      src={imageUrl}
      style={{
        position: "relative",
        width: `${stageWidth * 0.4}px`,
        height: "200px",
        paddingBottom: `${paddingBottom}px`,
        left: "35%",
        transform: "translateX(-50%)",
      }}
      alt="Movie Screen"
    />
  )
};

interface MainStageProps {
  timeSlot: MovieListing;
}

const MainStage = ({ timeSlot }: MainStageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { backendDomain, user } = useAppContext();
  const router = useRouter();

  const [scale, setScale] = useState(1);
  const [size, setSize] = useState({ width: 800, height: 400 });
  const [selectedSeatsIds, setSelectedSeatsIds] = useState<string[]>([]);

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.5,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleSelect = useCallback(
    (seatId: string) => {
      setSelectedSeatsIds((prev) =>
        prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
      );
    },
    []
  );

  const handlePurchase = async () => {
    const selectedSeats = selectedSeatsIds.join(",");
    localStorage.setItem("movieListing", JSON.stringify(timeSlot));
    router.push(
      `/checkout?userId=${user?.userId}&selectedSeats=${selectedSeats}`
    );
  };

  if (!timeSlot) {
    return <div ref={containerRef}>Loading...</div>;
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-between w-full h-full bg-green-100 p-4 md:p-6 lg:p-8"
    >
      {/* Movie Screen */}
      <MovieScreen
        imageUrl={Array.isArray(timeSlot) && timeSlot.length > 0 ? `${backendDomain}/${timeSlot[0].movieImage}` : ""}
        stageWidth={size.width - 20}
        paddingBottom={40}
      />

      {/* Stage */}
      <ClientOnlyStage
        width={size.width}
        height={size.height}
        scale={scale}
        seatingAvailability={Array.isArray(timeSlot) && timeSlot.length > 0 ? timeSlot[0].seatingAvailability : ""}
        selectedSeats={selectedSeatsIds}
        onSelect={handleSelect}
      />

      {/* Footer */}
      <PurchaseTicketFooter
        selectedSeats={selectedSeatsIds}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default MainStage;
