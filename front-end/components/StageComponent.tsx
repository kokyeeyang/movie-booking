"use client";
// import { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

interface StageComponentProps {
  width: number;
  height: number;
  scale: number;
  seatingAvailability: any[];
  selectedSeats: string[];
  onSelect: (seatId: string) => void;
}

const StageComponent = ({
  width,
  height,
  scale,
  seatingAvailability,
  selectedSeats,
  onSelect,
}: StageComponentProps) => {
  console.log(selectedSeats);
  return (
    <Stage width={width} height={height} scaleX={scale} scaleY={scale}>
      <Layer>
        {seatingAvailability.map((bay, index) => {
          const rowNames = Object.keys(bay.layout);
          const xOffsetForBays = index * 800; //need to set space between each bay

          return rowNames.map((rowName, rowIndex) => {
            const row = bay.layout[rowName]; // get array of seats in the row
            const yOffSet = rowIndex * 100; // set vertical position based on row index

            return row.map((seat: string, seatIndex: number) => {

              // console.log(`${bay._id}-${rowName}-${seatIndex}`);
              const seatWidth = 30; // Fixed width for each seat
              const xOffset = xOffsetForBays + seatIndex * seatWidth; 
              return (
                <Rect
                  key={`${bay._id}-${rowName}-${seatIndex}`}
                  x={xOffset}
                  y={yOffSet}
                  width={30}
                  height={30}
                  fill={selectedSeats.includes(`${bay._id}-${rowName}-${seatIndex}`) ? "red" : "gray"}
                  stroke="black"
                  strokeWidth={1}
                  onClick={() => onSelect(`${bay._id}-${rowName}-${seatIndex}`)}
                />
              )
            })
          })
          // const x = index * 150;
        })}
      </Layer>
    </Stage>

  );
};

export default StageComponent;
