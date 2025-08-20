import React, { useState } from 'react';
import './navbar.css';

interface NavItem {
  label: string;
  icon: string;
  link: string;
}

const navItems: NavItem[] = [
  {
    label: 'קהילה',
    icon: 'fas fa-users',
    link: '/docs/comunity'
  },
  {
    label: 'שרתי משחק',
    icon: 'fas fa-gamepad',
    link: '/docs/gaming'
  },
  {
    label: 'פרוייקטים',
    icon: 'fas fa-project-diagram',
    link: '/docs/workway'
  },
  {
    label: 'חוק ותקן',
    icon: 'fas fa-gavel',
    link: '/docs/legal'
  }
];

export default function CustomNavbar(): React.JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo">
            <a href="/">
              <img src="/img/logo.png" alt="לוגו וויקיפדיה" className="logo-image" />
              <span className="logo-text">וויקיפדיה</span>
            </a>
          </div>

          {/* Desktop Navigation Items */}
          <div className="navbar-nav">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.link} 
                className="nav-item"
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Actions Section */}
          <div className="navbar-actions">
            {/* Discord Button */}
            <a 
              href="https://discord.gg/tgi" 
              className="discord-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-discord"></i>
              <span>הצטרף לדיסקורד</span>
            </a>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="פתח תפריט"
            >
              <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav">
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={item.link} 
              className="nav-item"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
