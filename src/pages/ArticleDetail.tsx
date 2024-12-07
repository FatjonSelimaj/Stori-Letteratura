import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ArticleDetail.css";
import { FaFacebook, FaTwitter, FaWhatsapp, FaShareAlt, FaTimes, FaEnvelope } from "react-icons/fa";

const ArticleDetail: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [article, setArticle] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showSharePopup, setShowSharePopup] = useState(false); // Stato per il popup di condivisione
  const navigate = useNavigate();

  const fetchArticleDetails = async () => {
    try {
      const response = await axios.get(`https://it.wikipedia.org/w/api.php`, {
        params: {
          action: "query",
          format: "json",
          prop: "extracts|pageimages|categories|info",
          explaintext: true,
          redirects: 1,
          origin: "*",
          pageids: pageid,
          piprop: "original",
          cllimit: "max",
          inprop: "url",
        },
      });

      const page = Object.values(response.data.query.pages)[0] as any;

      setArticle({
        title: page.title,
        content: page.extract,
        image: page.original?.source || "",
      });
    } catch (error) {
      console.error("Errore durante il recupero dell'articolo:", error);
      setArticle(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchArticleDetails();
  },);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Leggi questo interessante articolo: ${article?.title}`;
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
    };
    setShowSharePopup(false); // Chiudi il popup dopo la selezione
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
        <p>Articolo non trovato!</p>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
      <h1>{article.title}</h1>
      {article.image && <img src={article.image} alt={article.title} className="article-image" />}
      <div className="article-content">
        <p>{article.content}</p>
      </div>

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

export default ArticleDetail;