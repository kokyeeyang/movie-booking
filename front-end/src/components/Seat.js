import React from "react";
import { Rect } from "react-konva";
import { SEAT_SIZE } from "./layout";

function getColor(isBooked, isSelected) {
  if (isSelected) {
    return "brown";
  } else if (isBooked) {
    return "lightgrey";
  } else {
    return "white";
  }
}

const Seat = props => {
  const isBooked = props.data.status === "booked";
  // Toggle selection on click
  const handleClick = () => {
    if (isBooked) return; // Do nothing if the seat is booked
    props.onSelect(props.data.name); // Use id to identify the seat
  };
  
  return (
    <Rect
      x={props.x}
      y={props.y}
      width={SEAT_SIZE}
      height={SEAT_SIZE}
      strokeWidth={1}
      stroke="lightgrey"
      fill={getColor(isBooked, props.isSelected)}
      onClick={handleClick}
    />
  );
};

export default Seat;
