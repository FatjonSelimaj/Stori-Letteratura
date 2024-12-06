import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/Card.css";

type Article = {
  title: string;
  snippet: string;
  pageid: number;
};

const PersonaggiStorici: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const personaggi = ["Giulio Cesare", "Napoleone Bonaparte", "Cleopatra", "Leonardo da Vinci"];
        const responses = await Promise.all(
          personaggi.map((name) =>
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

        setArticles(formattedArticles);
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
      <h1>Personaggi Storici</h1>
      <div className="cards-list">
        {articles.map((article) => (
          <div className="card" key={article.pageid}>
            <h2>{article.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: article.snippet }}></p>
            <Link to={`/personaggi-storici/${article.pageid}`} className="card-link">
              Leggi di più
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaggiStorici;
