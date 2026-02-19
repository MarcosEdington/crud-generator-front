import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import EntidadesList from './pages/EntidadesList'; // Importe a nova página

// Importações globais de estilo que instalamos
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'animate.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota inicial: Página de Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rota do Painel: Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/entidades" element={<EntidadesList />} />
      </Routes>
    </Router>
  );
}

export default App;