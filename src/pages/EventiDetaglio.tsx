import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EventiDetaglio.css";
import { FaShareAlt, FaTimes, FaFacebook, FaWhatsapp, FaTwitter, FaEnvelope } from "react-icons/fa";

type EventDetail = {
  title: string;
  extract: string;
  image?: string;
  timeline?: string[]; // Cronologia degli eventi
  keyPoints?: string[]; // Punti chiave
  relatedDetails?: { title: string; extract: string }[]; // Dettagli correlati
};

const EventoDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false); // Stato per il popup di condivisione

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!pageid) {
        console.error("PageID non fornito.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://it.wikipedia.org/w/api.php", {
          params: {
            action: "query",
            format: "json",
            prop: "extracts|pageimages|categories",
            pageids: pageid,
            piprop: "original",
            exintro: true,
            explaintext: true,
            cllimit: "max",
            origin: "*",
          },
        });

        const page = response.data.query?.pages?.[pageid];
        if (!page) {
          console.error("Pagina non trovata.");
          setEvent(null);
          return;
        }

        setEvent({
          title: page.title,
          extract: page.extract || "Nessuna descrizione disponibile.",
          image: page.original?.source,
        });
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [pageid]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Leggi questo interessante articolo: ${event?.title}`;
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
          `Articolo interessante: ${event?.title}`
        )}&body=${encodeURIComponent(`Leggi l'articolo completo qui: ${url}`)}`;
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

  if (!event) {
    return (
      <div className="no-article">
        <p>Dettagli non disponibili.</p>
        <button onClick={() => navigate(-1)}>Torna indietro</button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
      <h1>{event.title}</h1>
      {event.image && <img src={event.image} alt={event.title} className="article-image" />}
      <p className="article-extract">{event.extract}</p>

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
              <p>Condividi questo articolo su:</p>
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

export default EventoDettaglio;
