import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ArticleDetail.css";

type Article = {
  title: string;
  content: string;
  image?: string;
  categories?: string[];
};

// Funzione per rimuovere i tag HTML
const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

// Funzione per formattare il contenuto in paragrafi e titoli
const formatContent = (content: string): React.ReactNode[] => {
  const sections = content.split("\n\n"); // Dividi per paragrafi
  return sections.map((section, index) => {
    if (section.startsWith("###")) {
      const title = section.replace(/^###\s*/, ""); // Rimuove "###"
      return (
        <div key={index} className="section-title">
          <h2>{title}</h2>
        </div>
      );
    } else {
      return (
        <div key={index} className="section-content">
          <p>{section}</p>
        </div>
      );
    }
  });
};

const ArticleDetail: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await axios.get(
          `https://it.wikipedia.org/w/api.php`,
          {
            params: {
              action: "query",
              format: "json",
              prop: "extracts|pageimages|categories",
              explaintext: true,
              redirects: 1,
              origin: "*",
              pageids: pageid,
              piprop: "original",
              cllimit: "max",
            },
          }
        );

        const page = Object.values(response.data.query.pages)[0] as any;

        setArticle({
          title: page.title,
          content: stripHtmlTags(page.extract),
          image: page.original?.source || "",
          categories: page.categories
            ? page.categories.map((cat: any) =>
                cat.title.replace("Category:", "")
              )
            : [],
        });
      } catch (error) {
        console.error("Errore durante il recupero dell'articolo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleDetails();
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
        <p>Articolo non trovato!</p>
      </div>
    );
  }

  return (
    <div className="article-detail">
      <h1>{article.title}</h1>
      {article.image && (
        <img
          src={article.image}
          alt={article.title}
          className="article-image"
        />
      )}
      <div className="article-content">{formatContent(article.content)}</div>
      
    </div>
  );
};

export default ArticleDetail;
