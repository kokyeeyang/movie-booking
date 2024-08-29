const SEAT_SIZE = 30;
const SEATS_DISTANCE = 40;
const SUBSECTION_PADDING = 80;

const SECTIONS_MARGIN = 15;
const SECTION_TOP_PADDING = 40;

const getSubsectionWidth = subsection => {
  const rows = Object.keys(subsection.container_by_rows);
  const maxRows = Math.max(
    ...rows.map(r => Object.keys(subsection.container_by_rows[r]).length)
  );
  return SEATS_DISTANCE * maxRows + SUBSECTION_PADDING * 1;
};

const getSubsectionHeight = subsection => {
  const rows = Object.keys(subsection.container_by_rows);
  return SEATS_DISTANCE * rows.length + SUBSECTION_PADDING * 2;
};

const getSectionWidth = section => {
  const width = section.subsections.reduce((sum, subsection) => {
    return sum + getSubsectionWidth(subsection);
  }, 0);
  return width;
};

const getSectionHeight = section => {
  return (
    Math.max(...section.subsections.map(getSubsectionHeight)) +
    SECTION_TOP_PADDING
  );
};

const getMaximimSectionWidth = sections => {
  return Math.max(...sections.map(getSectionWidth));
};

export {
  SEAT_SIZE,
  SEATS_DISTANCE,
  SUBSECTION_PADDING,
  SECTIONS_MARGIN,
  SECTION_TOP_PADDING,
  getSubsectionWidth, 
  getSubsectionHeight, 
  getSectionWidth, 
  getSectionHeight,
  getMaximimSectionWidth
};