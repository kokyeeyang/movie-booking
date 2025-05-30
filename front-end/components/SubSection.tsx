import React from "react";
import { Group, Text } from "react-konva";
import Seat from "./Seat";

import { SEATS_DISTANCE, SUBSECTION_PADDING, SEAT_SIZE } from "./layout";

interface SeatData {
  name: string;
  status: "booked" | "available";
  [key: string]: any;
}

interface RowData {
  [key:string]: SeatData[];
}

interface SectionProps {
  width: number;
  x: number;
  y: number;
  data: {
    name: string;
    container_by_rows: RowData;
  };
  onSelectSeat: (seat: SeatData) => void;
  selectedSeatsIds: string[];
}

const seatLayout = ({width, x, y, data, onSelectSeat, selectedSeatsIds} : SectionProps) => {
  return (
    <Group x={x} y={y}>
      {Object.keys(data.container_by_rows).map((rowKey, rowIndex) => {
        const row = data.container_by_rows[rowKey];
        return (
          <React.Fragment key={rowKey}>
            {row.map((seat, seatIndex) => {
              const isSelected = selectedSeatsIds.includes(seat.name);
              return (
                <Seat
                  key={seat.name}
                  x={seatIndex * SEATS_DISTANCE + SUBSECTION_PADDING}
                  y={rowIndex * SEATS_DISTANCE + SUBSECTION_PADDING}
                  data={seat}
                  onSelect={()=>onSelectSeat(seat)}
                  isSelected={isSelected}
                />
              );
            })}
            <Text
              text={rowKey}
              x={SUBSECTION_PADDING - SEATS_DISTANCE}
              y={rowIndex * SEATS_DISTANCE + 105 - SEAT_SIZE / 2}
              align="center"
              key={"label-left" + rowKey}
            />
          </React.Fragment>
        );
      })}

      {Object.keys(data.container_by_rows).map((row, rowIndex) => {
        // Check if this is the last row
        const isLastRow =
          rowIndex === Object.keys(data.container_by_rows).length - 1;

        console.log(data.container_by_rows[row]);

        return data.container_by_rows[row].map((_, seatIndex) => {
          if (isLastRow) {
            return (
              <Text
                text={(seatIndex + 1).toString()}
                x={seatIndex * SEATS_DISTANCE + 98 - 50}
                width={100}
                y={
                  // basically need to be one row below the last row
                  (rowIndex + 1) * SEATS_DISTANCE + SUBSECTION_PADDING
                }
                key={`label-bottom-${row}-${seatIndex}`}
                align="center"
              />
            );
          }
          return null; // Do not render anything for rows other than the last row
        });
      })}
      <Text text={data.name} width={width} padding={20} align="center" />
    </Group>
  );
}