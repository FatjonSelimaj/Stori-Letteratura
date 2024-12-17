import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import "./styles/App.css";
import Home from "./pages/Home";
import ArticlesPage from "./pages/ArticlePage";
import ArticleDetail from "./pages/ArticleDetail";
import PersonaggiStorici from "./components/PersonaggiStorici";
import PersonaggioDettaglio from "./pages/PersonaggioDettaglio";
import OpereLetterarie from "./components/OpereLetterarie";
import OperaDettaglio from "./pages/OperaDettaglio";
import EventiStorici from "./components/EventiStorici";
import EventoDettaglio from "./pages/EventiDetaglio";
import { Analytics } from "@vercel/analytics/react";
import { BackToHomeButton, BackButton } from "./components/Buttons"; // Pulsanti con le icone

// Componente principale dell'app
const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="App">
      <header className="App-header">
        {location.pathname === "/" && <h1>Benvenuti su Storia e Letteratura</h1>}
        {location.pathname !== "/" && (
          <div className="navigation-buttons">
            <BackButton />
            <BackToHomeButton />
          </div>
        )}
      </header>

      <main className="App-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:pageid" element={<ArticleDetail />} />
          <Route path="/personaggi-storici" element={<PersonaggiStorici />} />
          <Route path="/personaggi-storici/:pageid" element={<PersonaggioDettaglio />} />
          <Route path="/opere-letterarie" element={<OpereLetterarie />} />
          <Route path="/opere-letterarie/:pageid" element={<OperaDettaglio />} />
          <Route path="/eventi-storici" element={<EventiStorici />} />
          <Route path="/eventi-storici/:pageid" element={<EventoDettaglio />} />
        </Routes>
      </main>

      <footer className="App-footer">
        <p>© {new Date().getFullYear()} Storia e Letteratura. Tutti i diritti riservati.</p>
        <div className="social-links">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="social-icon youtube" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="social-icon instagram" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="social-icon facebook" />
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok className="social-icon tiktok" />
          </a>
        </div>
      </footer>
    </div>
  );
};

// Router principale
function App() {
  return (
    <Router>
      <Analytics />
      <AppContent />
    </Router>
  );
}

export default App;
