import { useState } from "react";
import axios from "axios";
import { AppContext } from "../AppContext";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAlert } from "../AlertContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import "../styles/HomePage.css";

function HomePage() {
  const location = useLocation();
  const history = useHistory();
  const { backendDomain } = useContext(AppContext);

  return <div className=""></div>;
}

export default HomePage;
