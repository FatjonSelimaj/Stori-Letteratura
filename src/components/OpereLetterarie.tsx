import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/EventiStorici.css";

type Article = {
  title: string;
  snippet: string;
  pageid: number;
};

const OpereLetterarie: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const opere = ["La Divina Commedia", "I Promessi Sposi", "Il Decameron"];
        const responses = await Promise.all(
          opere.map((name) =>
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

        const formattedArticles = responses.flatMap((response) =>
          response.data?.query?.search.map((article: any) => ({
            title: article.title,
            snippet: article.snippet,
            pageid: article.pageid,
          })) || []
        );

        const uniqueArticles = Array.from(
          new Map(formattedArticles.map((article) => [article.pageid, article])).values()
        );

        setArticles(uniqueArticles);
      } catch (error) {
        console.error("Errore durante il recupero degli articoli:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="no-articles">
        <p>Nessun articolo trovato.</p>
      </div>
    );
  }

  return (
    <div className="cards-container">
      <h1>Opere Letterarie</h1>
      <div className="cards-list">
        {articles.map((article) => (
          <Link to={`/opere-letterarie/${article.pageid}`} key={article.pageid} className="card-link">
            <div className="card">
              <h2>{article.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: article.snippet }}></p>
              <span className="card-read-more">Leggi di più</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OpereLetterarie;
