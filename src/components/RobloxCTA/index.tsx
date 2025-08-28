import React from 'react';
import styles from './styles.module.css';

interface RobloxCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: 'default' | 'compact' | 'banner' | 'animated';
  image?: string;
  animation?: 'pulse' | 'glow' | 'bounce' | 'none';
}

const RobloxCTA: React.FC<RobloxCTAProps> = ({
  title = "הצטרפו אלינו ברובלוקס",
  description = "חוויה ייחודית במשחק הכי פופולרי בעולם",
  buttonText = "שחקו עכשיו",
  variant = 'default',
  image = "/img/roblox-discord-background.jpg",
  animation = 'pulse'
}) => {
  const handleJoinClick = () => {
    // Always redirect to custom domain
    window.location.href = "https://roblox.tegriai.com";
  };

  const containerStyle = {
    backgroundImage: `linear-gradient(135deg, 
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.6) 100%
    ), url('${image}')`
  };

  const containerClasses = [
    styles.robloxCTA,
    styles[variant],
    animation !== 'none' ? styles[`animation-${animation}`] : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={containerClasses}
      dir="rtl"
      style={containerStyle}
    >
      <div className={styles.content}>
        <div className={styles.buttonGroup}>
          <button 
            className={`${styles.joinButton} ${styles.primary}`}
            onClick={handleJoinClick}
            aria-label={buttonText}
          >
            {buttonText}
          </button>
        </div>
        
        <div className={styles.textContent}>
          <h3 className={`${styles.title} title-white`}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        
        <div className={styles.iconContainer}>
          <div className={styles.robloxIcon}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="60" height="60" rx="8" ry="8" 
                    fill="currentColor" transform="rotate(25 50 50)"/>
            </svg>
          </div>
        </div>
      </div>
      <div className={styles.backgroundDecoration}></div>
    </div>
  );
};

export default RobloxCTA;
