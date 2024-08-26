import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import { Link, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useAlert } from "../AlertContext";
import {} from "";

const ViewAvailableMovies = () => {
  const location = useLocation();
  const history = useHistory();

  const { backendDomain, user } = useContext(AppContext);
};
