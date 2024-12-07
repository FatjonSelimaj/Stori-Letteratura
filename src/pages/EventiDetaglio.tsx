import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EventiDetaglio.css";

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

        // Estrazione contenuti completi (testo e cronologia)
        const fullPageResponse = await axios.get("https://it.wikipedia.org/w/api.php", {
          params: {
            action: "parse",
            pageid: pageid,
            format: "json",
            prop: "text",
            origin: "*",
          },
        });

        const htmlContent = fullPageResponse.data.parse?.text["*"];
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");

        // Estrazione della cronologia
        const timelineSection = Array.from(doc.querySelectorAll("h2, h3"))
          .find((el) => el.textContent?.toLowerCase().includes("cronologia"))
          ?.nextElementSibling;
        const timeline = timelineSection
          ? Array.from(timelineSection.querySelectorAll("li"))
              .map((li) => li.textContent?.trim())
              .filter((item): item is string => Boolean(item)) // Filtra valori undefined
          : [];

        // Estrazione dei dettagli correlati
        const relatedSections = Array.from(doc.querySelectorAll("h2, h3"))
          .filter((el) => el.textContent?.toLowerCase().includes("vedi anche"))
          .map((section) => {
            const title = section.textContent || "Sezione correlata";
            const content = section.nextElementSibling?.textContent || "Dettagli non disponibili.";
            return { title, extract: content };
          });

        setEvent({
          title: page.title,
          extract: page.extract || "Nessuna descrizione disponibile.",
          image: page.original?.source,
          timeline: timeline,
          keyPoints: timeline.slice(0, 3), // Esempio di punti chiave dai primi elementi della cronologia
          relatedDetails: relatedSections,
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
      {event.image && (
        <img src={event.image} alt={event.title} className="article-image" />
      )}
      <p className="article-extract">{event.extract}</p>
      {event.timeline && event.timeline.length > 0 && (
        <div className="event-timeline">
          <h2>Cronologia</h2>
          <ul>
            {event.timeline.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
      {event.keyPoints && event.keyPoints.length > 0 && (
        <div className="event-key-points">
          <h2>Punti Chiave</h2>
          <ul>
            {event.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
      {event.relatedDetails && event.relatedDetails.length > 0 && (
        <div className="event-related-details">
          <h2>Dettagli Correlati</h2>
          <ul>
            {event.relatedDetails.map((detail, index) => (
              <li key={index}>
                <h3>{detail.title}</h3>
                <p>{detail.extract}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventoDettaglio;
