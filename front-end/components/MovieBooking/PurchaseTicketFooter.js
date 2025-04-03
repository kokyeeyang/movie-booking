import React from "react";

const Footer = ({ selectedSeats, onPurchase }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 -2px 5px rgba(0,0,0,0.2)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h4>Selected Seats:</h4>
        <p>{selectedSeats.join(", ") || "Please select a seat"}</p>
      </div>
      <button onClick={onPurchase} style={{ padding: "10px 20px" }}>
        Purchase
      </button>
    </div>
  );
};

export default Footer;
