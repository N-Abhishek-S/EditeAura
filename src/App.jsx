import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCTA from './components/FloatingCTA';
import Home from './pages/Home';
import Packages from './pages/Packages';
import './App.css';

function App() {
  return (
    <div className="relative min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black overflow-hidden font-sans">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <FloatingCTA />

      <Footer />
    </div>
  );
}

export default App;
