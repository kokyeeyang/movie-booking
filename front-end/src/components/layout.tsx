const SEAT_SIZE = 30;
const SEATS_DISTANCE = 60;
const SUBSECTION_PADDING = 10;
const SECTIONS_MARGIN = 15;
const SECTION_TOP_PADDING = 40;
const BAY_MARGIN = 2;

interface Bay {
  seats_per_row: number;
  rows: number;
}

// Get the width for a single bay based on its seats per row
const getBayWidth = (bay: Bay): number => {
  return SEATS_DISTANCE * bay.seats_per_row + SUBSECTION_PADDING * 2;
};

// Get the height for a single bay based on the number of rows
const getBayHeight = (bay: Bay): number => {
  return SEATS_DISTANCE * bay.rows + SUBSECTION_PADDING * 2;
};

// Get the maximum section (bay) width for all bays
const getMaximumSectionWidth = (bays: Bay[]): number => {
  return Math.max(...bays.map(getBayWidth));
};

// Get the height for the section (the tallest bay)
const getSectionHeight = (bays: Bay[]): number => {
  return Math.max(...bays.map(getBayHeight)) + SECTION_TOP_PADDING;
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
  getMaximumSectionWidth,
  getSectionHeight,
};
