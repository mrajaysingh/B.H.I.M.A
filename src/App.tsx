import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingNav from './components/LandingNav';
import Home from './pages/landing/Home';
import About from './pages/landing/About';
import Pricing from './pages/landing/Pricing';
import Contact from './pages/landing/Contact';
import Policy from './pages/landing/Policy';
import ChatApp from './ChatApp';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing Pages */}
        <Route path="/" element={
          <>
            <LandingNav />
            <Home />
          </>
        } />
        <Route path="/about" element={
          <>
            <LandingNav />
            <About />
          </>
        } />
        <Route path="/pricing" element={
          <>
            <LandingNav />
            <Pricing />
          </>
        } />
        <Route path="/contact" element={
          <>
            <LandingNav />
            <Contact />
          </>
        } />
        <Route path="/policy" element={
          <>
            <LandingNav />
            <Policy />
          </>
        } />

        {/* Main Chat Application */}
        <Route path="/bhima/*" element={<ChatApp />} />

        {/* Redirect to home for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;