import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ArticleDetail.css";

type Article = {
  title: string;
  content: string;
  image?: string;
  categories?: string[];
  summary?: string; // Breve sintesi
  keyPoints?: string[]; // Lista di punti chiave
  timeline?: string[]; // Eventi in sequenza
  relatedLinks?: { title: string; url: string }[]; // Link correlati
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
  const navigate = useNavigate(); // Inizializza navigate


  useEffect(() => {
    const fetchArticleDetails = async () => {
      try {
        const response = await axios.get(`https://it.wikipedia.org/w/api.php`, {
          params: {
            action: "query",
            format: "json",
            prop: "extracts|pageimages|categories|info",
            explaintext: true,
            redirects: 1,
            origin: "*",
            pageids: pageid,
            piprop: "original",
            cllimit: "max",
            inprop: "url",
          },
        });
    
        const page = Object.values(response.data.query.pages)[0] as any;
    
        setArticle({
          title: page.title,
          content: stripHtmlTags(page.extract),
          image: page.original?.source || "",
          categories: page.categories
            ? page.categories.map((cat: any) => cat.title.replace("Category:", ""))
            : [],
          relatedLinks: [
            { title: "Link ufficiale", url: page.fullurl },
            { title: "Altro su Wikipedia", url: `https://it.wikipedia.org/wiki/${page.title}` },
          ],
          summary: "Breve sintesi o descrizione da aggiungere qui.",
          timeline: ["Inizio evento - 1940", "Fine evento - 1945"], // Puoi aggiungere eventi storici
        });
      } catch (error) {
        console.error("Errore durante il recupero dell'articolo:", error);
        setArticle(null);
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
    <button className="back-button" onClick={() => navigate(-1)}>
      Torna indietro
    </button>
    <h1>{article.title}</h1>
    {article.image && (
      <img src={article.image} alt={article.title} className="article-image" />
    )}
    <div className="article-summary">
      <h2>Sintesi</h2>
      <p>{article.summary || "Sintesi non disponibile."}</p>
    </div>
    <div className="article-content">{formatContent(article.content)}</div>
    {article.keyPoints && (
      <div className="article-key-points">
        <h2>Punti Chiave</h2>
        <ul>
          {article.keyPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    )}
    {article.timeline && (
      <div className="article-timeline">
        <h2>Cronologia</h2>
        <ul>
          {article.timeline.map((event, index) => (
            <li key={index}>{event}</li>
          ))}
        </ul>
      </div>
    )}
    {article.relatedLinks && (
      <div className="article-related-links">
        <h2>Risorse Correlate</h2>
        <ul>
          {article.relatedLinks.map((link, index) => (
            <li key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>  
  );
};

export default ArticleDetail;
