import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EventiDetaglio.css";

type EventDetail = {
  title: string;
  extract: string;
  image?: string;
};

const EventoDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          setEvent({
            title: page.title,
            extract: page.extract || "Nessuna descrizione disponibile.",
            image: page.original?.source,
          });
        } else {
          console.error("Evento non trovato.");
          setEvent(null);
        }
      } catch (error) {
        console.error("Errore durante il recupero dei dettagli:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [pageid]);

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
      <h1>{event.title}</h1>
      {event.image && (
        <img src={event.image} alt={event.title} className="article-image" />
      )}
      <p className="article-extract">{event.extract}</p>
      <button className="back-button" onClick={() => navigate(-1)}>
        Torna indietro
      </button>
    </div>
  );
};

export default EventoDettaglio;
