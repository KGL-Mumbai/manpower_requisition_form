import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import "../css/LoadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="5"  animationDuration="1.5s" />
    </div>
  );
};

export default LoadingSpinner;