import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ArticleList.css";

export type Article = {
  title: string;
  snippet: string;
  pageid: number;
  topic: string; // Identifica l'argomento
};

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDragEnabled, setIsDragEnabled] = useState<boolean>(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDragEnabled(window.innerWidth > 768); // Disabilita il drag per schermi piccoli
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [danteResponse, pirandelloResponse, secondaGuerraResponse] = await Promise.all([
          axios.get("https://it.wikipedia.org/w/api.php", {
            params: {
              action: "query",
              format: "json",
              list: "search",
              srsearch: "Dante Alighieri",
              origin: "*",
            },
          }),
          axios.get("https://it.wikipedia.org/w/api.php", {
            params: {
              action: "query",
              format: "json",
              list: "search",
              srsearch: "Luigi Pirandello",
              origin: "*",
            },
          }),
          axios.get("https://it.wikipedia.org/w/api.php", {
            params: {
              action: "query",
              format: "json",
              list: "search",
              srsearch: "Seconda Guerra Mondiale",
              origin: "*",
            },
          }),
        ]);

        const danteArticles = danteResponse.data.query.search.map((article: any) => ({
          title: article.title,
          snippet: article.snippet,
          pageid: article.pageid,
          topic: "dante",
        }));

        const pirandelloArticles = pirandelloResponse.data.query.search.map((article: any) => ({
          title: article.title,
          snippet: article.snippet,
          pageid: article.pageid,
          topic: "pirandello",
        }));

        const secondaGuerraArticles = secondaGuerraResponse.data.query.search.map((article: any) => ({
          title: article.title,
          snippet: article.snippet,
          pageid: article.pageid,
          topic: "seconda-guerra",
        }));

        setArticles([...danteArticles, ...pirandelloArticles, ...secondaGuerraArticles]);
      } catch (error) {
        console.error("Errore durante il recupero degli articoli:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(articles);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setArticles(items);
  };

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
    <DragDropContext onDragEnd={isDragEnabled ? handleDragEnd : () => {}}>
      <Droppable droppableId="articles" direction="vertical">
        {(provided) => (
          <div
            className="article-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {articles.map((article, index) => (
              <Draggable
                key={article.pageid.toString()}
                draggableId={article.pageid.toString()}
                index={index}
                isDragDisabled={!isDragEnabled} // Disabilita il drag su mobile
              >
                {(provided, snapshot) => (
                  <div
                    className={`article-card ${article.topic} ${
                      snapshot.isDragging ? "dragging" : ""
                    }`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...(isDragEnabled ? provided.dragHandleProps : {})}
                  >
                    <Link
                      to={`/articles/${article.pageid}`}
                      className="article-link"
                    >
                      <h3 className="article-title">{article.title}</h3>
                      <p
                        className="article-snippet"
                        dangerouslySetInnerHTML={{ __html: article.snippet }}
                      />
                      <span className="article-read-more">Leggi di più</span>
                    </Link>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ArticleList;
