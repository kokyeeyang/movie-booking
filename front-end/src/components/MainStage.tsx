import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { Stage, Layer } from "react-konva";
import useImage from "use-image";
import Section from "./Section";
import * as layout from "./layout";
import "../styles/style.css";
import PurchaseTicketFooter from "./MovieBooking/PurchaseTicketFooter";
import { AppContext } from "../AppContext";
import { useRouter } from "next/router";

interface MovieListing {
  seatingAvailability: Bay[];
  movieDetails: {
    image: string;
  };
}

interface Bay {
  id: string;
  name: string;
  seats_per_row: number;
  rows: number;
  layout?: any;
}

interface MovieScreenProps {
  imageUrl: string;
  stageWidth: number;
  paddingBottom?: number;
}

const MovieScreen: React.FC<MovieScreenProps> = ({ imageUrl, stageWidth, paddingBottom = 0 }) => {
  const [image] = useImage(imageUrl);
  const screenWidth = `${stageWidth * 0.4}px`;
  const screenHeight = `200px`;
  const screenX = (stageWidth - parseFloat(screenWidth)) / 2;
  
  return (
    <img
      src={imageUrl}
      style={{
        position: "relative",
        width: screenWidth,
        height: screenHeight,
        paddingBottom: `${paddingBottom}px`,
        left: "550px",
      }}
      alt="Movie Screen"
    />
  );
};

interface MainStageProps {
  movieListing: MovieListing[];
}

const MainStage: React.FC<MainStageProps> = ({ movieListing }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const appContext = useContext(AppContext);
  // const {backendDomain = "http://localhost:5000", user} = appContext || "";
  const {user, backendDomain = "http://localhost:5000"} = appContext || {};
  // const { backendDomain, user } = useContext(AppContext);
  const router = useRouter();

  const [scale, setScale] = useState(1);
  const [scaleToFit, setScaleToFit] = useState(1);
  const [size, setSize] = useState({
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.5,
  });

  const [selectedSeatsIds, setSelectedSeatsIds] = useState<string[]>([]);

  useEffect(() => {
    const resizeHandler = () => {
      if (containerRef.current) {
        const newSize = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        };
        if (newSize.width !== size.width || newSize.height !== size.height) {
          setSize(newSize);
        }
      }
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    return () => window.removeEventListener("resize", resizeHandler);
  }, [size.width, size.height]);

  useEffect(() => {
    setTimeout(() => {
      if (!stageRef.current) return;
      const stage = stageRef.current;
      const clientRect = stage.getClientRect({ skipTransform: false });
      const scaleToFit = size.width / clientRect.width;
      setScale(scaleToFit);
      setScaleToFit(scaleToFit);
      stage.draw();
    }, 100);
  }, []);

  const toggleScale = useCallback(() => {
    setScale((prevScale) => (prevScale === 1 ? scaleToFit : 1));
  }, [scaleToFit]);

  const handleSelect = useCallback(
    (seatId: string) => {
      setSelectedSeatsIds((prevIds) => {
        return prevIds.includes(seatId)
          ? prevIds.filter((id) => id !== seatId)
          : [...prevIds, seatId];
      });
    },
    []
  );

  const handlePurchase = async () => {
    router.push({
      pathname: "/checkout",
      query: {
        userId: user?.id,
        selectedSeats: JSON.stringify(selectedSeatsIds),
        movieListing: JSON.stringify(movieListing)
      }
    });
  };

  if (!movieListing || movieListing.length === 0) {
    return <div ref={containerRef}>Loading...</div>;
  }

  const seatingAvailability = movieListing[0].seatingAvailability;
  const padding = 20;
  const movieImageUrl = movieListing[0].movieDetails.image;

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
      <MovieScreen imageUrl={movieImageUrl} stageWidth={size.width - 20} />
      <Stage ref={stageRef} width={size.width} height={size.height} scaleX={scale} scaleY={scale} style={{ marginTop: padding + "px" }}>
        <Layer>
          {seatingAvailability.map((bay, index) => {
            if (!bay.layout) return null;

            const margin = -200;
            const xPosition =
              index > 0
                ? seatingAvailability.slice(0, index).reduce((acc, prevBay) => acc + layout.getBayWidth(prevBay) + margin, 0)
                : 0;

            return (
              <Section
                x={xPosition}
                y={0}
                key={index}
                section={bay}
                selectedSeatsIds={selectedSeatsIds}
                onSelectSeat={handleSelect}
              />
            );
          })}
        </Layer>
      </Stage>
      <PurchaseTicketFooter selectedSeats={selectedSeatsIds} onPurchase={handlePurchase} />
    </div>
  );
};

export default MainStage;
