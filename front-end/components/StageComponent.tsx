// components/StageComponent.tsx
"use client";
import { useState, useEffect } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

interface StageComponentProps {
  width: number;
  height: number;
  scale: number;
  seatingAvailability: any[];
  onSelect: (seatId: string) => void;
}

const StageComponent = ({
  width,
  height,
  scale,
  seatingAvailability,
  onSelect,
}: StageComponentProps) => {

  return (
    <Stage width={width} height={height} scaleX={scale} scaleY={scale}>
      <Layer>
        {seatingAvailability.map((bay, index) => {
          const x = index * 150;
          return (
            <Rect
              key={bay._id}
              x={x}
              y={50}
              width={100}
              height={50}
              fill="lightblue"
              stroke="black"
              strokeWidth={2}
              onClick={() => onSelect(bay._id)}
            />
          );
        })}
      </Layer>
    </Stage>
  );
};

export default StageComponent;
