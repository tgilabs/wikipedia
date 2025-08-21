import React from 'react';
import styles from './styles.module.css';

interface DiscordCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  inviteUrl?: string;
  variant?: 'default' | 'compact' | 'banner';
  image?: string;
}

const DiscordCTA: React.FC<DiscordCTAProps> = ({
  title = "בואו למקום הכי ישראלי ברשת",
  description = "בואו לקהילת הדיסקורד הגדולה ביותר במדינת ישראל",
  buttonText = "בואו לדיסקורד",
  inviteUrl = "https://discord.gg/tgi",
  variant = 'default',
  image = "/img/discord-background.png"
}) => {
  const handleJoinClick = () => {
    window.open(inviteUrl, '_blank', 'noopener,noreferrer');
  };

  const containerStyle = {
    backgroundImage: `linear-gradient(135deg, 
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.6) 100%
    ), url('${image}')`
  };

  return (
    <div 
      className={`${styles.discordCTA} ${styles[variant]}`} 
      dir="rtl"
      style={containerStyle}
    >
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
