import React from "react";
import { Group, Rect, Text, Image } from "react-konva";
import Konva from "konva";
import Seat from "./Seat";
import { getBayWidth } from "./layout";
// import { Group } from "konva/lib/Group";
// import { Group as KonvaGroup} from "konva";

interface SectionProps {
  section: Bay;
  height: number;
  x: number;
  y :number;
  isSelected: boolean;
  onSelectSeat : (seatName:string) => void;
  selectedSeatsIds: string[];
}

interface Seat {
  name: string;
  status: "booked" | "available";
}

interface Bay {
  bay_name: string;
  rows?: number;
  seats_per_row?: number;
  layout: Record<string, Seat[]>
}

const Section = ({section, height, x, y, onSelectSeat, selectedSeatsIds} : SectionProps) => {
  const containerRef = React.useRef<Konva.Group>(null);

    let bayName = section.bay_name;
    if (section.bay_name == "Bay 1") {
      bayName = "B1";
    } else if (section.bay_name == "Bay 2") {
      bayName = "B2";
    } else if (section.bay_name == "Bay 3") {
      bayName = "B3";
    }
    React.useEffect(() => {
      if (containerRef.current) {
        containerRef.current.cache();
        containerRef.current.getLayer()?.batchDraw();
      }
    }, [section, selectedSeatsIds]);

    const bayWidth = getBayWidth(section);

    return (
      <Group y={y} x={x} ref={containerRef}>
        <Rect
          width={bayWidth}
          height={height}
          fill="white"
          strokeWidth={1}
          stroke="lightgrey"
          cornerRadius={5}
        />

        {Object.keys(section.layout).map((rowKey, rowIndex) => {
          const row = section.layout[rowKey];
          return row.map((seat, seatIndex) => {
            let seatName = `${bayName}-${rowKey}-${seatIndex}`;
            const isSelected = selectedSeatsIds.includes(seatName);
            // console.log(selectedSeatsIds);

            return (
              <Seat
                key={seat.name}
                x={seatIndex * 40 + 80}
                y={rowIndex * 40 + 80}
                data={seat}
                onSelect={() => onSelectSeat(seatName)} // Pass seatName here
                isSelected={isSelected}
              />
            );
          });
        })}

        <Text
          text={section.bay_name}
          width={bayWidth}
          padding={20}
          align="center"
        />
      </Group>
    );
};

export default Section;