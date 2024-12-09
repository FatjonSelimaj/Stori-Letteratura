import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ArticleDetail.css";
import { FaFacebook, FaTwitter, FaWhatsapp, FaShareAlt, FaTimes, FaEnvelope } from "react-icons/fa";

const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Rimuove i link "modifica"
  doc.querySelectorAll('a[href*="action=edit"]').forEach((el) => el.remove());
  doc.querySelectorAll("a").forEach((el) => {
    if (el.textContent?.toLowerCase().includes("modifica")) {
      el.remove();
    }
  });

  // Disabilita tutti i link rendendoli non cliccabili
  doc.querySelectorAll("a").forEach((link) => {
    link.removeAttribute("href");
    link.style.pointerEvents = "none";
    link.style.color = "#888";
    link.style.textDecoration = "none";
    link.style.cursor = "default";
  });

  return doc.body.innerHTML;
};

const ArticleDetail: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [articleHTML, setArticleHTML] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pageid) {
      setError("Nessun ID articolo fornito.");
      setLoading(false);
      return;
    }

    const fetchArticleDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("https://it.wikipedia.org/w/api.php", {
          params: {
            action: "parse",
            format: "json",
            pageid: pageid,
            origin: "*",
            prop: "text|displaytitle",
          },
        });

        const page = response.data.parse;
        if (!page) {
          setError("Articolo non trovato.");
        } else {
          setTitle(page.title);
          setArticleHTML(cleanHTML(page.text["*"]));
        }
      } catch (error) {
        console.error("Errore durante il recupero dell'articolo:", error);
        setError("Impossibile caricare l'articolo.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
  }, [pageid]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Leggi questo interessante articolo: ${title}`;
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
          `Articolo interessante: ${title}`
        )}&body=${encodeURIComponent(`Leggi l'articolo completo qui: ${url}`)}`;
        break;
      default:
        break;
    }
    setShowSharePopup(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Torna indietro</button>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
      <h1>{title}</h1>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: articleHTML || "" }}
      />
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

export default ArticleDetail;
