import React from 'react';
import styles from './styles.module.css';

interface DiscordCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  inviteUrl?: string;
  variant?: 'default' | 'compact' | 'banner';
}

const DiscordCTA: React.FC<DiscordCTAProps> = ({
  title = "הצטרף לקהילת הדיסקורד שלנו",
  description = "חבר אלינו בדיסקורד לדיונים, עדכונים ותמיכה מהקהילה",
  buttonText = "הצטרף לדיסקורד",
  inviteUrl = "https://discord.gg/tgi",
  variant = 'default'
}) => {
  const handleJoinClick = () => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`${styles.discordCTA} ${styles[variant]}`}>
      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <svg 
            className={styles.discordIcon} 
            viewBox="0 0 127.14 96.36" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
          </svg>
        </div>
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <button 
          className={styles.joinButton}
          onClick={handleJoinClick}
          aria-label={buttonText}
        >
          {buttonText}
          <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.backgroundDecoration}></div>
    </div>
  );
};

export default DiscordCTA;
