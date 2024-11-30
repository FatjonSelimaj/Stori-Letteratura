import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ArticlesPage from "./pages/ArticlePage";
import ArticleDetail from "./pages/ArticleDetail";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Menu fisso in alto */}
        <nav className="App-nav">
          <Link to="/" className="App-link">
            Home
          </Link>
          <Link to="/articles" className="App-link">
            Articles
          </Link>
        </nav>
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
          </Routes>
        </main>
        <footer className="App-footer">
          <p>© {new Date().getFullYear()} Storia e Letteratura. Tutti i diritti riservati.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
