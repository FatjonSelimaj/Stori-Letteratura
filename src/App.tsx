import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
  return (
    <button className="back-to-home" onClick={() => navigate("/")}>
      Torna alla Home
    </button>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Benvenuti su Storia e Letteratura</h1>
          <p className="App-subtitle">
            Esplora articoli e approfondimenti letterari e storici
          </p>
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
          <BackToHomeButton />
          <p>© {new Date().getFullYear()} Storia e Letteratura. Tutti i diritti riservati.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
