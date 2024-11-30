import React, { useState, useEffect } from "react";
import ArticleList from "../components/ArticleList";

type Article = {
  title: string;
  snippet: string;
  pageid: number;
};

const ArticlesPage: React.FC = () => {
  const [, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://it.wikipedia.org/w/api.php?action=query&list=search&srsearch=italian%20authors&format=json&origin=*`
        );
        const data = await response.json();
        const searchResults = data.query.search.map((result: any) => ({
          title: result.title,
          snippet: result.snippet,
          pageid: result.pageid,
        }));
        setArticles(searchResults);
      } catch (error) {
        console.error("Errore durante il recupero degli articoli:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p>Caricamento articoli...</p>;
  }

  return <ArticleList/>;
};

export default ArticlesPage;
