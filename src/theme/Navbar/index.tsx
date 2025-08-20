import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faGamepad, 
  faProjectDiagram, 
  faGavel 
} from '@fortawesome/free-solid-svg-icons';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import './navbar.css';

// Proper default export
function CustomNavbar() {
  const {siteConfig} = useDocusaurusContext();
  const {navbar} = useThemeConfig();

  return (
    <nav className="custom-navbar">
      <div className="custom-navbar__container">
        {/* Logo */}
        <div className="custom-navbar__brand">
          <Link to="/" className="custom-navbar__logo">
            {navbar.logo?.src && (
              <img 
                src={navbar.logo.src} 
                alt={navbar.logo.alt || 'Logo'} 
                className="custom-navbar__logo-img"
              />
            )}
            <span className="custom-navbar__title">{siteConfig.title}</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="custom-navbar__items">
          <Link to="/docs/comunity/about" className="custom-navbar__item">
            <FontAwesomeIcon icon={faUsers} className="custom-navbar__icon" />
            קהילה
          </Link>
          
          <Link to="/docs/gaming/roblox" className="custom-navbar__item">
            <FontAwesomeIcon icon={faGamepad} className="custom-navbar__icon" />
            שרתי משחק
          </Link>
          
          <Link to="/docs/workway/intro" className="custom-navbar__item">
            <FontAwesomeIcon icon={faProjectDiagram} className="custom-navbar__icon" />
            פרוייקטים
          </Link>
          
          <Link to="/docs/legal/discord/rules" className="custom-navbar__item">
            <FontAwesomeIcon icon={faGavel} className="custom-navbar__icon" />
            חוק ותקן
          </Link>
        </div>

        {/* Discord Button */}
        <div className="custom-navbar__actions">
          <a 
            href="https://discord.gg/tgi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="custom-navbar__discord-btn"
          >
            <FontAwesomeIcon icon={faDiscord} className="custom-navbar__discord-icon" />
            הצטרף לדיסקורד
          </a>
        </div>
      </div>
    </nav>
  );
}

// Proper default export
export default CustomNavbar;
