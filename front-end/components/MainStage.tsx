import React, { useContext, useRef, useState, useEffect, useCallback } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import Section from "./Section";
import * as layout from "./layout";
import "../styles/style.css";
import PurchaseTicketFooter from "./MovieBooking/PurchaseTicketFooter";
import { AppContext } from "../src/AppContext";
import { useRouter } from "next/navigation";

interface Bay {
  layout: Record<string, string[]>;
  seats_per_row: number;
  rows: number;
  bay_name: string;
  _id: string;
}

interface MovieDetails {
  imageUrl : string,
  stageWidth: number,
  paddingBottom: number
}

interface MovieListing {
  seatingAvailability : Bay[];
  movieDetails : MovieDetails;
}

interface movieScreenProps {
  imageUrl: string,
  stageWidth: number;
  paddingBottom: number;
}
// const MovieScreen:React.FC<MainStage> = ({ imageUrl, stageWidth, paddingBottom }) => {
const MovieScreen = ({imageUrl, stageWidth, paddingBottom = 0} : movieScreenProps) => {
  const [image] = useImage(imageUrl);
  // const screenWidth = stageWidth * 0.4;
  // const screenHeight = 200;
  const screenWidth = stageWidth * 0.4; //
  const screenHeight = `${200}px`; // Fixed height for the screen
  const screenX = (stageWidth - screenWidth) / 2; // Center horizontally
  const screenY = 10; // Vertical position of the screen (without top padding)

  return (
    <img
      src={imageUrl} // You can use 'imageUrl' directly instead of 'image' from useImage
      style={{
        position: "relative",
        width: screenWidth + "px",
        height: screenHeight + "px",
        paddingBottom: `${paddingBottom}px`, // Apply bottom padding only
        left: "550px",
        transform: "translateX(0%)"
      }}
      alt="Movie Screen"
    />
  );
};

interface MainStageProps {
  movieListing: MovieListing[];
}
const MainStage = ({ movieListing } : MainStageProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const appContext = useContext(AppContext);
  const backendDomain = appContext?.backendDomain || "http://localhost:5000";
  const user = appContext?.user;
  // const { backendDomain, user } = useContext(AppContext);

  const [scale, setScale] = React.useState(1);
  const [scaleToFit, setScaleToFit] = React.useState(1);
  const [size, setSize] = React.useState({
    width: window.innerWidth * 0.8, // take 80% of the window width
    height: window.innerHeight * 0.5, // take 50% of the window height
    // virtualWidth: 20,
  });

  const [selectedSeatsIds, setSelectedSeatsIds] = useState<string[]>([]);
  const router = useRouter();

  // Calculate available space for drawing
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

    if (stageRef.current) {
      stageRef.current.draw(); // Force a re-draw after the size is set
    }

    return () => window.removeEventListener("resize", resizeHandler);
  }, [size.width, size.height]);

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

  // Calculate initial scale based on content size
  React.useEffect(() => {
    setTimeout(() => {
      if (!stageRef.current) return;
      const stage = stageRef.current;
      const clientRect = stage.getClientRect({ skipTransform: false });
      const scaleToFit = size.width / clientRect.width;
      setScale(scaleToFit);
      setScaleToFit(scaleToFit);

      stageRef.current.draw();
    }, 100);
  }, []);

  // Toggle zoom/scale
  const toggleScale = useCallback(() => {
    setScale((prevScale) => (prevScale === 1 ? scaleToFit : 1));
  }, [scaleToFit]);

  const handleSelect = useCallback(
    (seatId: string) => {
      setSelectedSeatsIds((prevSelected) => {
        return prevSelected.includes(seatId)
          ? prevSelected.filter((id) => id !== seatId)
          : [...prevSelected, seatId];
      });
    },
    []
  );


  const handlePurchase = async () => {
    const selectedSeats = selectedSeatsIds.join(",");
    console.log("selected seats are here!");
    console.log(selectedSeats);
    router.push(
      `/checkout?userId=${user?.id}&selectedSeats=${selectedSeats}&movieListing=${JSON.stringify(movieListing)}`
    );
  };

  // Loading state
  if (!movieListing || movieListing.length === 0) {
    return <div ref={containerRef}>Loading...</div>;
  }
  // console.log(movieListing);
  const seatingAvailability = movieListing[0].seatingAvailability;
  const padding = 20; // Padding around the movie screen
  // const equalSpacing = totalAvailableWidth / totalBays;

  const movieImageUrl = movieListing[0].movieDetails.imageUrl;

  interface SectionProps {
    x: number;
    y: number;
    section: Bay;
    selectedSeatsIds: string[];
    onSelectSeat: (seatId: string) => void;
  }

  // const Section: React.FC<SectionProps> = ({ x, y, section, selectedSeatsIds, onSelectSeat }) => {
  const Section = ({x, y, section, selectedSeatsIds, onSelectSeat} : SectionProps) => {
    return <div>{section.bay_name}</div>;
  };

  // const movieImageUrl = movieListing

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
        imageUrl={movieImageUrl}
        stageWidth={size.width - 20}
        paddingBottom={0}
      />
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        scaleX={scale}
        scaleY={scale}
        style={{ marginTop: padding + "px" }} // Space between screen and stage
      >
        <Layer>
          {seatingAvailability.map((bay, index) => {
            if (!bay.layout) return null;

            const bayWidth = layout.getBayWidth(bay);
            const margin = -200;

            const xPosition =
            index > 0 && Array.isArray(seatingAvailability)
              ? seatingAvailability.slice(0, index).reduce((acc, prevBay) => {
                  return acc + (layout?.getBayWidth(prevBay) ?? 0) + margin;
                }, 0)
              : 0;

            const yPosition = 0; // Keep constant Y to align them horizontally

            return (
              <Section
                x={xPosition}
                y={yPosition}
                key={index}
                section={bay}
                selectedSeatsIds={selectedSeatsIds}
                onSelectSeat={handleSelect}
              />
            );
          })}
        </Layer>
      </Stage>
      <PurchaseTicketFooter
        selectedSeats={selectedSeatsIds}
        onPurchase={handlePurchase}
      ></PurchaseTicketFooter>
    </div>
  );
};

export default MainStage;
