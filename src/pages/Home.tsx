import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>𝓢𝓽𝓸𝓻𝓲𝓪 𝓔 𝓛𝓮𝓽𝓽𝓮𝓻𝓪𝓽𝓾𝓻𝓪</h1>
        <p>Scopri i grandi protagonisti e gli eventi che hanno plasmato la nostra cultura.</p>
      </header>

      <main className="home-content">
        {/* Banner */}
        <div className="home-banner">
          <img
            src="/image/logo.jpg"
            alt="Storia e Letteratura"
            className="home-banner-image"
          />
          <blockquote>
            <p>"Non c'è storia senza memoria, né letteratura senza anima."</p>
            <cite>- Anonimo</cite>
          </blockquote>
        </div>

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
