const SEAT_SIZE = 30;
const SEATS_DISTANCE = 40;
const SUBSECTION_PADDING = 80;

const SECTIONS_MARGIN = 15;
const SECTION_TOP_PADDING = 40;

// Get the width for a single bay based on its seats per row
const getBayWidth = (bay) => {
  const { seats_per_row } = bay;
  return SEATS_DISTANCE * seats_per_row + SUBSECTION_PADDING * 2;
};

// Get the height for a single bay based on the number of rows
const getBayHeight = (bay) => {
  const { rows } = bay;
  return SEATS_DISTANCE * rows + SUBSECTION_PADDING * 2;
};

// Get the maximum section (bay) width for all bays
const getMaximimSectionWidth = (bays) => {
  return Math.max(...bays.map(getBayWidth));
};

// Get the height for the section (the tallest bay)
const getSectionHeight = (bays) => {
  return Math.max(...bays.map(getBayHeight)) + SECTION_TOP_PADDING;
};

export {
  SEAT_SIZE,
  SEATS_DISTANCE,
  SUBSECTION_PADDING,
  SECTIONS_MARGIN,
  SECTION_TOP_PADDING,
  getBayWidth,
  getBayHeight,
  getMaximimSectionWidth,
  getSectionHeight,
};
