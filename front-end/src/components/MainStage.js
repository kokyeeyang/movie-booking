import React from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";
import Section from "./Section";
import * as layout from "./layout";
import "../styles/style.css";

const MovieScreen = ({ imageUrl, stageWidth, paddingBottom }) => {
  const [image] = useImage(imageUrl);

  // const screenWidth = stageWidth * 0.4;
  // const screenHeight = 200;
  const screenWidth = `${stageWidth * 0.4}px`; //
  const screenHeight = `${200}px`; // Fixed height for the screen
  const screenX = (stageWidth - screenWidth) / 2; // Center horizontally
  const screenY = 10; // Vertical position of the screen (without top padding)

  return (
    <img
      src={imageUrl} // You can use 'imageUrl' directly instead of 'image' from useImage
      style={{
        position: "relative",
        width: screenWidth,
        height: screenHeight,
        paddingBottom: `${paddingBottom}px`, // Apply bottom padding only
        left: "550px",
      }}
      alt="Movie Screen"
    />
  );
};

const MainStage = ({ movieListing }) => {
  const containerRef = React.useRef(null);
  const stageRef = React.useRef(null);

  const [scale, setScale] = React.useState(1);
  const [scaleToFit, setScaleToFit] = React.useState(1);
  const [size, setSize] = React.useState({
    width: window.innerWidth * 0.8, // take 80% of the window width
    height: window.innerHeight * 0.5, // take 50% of the window height
    // virtualWidth: 20,
  });

  const [selectedSeatsIds, setSelectedSeatsIds] = React.useState([]);

  // Calculate available space for drawing
  React.useEffect(() => {
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
  const toggleScale = React.useCallback(() => {
    if (scale === 1) {
      setScale(scaleToFit);
    } else {
      setScale(1);
    }
  }, [scale, scaleToFit]);

  // Handle seat selection
  const handleSelect = React.useCallback(
    (seatId) => {
      let newIds;
      const index = selectedSeatsIds.indexOf(seatId);
      if (index === -1) {
        newIds = selectedSeatsIds.concat([seatId]);
      } else {
        newIds = selectedSeatsIds.slice();
        newIds.splice(index, 1);
      }
      setSelectedSeatsIds(newIds);
    },
    [selectedSeatsIds]
  );
  // Loading state
  if (!movieListing || movieListing.length === 0) {
    return <div ref={containerRef}>Loading...</div>;
  }
  // console.log(movieListing);
  const seatingAvailability = movieListing[0].seatingAvailability;
  const padding = 20; // Padding around the movie screen
  // const equalSpacing = totalAvailableWidth / totalBays;

  const movieImageUrl = movieListing[0].movieDetails.image;

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
      ></MovieScreen>
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

            // const xPosition = index * (layout.getBayWidth(bay) + margin);
            const xPosition =
              index > 0
                ? seatingAvailability.slice(0, index).reduce((acc, prevBay) => {
                    return acc + layout.getBayWidth(prevBay) + margin; // Add previous bay width and margin
                  }, 0)
                : 0; // Start from 0 for the first bay

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
    </div>
  );
};

export default MainStage;
