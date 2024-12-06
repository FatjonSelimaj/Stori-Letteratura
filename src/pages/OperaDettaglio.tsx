import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/OpereDettaglio.css";

type OperaDetail = {
  title: string;
  extract: string;
  image?: string;
};

const OperaDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [opera, setOpera] = useState<OperaDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Inizializza navigate

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
      <h1>{opera.title}</h1>
      {opera.image && <img src={opera.image} alt={opera.title} className="detail-image" />}
      <p className="detail-extract">{opera.extract}</p>
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
    </div>
  );
};

export default OperaDettaglio;
