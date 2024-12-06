import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Card.css";

type Event = {
  title: string;
  snippet: string;
  pageid: number;
};

const EventiStorici: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventi = ["Seconda Guerra Mondiale", "Rivoluzione Francese", "Scoperta dell'America"];
        const responses = await Promise.all(
          eventi.map((name) =>
            axios.get("https://it.wikipedia.org/w/api.php", {
              params: {
                action: "query",
                format: "json",
                list: "search",
                srsearch: name,
                origin: "*",
              },
            })
          )
        );

        const formattedEvents = responses.flatMap((response) =>
          response.data?.query?.search.map((event: any) => ({
            title: event.title,
            snippet: event.snippet,
            pageid: event.pageid,
          })) || []
        );

        const uniqueEvents = Array.from(
          new Map(formattedEvents.map((event) => [event.pageid, event])).values()
        );

        setEvents(uniqueEvents);
      } catch (error) {
        console.error("Errore durante il recupero degli eventi:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="no-articles">
        <p>Nessun evento trovato.</p>
      </div>
    );
  }

  return (
    <div className="cards-container">
      <h1>Eventi Storici</h1>
      <div className="cards-list">
        {events.map((event) => (
          <div className="card" key={event.pageid}>
            <h2>{event.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: event.snippet }}></p>
            <Link to={`/eventi-storici/${event.pageid}`} className="card-link">
              Leggi di più
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventiStorici;
