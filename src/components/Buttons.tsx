import React from "react";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Pulsante per tornare alla Home
export const BackToHomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      className="icon-button home-button"
      onClick={() => navigate("/")}
      title="Torna alla Home"
    >
      <FaHome />
    </button>
  );
};

// Pulsante per tornare indietro
export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      className="icon-button back-button"
      onClick={() => navigate(-1)}
      title="Torna indietro"
    >
      <FaArrowLeft />
    </button>
  );
};
