import React from 'react';
import { PackageProvider } from './context/PackageContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CacheStatus from './components/common/CacheStatus';

// Page Components
import HomePage from './pages/HomePage';
import ModernHomePage from './pages/ModernHomePage';
import FibrePage from './pages/FibrePage';
import LTEPage from './pages/LTEPage';
import BookingPage from './pages/BookingPage';
import SignupPage from './pages/SignupPage';
import LTESignupPage from './pages/LTESignupPage';
import PackageSelectionPage from './pages/PackageSelectionPage';
import PromoDealsPage from './pages/PromoDealsPage';

// New Design System Components
import BottomNavigation from './components/design-system/BottomNavigation';
import ModernFibrePage from './components/ModernFibrePage';

function App() {
  return (
    <PackageProvider>
      <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ModernHomePage />} />
            <Route path="/old-home" element={<HomePage />} />
            <Route path="/fibre" element={<ModernFibrePage />} />
            <Route path="/old-fibre" element={<FibrePage />} />
            <Route path="/lte-5g" element={<LTEPage />} />
            <Route path="/lte" element={<LTEPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/lte-signup" element={<LTESignupPage />} />
            <Route path="/package-selection" element={<PackageSelectionPage />} />
            <Route path="/promo-deals" element={<PromoDealsPage />} />
          </Routes>
        </main>
        <Footer />
        <BottomNavigation />
        <CacheStatus />
      </div>
    </Router>
    </PackageProvider>
  );
}

export default App;