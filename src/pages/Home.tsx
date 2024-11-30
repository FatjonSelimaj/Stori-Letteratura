import React, { useState, useEffect } from "react";
import { searchWikipediaArticles } from "../services/wikipedia";
import ArticleList from "../components/ArticleList";
import "./Home.css";

type Article = {
  title: string;
  snippet: string;
  pageid: number;
};

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialArticles = async () => {
      setLoading(true);
      try {
        const initialArticles = await searchWikipediaArticles("Dante Alighieri");
        setArticles(initialArticles);
      } catch (err) {
        setError("Errore durante il caricamento iniziale degli articoli.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialArticles();
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Storia e Letteratura</h1>
        <p>Scopri articoli affascinanti sui grandi personaggi e gli eventi della storia.</p>
      </header>
      <main className="home-content">
        {error && (
          <p className="home-error">{error}</p>
        )}
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Caricamento in corso...</p>
          </div>
        ) : (
          <ArticleList/>
        )}
        {!loading && !articles.length && (
          <p className="home-no-articles">
            Nessun articolo trovato.
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;
