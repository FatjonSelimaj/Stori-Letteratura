import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/OpereDettaglio.css";
import { FaShareAlt, FaTimes, FaFacebook, FaWhatsapp, FaTwitter, FaEnvelope, FaLink, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";

const cleanHTML = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Rimuove i link "modifica"
  doc.querySelectorAll('a[href*="action=edit"]').forEach((el) => el.remove());

  // Disabilita tutti i link (ma li lascia visibili)
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

  // Mantiene solo testo e titoli
  doc.querySelectorAll("div, section, article").forEach((element) => {
    preserveTextAndTitles(element);
  });

  return doc.body.innerHTML;
};

// Funzione per mantenere solo testo e titoli
const preserveTextAndTitles = (element: Element): void => {
  const childNodes = Array.from(element.childNodes);

  childNodes.forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const childElement = child as HTMLElement;

      // Mantiene solo i titoli (h1-h6) e il testo
      if (!/^H[1-6]$/i.test(childElement.tagName) && childElement.nodeName !== "P") {
        childElement.remove(); // Rimuove tutti gli altri elementi
      }
    } else if (child.nodeType !== Node.TEXT_NODE) {
      child.remove(); // Rimuove nodi non di testo
    }
  });
};

const OperaDettaglio: React.FC = () => {
  const { pageid } = useParams<{ pageid: string }>();
  const [operaHTML, setOperaHTML] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const navigate = useNavigate();
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    if (!pageid) {
      setError("Nessun ID opera fornito.");
      setLoading(false);
      return;
    }

    const fetchOperaDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("https://it.wikipedia.org/w/api.php", {
          params: {
            action: "parse",
            format: "json",
            pageid: pageid,
            origin: "*",
            prop: "text|displaytitle",
          },
        });

        const page = response.data.parse;
        if (!page) {
          setError("Opera non trovata.");
        } else {
          setTitle(page.title);
          setOperaHTML(cleanHTML(page.text["*"]));
        }
      } catch (error) {
        console.error("Errore durante il recupero dell'opera:", error);
        setError("Impossibile caricare l'opera.");
      } finally {
        setLoading(false);
      }
    };

    fetchOperaDetails();
  }, [pageid]);

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

    // Aggiunge il contenuto dell'opera
    if (operaHTML) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = operaHTML;
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

    doc.save(`${title || "opera"}.pdf`);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Leggi questa interessante opera: ${title}`;
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
      case "copy":
        navigator.clipboard.writeText(url).then(() => {
          setCopiedMessage(true);
          setTimeout(() => setCopiedMessage(false), 2000); // Mostra per 2 secondi
        });
        break;
      default:
        break;
    }
    setShowSharePopup(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Caricamento in corso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>Torna indietro</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <h1>{title}</h1>
      <div
        className="detail-content"
        dangerouslySetInnerHTML={{ __html: operaHTML || "" }}
      />

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
              <p>Condividi questa opera su:</p>
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
      {copiedMessage && (
        <div className="toast-message">
          Link copiato negli appunti!
        </div>
      )}
    </div>
  );
};

export default OperaDettaglio;
