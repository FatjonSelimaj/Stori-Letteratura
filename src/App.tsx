import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa";
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

// Componente per il bottone "Torna alla Home"
const BackToHomeButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <button className="back-to-home" onClick={() => navigate("/")}>
      Torna alla Home
    </button>
  );
};

// Componente principale dell'app
const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <div className="App">
      <header className="App-header">
        {location.pathname === "/" && <h1>Benvenuti su Storia e Letteratura</h1>}
        <BackToHomeButton />
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
          <a href="https://youtube.com/@storiarletteratura?si=s4WrmdEfTlOoBddg" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className="social-icon youtube" />
          </a>
          <a href="https://www.instagram.com/storia.letteratura?igsh=MXRzZHY1dHNpbWo2Mw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className="social-icon instagram" />
          </a>
          <a href="https://www.facebook.com/share/5CRUGhzH5SYj4iiL/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook className="social-icon facebook" />
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
      <AppContent />
    </Router>
  );
}

export default App;
