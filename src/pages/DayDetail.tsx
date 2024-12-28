import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/DayDetail.css";
import { FaFacebook, FaTwitter, FaWhatsapp, FaShareAlt, FaTimes, FaEnvelope, FaLink, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";

const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Rimuove link "modifica"
  doc.querySelectorAll('a[href*="action=edit"]').forEach((el) => el.remove());

  // Disabilita tutti i link esterni
  doc.querySelectorAll("a").forEach((link) => {
    if (link instanceof HTMLElement) {
      link.removeAttribute("href");
      link.style.pointerEvents = "none";
      link.style.color = "#888";
      link.style.textDecoration = "none";
      link.style.cursor = "default";
    }
  });

  // Rimuove tabelle, liste non ordinate e liste ordinate
  doc.querySelectorAll("table, ul, ol").forEach((el) => el.remove());

  // Mantiene solo paragrafi, titoli e immagini
  doc.querySelectorAll("div, section, article").forEach((element) => {
    preserveTextTitlesAndImages(element);
  });

  return doc.body.innerHTML;
};

// Funzione per mantenere solo testo, immagini e titoli
const preserveTextTitlesAndImages = (element: Element): void => {
  const childNodes = Array.from(element.childNodes);

  childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childElement = child as HTMLElement;

      // Mantiene solo i titoli (h1-h6), paragrafi (<p>) e immagini (<img>)
      if (
        !/^H[1-6]$/i.test(childElement.tagName) && // Non è un titolo
        childElement.nodeName !== "P" && // Non è un paragrafo
        childElement.nodeName !== "IMG" // Non è un'immagine
      ) {
        childElement.remove(); // Rimuove tutti gli altri elementi
      }
    } else if (child.nodeType !== Node.TEXT_NODE) {
      child.remove(); // Rimuove nodi non di testo
    }
  });
};

const DayDetail: React.FC = () => {
  const [eventDetail, setEventDetail] = useState<string>("Caricamento evento...");
  const [title, setTitle] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [articleHTML, setArticleHTML] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");

  // Usa useCallback per memorizzare la funzione ed evitare warning
  const fetchEventDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://it.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`
      );

      if (response.data && response.data.events && response.data.events.length > 0) {
        const firstEvent = response.data.events[0];
        setTitle(firstEvent.text);
        setEventDetail(firstEvent.text);

        if (firstEvent.pages && firstEvent.pages[0]) {
          const page = firstEvent.pages[0];
          if (page.thumbnail) {
            setImage(page.thumbnail.source);
          }

          const pageid = page.pageid;
          const articleResponse = await axios.get("https://it.wikipedia.org/w/api.php", {
            params: {
              action: "parse",
              format: "json",
              pageid: pageid,
              origin: "*",
              prop: "text|displaytitle",
            },
          });

          const articleHTML = articleResponse.data.parse?.text["*"];
          if (articleHTML) {
            setArticleHTML(cleanHTML(articleHTML));
          }
        }
      } else {
        setEventDetail("Nessun evento storico trovato per oggi.");
      }
    } catch (error) {
      console.error("Errore durante il caricamento dell'evento:", error);
      setError("Errore nel recupero dell'evento.");
    } finally {
      setLoading(false);
    }
  }, [month, day]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Scopri l'evento storico di oggi: ${title}`;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://api.whatsapp.com/send?text=${text} ${url}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent("Evento storico del giorno")}&body=${encodeURIComponent(
          `Leggi l'articolo completo qui: ${url}`
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url).then(() => {
          setCopiedMessage(true);
          setTimeout(() => setCopiedMessage(false), 2000);
        });
        break;
      default:
        break;
    }

    setShowSharePopup(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    let currentY = margin;

    // Aggiunge il titolo
    if (title) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      const titleLines = doc.splitTextToSize(title, 180);
      titleLines.forEach((line: string | string[]) => {
        if (currentY + 10 > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin, currentY);
        currentY += 10;
      });
    }

    // Aggiunge il dettaglio dell'evento
    if (eventDetail) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const eventLines = doc.splitTextToSize(eventDetail, 180);
      eventLines.forEach((line: string | string[]) => {
        if (currentY + 10 > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin, currentY);
        currentY += 10;
      });
    }

    // Aggiunge il contenuto dell'articolo
    if (articleHTML) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = articleHTML;
      const cleanText = tempDiv.textContent || tempDiv.innerText || "";
      const contentLines = doc.splitTextToSize(cleanText, 180);

      contentLines.forEach((line: string | string[]) => {
        if (currentY + 10 > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
        }
        doc.text(line, margin, currentY);
        currentY += 10;
      });
    }

    // Salva il PDF
    doc.save(`${title || "evento-del-giorno"}.pdf`);
  };

  if (loading) return <div className="loading">Caricamento evento storico...</div>;
  if (error)
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Torna indietro</button>
      </div>
    );

  return (
    <div className="article-detail">
      <h1>{title}</h1>
      {image && <img src={image} alt="Immagine dell'evento" className="article-image" />}
      <div className="article-content">
        <h2>{title}</h2>
        <p>{eventDetail}</p>
        {articleHTML && <div dangerouslySetInnerHTML={{ __html: articleHTML }} />}
      </div>
      <div className="share-section">
        <FaShareAlt className="share-icon" onClick={() => setShowSharePopup(true)} />
        <button
          onClick={handleDownloadPDF}
          className="pdf-download-button"
          title="Scarica PDF"
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem",
          }}
        >
          <FaDownload />
        </button>
        {showSharePopup && (
          <div className="share-overlay">
            <div className="share-popup">
              <div className="share-popup-header">
                <h3>Condividi</h3>
                <FaTimes className="close-icon" onClick={() => setShowSharePopup(false)} />
              </div>
              <div className="share-options">
                <button onClick={() => handleShare("facebook")}>
                  <FaFacebook /> Facebook
                </button>
                <button onClick={() => handleShare("whatsapp")}>
                  <FaWhatsapp /> WhatsApp
                </button>
                <button onClick={() => handleShare("twitter")}>
                  <FaTwitter /> Twitter
                </button>
                <button onClick={() => handleShare("email")}>
                  <FaEnvelope /> Email
                </button>
                <button onClick={() => handleShare("copy")}>
                  <FaLink /> Copia Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {copiedMessage && <div className="toast-message">Link copiato negli appunti!</div>}
    </div>
  );
};

export default DayDetail;
