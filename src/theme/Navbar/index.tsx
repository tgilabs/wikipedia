import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import './navbar.css';

export default function Navbar(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {navbar} = useThemeConfig();

  return (
    <nav className="custom-navbar">
      <div className="custom-navbar__container">
        {/* Logo */}
        <div className="custom-navbar__brand">
          <Link to="/" className="custom-navbar__logo">
            <img 
              src={navbar.logo?.src} 
              alt={navbar.logo?.alt || 'Logo'} 
              className="custom-navbar__logo-img"
            />
            <span className="custom-navbar__title">{siteConfig.title}</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="custom-navbar__items">
          <Link to="/docs/comunity/about" className="custom-navbar__item">
            <svg className="custom-navbar__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.996 1.996 0 0 0 18 7.5c-.8 0-1.53.5-1.83 1.26L14.5 14.5H10l-2.67-6.05A1.996 1.996 0 0 0 5.46 7.5c-.8 0-1.53.5-1.83 1.26L1.5 16H4v6h2v-6h6v6h2v-6h6v6h2z"/>
            </svg>
            קהילה
          </Link>
          
          <Link to="/docs/gaming/roblox" className="custom-navbar__item">
            <svg className="custom-navbar__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,7.5V2H9V7.5L12,10.5L15,7.5M7.5,9H2V15H7.5L10.5,12L7.5,9M22,9H16.5L13.5,12L16.5,15H22V9M9,16.5V22H15V16.5L12,13.5L9,16.5Z"/>
            </svg>
            שרתי משחק
          </Link>
          
          <Link to="/docs/workway/intro" className="custom-navbar__item">
            <svg className="custom-navbar__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,13H13V17H11V13H7V11H11V7H13V11H17V13Z"/>
            </svg>
            פרוייקטים
          </Link>
          
          <Link to="/docs/legal/discord/rules" className="custom-navbar__item">
            <svg className="custom-navbar__icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/>
            </svg>
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
            <svg className="custom-navbar__discord-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z"/>
            </svg>
            הצטרף לדיסקורד
          </a>
        </div>
      </div>
    </nav>
  );
}
