const SEAT_SIZE = 30;
const SEATS_DISTANCE = 60;
const SUBSECTION_PADDING = 10;

const SECTIONS_MARGIN = 15;
const SECTION_TOP_PADDING = 40;
const BAY_MARGIN = 2;

interface Seat {
  name: string;
  status: string;
}
// Optional fields, they can be undefined
interface Bay {
  seats_per_row?: number; // Optional, may be undefined
  rows?: number; // Optional, may be undefined
  layout: Record<string, Seat[]>;
}

// Get the width for a single bay based on its seats per row
const getBayWidth = (bay: Bay): number => {
  // Default to 0 if `seats_per_row` is undefined
  const seatsPerRow = bay.seats_per_row ?? 0;
  return SEATS_DISTANCE * seatsPerRow + SUBSECTION_PADDING * 2;
};

// Get the height for a single bay based on the number of rows
const getBayHeight = (bay: Bay): number => {
  // Default to 0 if `rows` is undefined
  const rows = bay.rows ?? 0;
  return SEATS_DISTANCE * rows + SUBSECTION_PADDING * 2;
};

// Get the maximum section (bay) width for all bays
const getMaximimSectionWidth = (bays: Bay[]): number => {
  return Math.max(...bays.map(getBayWidth).filter((width): width is number => width !== undefined));
};

// Get the height for the section (the tallest bay)
const getSectionHeight = (bays: Bay[]): number => {
  return (
    Math.max(...bays.map(getBayHeight).filter((width): width is number => width !== undefined)) + SECTION_TOP_PADDING
  );
};

export {
  SEAT_SIZE,
  SEATS_DISTANCE,
  SUBSECTION_PADDING,
  SECTIONS_MARGIN,
  SECTION_TOP_PADDING,
  BAY_MARGIN,
  getBayWidth,
  getBayHeight,
  getMaximimSectionWidth,
  getSectionHeight,
};
