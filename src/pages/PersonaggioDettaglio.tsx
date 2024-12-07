import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ArticleDetail.css";

type ArticleDetail = {
  title: string;
  extract: string;
  image?: string;
};

const PersonaggioDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Inizializza navigate

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
    </div>
  );
};

export default PersonaggioDettaglio;
