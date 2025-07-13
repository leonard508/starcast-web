import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Starcast Technologies
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>Home</Link>
            <Link to="/fibre" style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>Fibre</Link>
            <Link to="/lte-5g" style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>LTE</Link>
            <Link to="/booking" style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>Booking</Link>
            <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--text-dark)' }}>Admin</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 