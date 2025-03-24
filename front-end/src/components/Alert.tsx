import React from "react";
import { useAlert } from "../AlertContext";

const Alert: React.FC = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  return <div className={`alert alert-${alert.type}`}>{alert.message}</div>;
};

export default Alert;
