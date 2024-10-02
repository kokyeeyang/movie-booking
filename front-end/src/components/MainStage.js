import React from "react";
import { Stage, Layer } from "react-konva";
import Section from "./Section";
import * as layout from "./layout";

const useFetch = (url) => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, [url]);
  return data;
};

const MainStage = ({ movieListing }) => {
  const jsonData = useFetch("./seats-data.json");
  console.log("dummy data = ", jsonData);
  console.log(movieListing);
  const containerRef = React.useRef(null);
  const stageRef = React.useRef(null);

  const [scale, setScale] = React.useState(1);
  const [scaleToFit, setScaleToFit] = React.useState(1);
  const [size, setSize] = React.useState({
    width: 100,
    height: 100,
    virtualWidth: 100,
  });
  const [virtualWidth, setVirtualWidth] = React.useState(100);

  const [selectedSeatsIds, setSelectedSeatsIds] = React.useState([]);

  const [popup, setPopup] = React.useState({ seat: null });

  // calculate available space for drawing
  React.useEffect(() => {
    const newSize = {
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    };
    if (newSize.width !== size.width || newSize.height !== size.height) {
      setSize(newSize);
    }
  });

  // calculate initial scale
  React.useEffect(() => {
    if (!stageRef.current) {
      return;
    }
    const stage = stageRef.current;
    const clientRect = stage.getClientRect({ skipTransform: false });

    const scaleToFit = size.width / clientRect.width;
    setScale(scaleToFit);
    setScaleToFit(scaleToFit);
    setVirtualWidth(clientRect.width);
  }, [jsonData, size]);

  // togle scale on double clicks or taps
  const toggleScale = React.useCallback(() => {
    if (scale === 1) {
      setScale(scaleToFit);
    } else {
      setScale(1);
    }
  }, [scale, scaleToFit]);

  let lastSectionPosition = 0;

  const handleSelect = React.useCallback(
    (seatId) => {
      let newIds;
      console.log(seatId);
      const index = selectedSeatsIds.indexOf(seatId);
      if (index == -1) {
        newIds = selectedSeatsIds.concat([seatId]);
      } else {
        console.log("deselecting!");
        newIds = selectedSeatsIds.slice();
        newIds.splice(newIds.indexOf(seatId), 1);
      }
      setSelectedSeatsIds(newIds);
    },
    [selectedSeatsIds]
  );
  console.log(selectedSeatsIds);

  // const handleDeselect = React.useCallback((seatId) => {
  //   const ids = [...selectedSeatsIds];
  //   const index = ids.indexOf(seatId);

  //   if (index !== -1) {
  //     ids.splice(index, 1); // remove the seatId if it is already present inside the selectedSeatsIds
  //     setSelectedSeatsIds(ids);
  //   } else {
  //     console.log(
  //       `seat id ${seatId} is not found inside already selected seats`
  //     );
  //   }
  // });

  if (jsonData === null) {
    return <div ref={containerRef}>Loading...</div>;
  }
  const seatingAvailability = movieListing[0].seatingAvailability;
  const maxSectionWidth = layout.getMaximimSectionWidth(
    jsonData.seats.sections
  );
  const height = layout.getSectionHeight(seatingAvailability);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "turquoise",
        width: "100vw",
        height: "100vh",
      }}
      ref={containerRef}
    >
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onDblTap={toggleScale}
        onDblClick={toggleScale}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          {
            <Section
              x={20}
              y={20}
              height={height} // Using the calculated height
              section={seatingAvailability}
              selectedSeatsIds={selectedSeatsIds}
              onSelectSeat={handleSelect}
            />
          }
          {/* {jsonData.seats.sections.map((section, index) => {
            const height = layout.getSectionHeight(section);
            const position = lastSectionPosition + layout.SECTIONS_MARGIN;
            lastSectionPosition = position + height;
            const width = layout.getSectionWidth(section);

            const offset = (maxSectionWidth - width) / 2;

            return (
              <Section
                x={offset}
                y={position}
                height={height}
                key={index}
                section={section}
                selectedSeatsIds={selectedSeatsIds}
                onSelectSeat={handleSelect}
              />
            );
          })} */}
        </Layer>
      </Stage>
    </div>
  );
};

export default MainStage;
