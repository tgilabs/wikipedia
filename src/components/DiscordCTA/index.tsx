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
  title = "בואו למקום הכי ישראלי ברשת",
  description = "בואו לקהילת הדיסקורד הגדולה ביותר במדינת ישראל",
  buttonText = "בואו לדיסקורד",
  inviteUrl = "https://discord.gg/tgi",
  variant = 'default'
}) => {
  const handleJoinClick = () => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`${styles.discordCTA} ${styles[variant]}`} dir="rtl">
      <div className={styles.content}>
        <button 
          className={styles.joinButton}
          onClick={handleJoinClick}
          aria-label={buttonText}
        >
          {buttonText}
        </button>
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
        </div>
        <div className={styles.iconContainer}>
          <i className={`fab fa-discord ${styles.discordIcon}`} aria-hidden="true"></i>
        </div>
      </div>
      <div className={styles.backgroundDecoration}></div>
    </div>
  );
};

export default DiscordCTA;
