// app/MainStage.tsx or pages/MainStage.tsx depending on your structure
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
  layout: Record<string, string[]>;
  seats_per_row: number;
  rows: number;
  bay_name: string;
  _id: string;
}

interface MovieDetails {
  stageWidth: number;
  paddingBottom: number;
}

interface MovieListing {
  seatingAvailability: Bay[];
  movieDetails: MovieDetails;
  image: string;
}

interface MovieScreenProps {
  imageUrl: string;
  stageWidth: number;
  paddingBottom: number;
}

const MovieScreen = ({ imageUrl, stageWidth, paddingBottom = 0 }: MovieScreenProps) => (
  <img
    src={imageUrl}
    style={{
      position: "relative",
      width: stageWidth * 0.4 + "px",
      height: "200px",
      paddingBottom: `${paddingBottom}px`,
      left: "550px",
      transform: "translateX(0%)",
    }}
    alt="Movie Screen"
  />
);

interface MainStageProps {
  movieListing: MovieListing;
}

const MainStage = ({ movieListing }: MainStageProps) => {
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
    router.push(
      `/checkout?userId=${user?.id}&selectedSeats=${selectedSeats}&movieListing=${JSON.stringify(
        movieListing
      )}`
    );
  };

  if (!movieListing) {
    return <div ref={containerRef}>Loading...</div>;
  }

  return (
    <div
      className="no-scroll"
      style={{
        position: "relative",
        width: "100%",
        height: "110vh",
        background: "pink",
        display: "flex",
        flexDirection: "column",
        padding: "0 10px",
      }}
      ref={containerRef}
    >
      <MovieScreen
        imageUrl={movieListing.image}
        stageWidth={size.width - 20}
        paddingBottom={0}
      />
      <ClientOnlyStage
        width={size.width}
        height={size.height}
        scale={scale}
        seatingAvailability={movieListing.seatingAvailability}
        onSelect={handleSelect}
      />
      <PurchaseTicketFooter
        selectedSeats={selectedSeatsIds}
        onPurchase={handlePurchase}
      />
    </div>
  );
};

export default MainStage;
