import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/OpereDettaglio.css";
import { FaShareAlt, FaTimes, FaFacebook, FaWhatsapp, FaTwitter, FaEnvelope } from "react-icons/fa";

type OperaDetail = {
  title: string;
  extract: string;
  image?: string;
};

const OperaDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [opera, setOpera] = useState<OperaDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false); // Stato per gestire il popup di condivisione
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOperaDetail = async () => {
      try {
        const response = await axios.get("https://it.wikipedia.org/w/api.php", {
          params: {
            action: "query",
            format: "json",
            prop: "extracts|pageimages",
            exintro: true,
            explaintext: true,
            pageids: pageid,
            piprop: "original",
            origin: "*",
          },
        });

        const page = response.data.query.pages[pageid || ""];
        setOpera({
          title: page.title,
          extract: page.extract,
          image: page.original?.source,
        });
      } catch (error) {
        console.error("Errore durante il recupero del dettaglio:", error);
        setOpera(null);
      } finally {
        setLoading(false);
      }
    };

    if (pageid) fetchOperaDetail();
  }, [pageid]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Leggi questa interessante opera: ${opera?.title}`;
    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${text} ${url}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent(
          `Opera interessante: ${opera?.title}`
        )}&body=${encodeURIComponent(`Leggi l'opera completa qui: ${url}`)}`;
        break;
      default:
        break;
    }
    setShowSharePopup(false); // Chiudi il popup dopo la selezione
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (!opera) {
    return (
      <div className="no-detail">
        <p>Dettagli non disponibili.</p>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
      <h1>{opera.title}</h1>
      {opera.image && <img src={opera.image} alt={opera.title} className="detail-image" />}
      <p className="detail-extract">{opera.extract}</p>

      {/* Icona Condividi */}
      <div className="share-section">
        <FaShareAlt className="share-icon" onClick={() => setShowSharePopup(true)} />
        {showSharePopup && (
          <div className="share-overlay">
            <div className="share-popup">
              <div className="share-popup-header">
                <h3>Condividi</h3>
                <FaTimes className="close-icon" onClick={() => setShowSharePopup(false)} />
              </div>
              <p>Condividi questa opera su:</p>
              <div className="share-options">
                <button onClick={() => handleShare("facebook")}>
                  <FaFacebook /> Facebook
                </button>
                <button onClick={() => handleShare("whatsapp")}>
                  <FaWhatsapp /> WhatsApp
                </button>
                <button onClick={() => handleShare("twitter")}>
                  <FaTwitter /> Twitter
                </button>
                <button onClick={() => handleShare("email")}>
                  <FaEnvelope /> Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperaDettaglio;
