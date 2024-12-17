import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { FaSearch } from "react-icons/fa";

const Home: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  // Sezioni disponibili e i relativi percorsi
  const sections = [
    { key: "personaggi-storici", path: "/personaggi-storici" },
    { key: "opere-letterarie", path: "/opere-letterarie" },
    { key: "articles", path: "/articles" },
    { key: "eventi-storici", path: "/eventi-storici" },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://it.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${query}&origin=*`
      );
      const data = await response.json();

      const combinedResults = data?.query?.search || [];
      setResults(combinedResults);
    } catch (error) {
      console.error("Errore durante la ricerca:", error);
    }
  };

  const handleResultClick = (result: any) => {
    // Trova la sezione corretta in base al titolo
    const matchedSection = sections.find((section) =>
      result.title.toLowerCase().includes(section.key)
    );

    if (matchedSection) {
      // Naviga alla sezione corretta con l'id
      navigate(`${matchedSection.path}/${result.pageid}`);
    } else {
      // Fallback: Naviga alla pagina generica di dettaglio
      navigate(`/articles/${result.pageid}`);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>𝓢𝓽𝓸𝓻𝓲𝓪 𝓔 𝓛𝓮𝓽𝓽𝓮𝓻𝓪𝓽𝓾𝓻𝓪</h1>
        <p>Scopri i grandi protagonisti e gli eventi che hanno plasmato la nostra cultura.</p>
      </header>

      <main className="home-content">
        {/* Barra di ricerca */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Cerca qualcosa..."
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (value.trim() === "") {
                setResults([]); // Cancella i risultati quando il campo è vuoto
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(); // Esegue la ricerca premendo Invio
            }}
          />

          <button onClick={handleSearch} title="Cerca">
            <FaSearch />
          </button>
        </div>

        {/* Risultati di ricerca */}
        {results.length > 0 && (
          <div className="search-results">
            <h2>Risultati della ricerca</h2>
            <ul>
              {results.map((result) => (
                <li key={result.pageid} onClick={() => handleResultClick(result)}>
                  <strong>{result.title}</strong>
                  <p>{result.snippet.replace(/<\/?[^>]+(>|$)/g, "")}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sezioni tematiche */}
        <div className="home-sections">
          <div className="home-section">
            <h2>Personaggi Storici</h2>
            <p>Esplora le vite di uomini e donne che hanno cambiato il mondo.</p>
            <Link to="/personaggi-storici" className="home-link">
              Scopri di più
            </Link>
          </div>
          <div className="home-section">
            <h2>Opere Letterarie</h2>
            <p>Immergiti nei capolavori della letteratura mondiale.</p>
            <Link to="/opere-letterarie" className="home-link">
              Esplora ora
            </Link>
          </div>
          <div className="home-section">
            <h2>Lista Articoli</h2>
            <p>Consulta una lista completa di articoli e approfondimenti.</p>
            <Link to="/articles" className="home-link">
              Visualizza articoli
            </Link>
          </div>
          <div className="home-section">
            <h2>Eventi Storici</h2>
            <p>Ripercorri gli eventi che hanno segnato l'umanità.</p>
            <Link to="/eventi-storici" className="home-link">
              Scopri di più
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
