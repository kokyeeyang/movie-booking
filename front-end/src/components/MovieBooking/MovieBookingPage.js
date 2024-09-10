import React from "react";
import MainStage from "../MainStage";
import "../../styles/style.css";
const movieBookingPage = (props) => {
  console.log(props.location.state);
  return (
      <MainStage/>
    );
}

export default movieBookingPage;