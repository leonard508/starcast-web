import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Page Components
import HomePage from './pages/HomePage';
import FibrePage from './pages/FibrePage';
import LTEPage from './pages/LTEPage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import SignupPage from './pages/SignupPage';
import LTESignupPage from './pages/LTESignupPage';
import PackageSelectionPage from './pages/PackageSelectionPage';
import PromoDealsPage from './pages/PromoDealsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fibre" element={<FibrePage />} />
            <Route path="/lte-5g" element={<LTEPage />} />
            <Route path="/lte" element={<LTEPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/lte-signup" element={<LTESignupPage />} />
            <Route path="/package-selection" element={<PackageSelectionPage />} />
            <Route path="/promo-deals" element={<PromoDealsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 