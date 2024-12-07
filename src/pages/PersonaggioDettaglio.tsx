import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ArticleDetail.css";
import { FaShareAlt, FaTimes, FaFacebook, FaWhatsapp, FaTwitter, FaEnvelope } from "react-icons/fa";

type ArticleDetail = {
  title: string;
  extract: string;
  image?: string;
};

const PersonaggioDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false); // Stato per popup condivisione
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticleDetail = async () => {
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
            prop: "extracts|pageimages",
            exintro: true,
            explaintext: true,
            pageids: pageid,
            piprop: "original",
            origin: "*",
          },
        });

        const page = response.data.query?.pages?.[pageid];

        if (page) {
          setArticle({
            title: page.title,
            extract: page.extract || "Nessuna descrizione disponibile.",
            image: page.original?.source,
          });
        } else {
          console.error("Articolo non trovato.");
          setArticle(null);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetail();
  }, [pageid]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Dai un'occhiata a questo interessante articolo: ${article?.title}`;
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
          `Articolo interessante: ${article?.title}`
        )}&body=${encodeURIComponent(`Leggi l'articolo completo qui: ${url}`)}`;
        break;
      default:
        break;
    }
    setShowSharePopup(false); // Chiudi il popup
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="no-article">
        <p>Dettagli non disponibili.</p>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
      <h1>{article.title}</h1>
      {article.image && (
        <img src={article.image} alt={article.title} className="article-image" />
      )}
      <p className="article-extract">{article.extract}</p>

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
                <button className="facebook" onClick={() => handleShare("facebook")}>
                  <FaFacebook /> Facebook
                </button>
                <button className="whatsapp" onClick={() => handleShare("whatsapp")}>
                  <FaWhatsapp /> WhatsApp
                </button>
                <button className="twitter" onClick={() => handleShare("twitter")}>
                  <FaTwitter /> Twitter
                </button>
                <button className="email" onClick={() => handleShare("email")}>
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

export default PersonaggioDettaglio;
