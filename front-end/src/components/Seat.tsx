import React from "react";
import { Rect } from "react-konva";
import { SEAT_SIZE } from "./layout";

interface SeatProps {
  x: number;
  y: number;
  data: {
    name: string;
    status: "booked" | 'available';
  };
  isSelected: boolean;
  onSelect: (seatName: string) => void;
}

const getColor = (isBooked: boolean, isSelected: boolean): string => {
  if (isSelected) {
    return "brown";
  } else if (isBooked) {
    return "lightgrey";
  } else {
    return "white";
  }
};

const Seat = ({x, y, data, isSelected, onSelect} : SeatProps) => {
  const isBooked = data.status === "booked";
  // Toggle selection on click
  const handleClick = () => {
    if (isBooked) return; // Do nothing if the seat is booked
    onSelect(data.name); // Use id to identify the seat
  };
  
  return (
    <Rect
      x={x}
      y={y}
      width={SEAT_SIZE}
      height={SEAT_SIZE}
      strokeWidth={1}
      stroke="lightgrey"
      fill={getColor(isBooked, isSelected)}
      onClick={handleClick}
    />
  );
};

export default Seat;
