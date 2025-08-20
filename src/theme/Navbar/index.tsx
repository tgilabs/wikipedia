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

// Proper default export
function CustomNavbar() {
  const {siteConfig} = useDocusaurusContext();
  const {navbar} = useThemeConfig();

  return (
    <nav className="navbar navbar--dark navbar--fixed-top" dir="rtl">
      <div className="container navbar__inner">
        {/* Logo */}
        <div className="navbar__brand">
          <Link to="/" className="navbar__item navbar__link">
            {navbar.logo?.src && (
              <img 
                src={navbar.logo.src} 
                alt={navbar.logo.alt || 'Logo'} 
                className="navbar__logo"
                style={{ marginRight: '0.5rem', marginLeft: 0 }}
              />
            )}
            <span className="navbar__title text--truncate">{siteConfig.title}</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="navbar__items navbar__items--right" style={{ flexDirection: 'row-reverse' }}>
          <Link to="/docs/comunity/about" className="navbar__item navbar__link">
            <FontAwesomeIcon icon={faUsers} style={{ marginLeft: '0.5rem' }} />
            קהילה
          </Link>
          
          <Link to="/docs/gaming/roblox" className="navbar__item navbar__link">
            <FontAwesomeIcon icon={faGamepad} style={{ marginLeft: '0.5rem' }} />
            שרתי משחק
          </Link>
          
          <Link to="/docs/workway/intro" className="navbar__item navbar__link">
            <FontAwesomeIcon icon={faProjectDiagram} style={{ marginLeft: '0.5rem' }} />
            פרוייקטים
          </Link>
          
          <Link to="/docs/legal/discord/rules" className="navbar__item navbar__link">
            <FontAwesomeIcon icon={faGavel} style={{ marginLeft: '0.5rem' }} />
            חוק ותקן
          </Link>

          {/* Discord Button */}
          <a 
            href="https://discord.gg/tgi" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="navbar__item navbar__link discord-button"
            style={{ marginLeft: '1rem' }}
          >
            <FontAwesomeIcon icon={faDiscord} style={{ marginLeft: '0.5rem' }} />
            הצטרף לדיסקורד
          </a>
        </div>
      </div>
    </nav>
  );
}

// Proper default export
export default CustomNavbar;
