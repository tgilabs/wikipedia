import React, { useMemo } from 'react';
import styles from './styles.module.css';

interface RobloxCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  placeId?: string;
  linkCode?: string;
  launchData?: string;
  variant?: 'default' | 'compact' | 'banner' | 'animated';
  image?: string;
  animation?: 'pulse' | 'glow' | 'bounce' | 'none';
}

const RobloxCTA: React.FC<RobloxCTAProps> = ({
  title = "הצטרפו אלינו ברובלוקס",
  description = "חוויה ייחודית במשחק הכי פופולרי בעולם",
  buttonText = "שחקו עכשיו",
  placeId = "84552319997646", // TeGriAi default
  linkCode = "",
  launchData = '{"entry":"website","campaign":"landing"}',
  variant = 'default',
  image = "/img/roblox-discord-background.jpg",
  animation = 'pulse'
}) => {
  const deepLink = useMemo(() => {
    const encodedLaunchData = encodeURIComponent(launchData);
    const base = `roblox://experiences/start?placeId=${placeId}`;
    const code = linkCode ? `&linkCode=${encodeURIComponent(linkCode)}` : "";
    return `${base}${code}&launchData=${encodedLaunchData}`;
  }, [placeId, linkCode, launchData]);

  const webLink = useMemo(() => {
    const encodedLaunchData = encodeURIComponent(launchData);
    const base = `https://www.roblox.com/games/start?placeId=${placeId}`;
    const code = linkCode ? `&linkCode=${encodeURIComponent(linkCode)}` : "";
    return `${base}${code}&launchData=${encodedLaunchData}`;
  }, [placeId, linkCode, launchData]);

  const handleJoinClick = () => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);

    const IOS_STORE = "https://apps.apple.com/app/roblox/id431946152";
    const AND_STORE = "https://play.google.com/store/apps/details?id=com.roblox.client";
    const ROBLOX_DOWNLOAD = "https://www.roblox.com/download";

    let didNavigate = false;
    const t0 = Date.now();

    // Try native deep link first
    window.location.href = deepLink;

    // Fallback to web launcher
    setTimeout(() => {
      if (Date.now() - t0 < 1800 && !didNavigate) {
        didNavigate = true;
        window.location.href = webLink;
      }
    }, 1200);

    // Final fallback to store/download
    setTimeout(() => {
      if (Date.now() - t0 < 3200 && !didNavigate) {
        didNavigate = true;
        if (isIOS) window.location.href = IOS_STORE;
        else if (isAndroid) window.location.href = AND_STORE;
        else window.location.href = ROBLOX_DOWNLOAD;
      }
    }, 2600);
  };

  const handleWebRedirect = () => {
    window.open(webLink, '_blank', 'noopener,noreferrer');
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
          {variant === 'default' && (
            <button 
              className={`${styles.joinButton} ${styles.secondary}`}
              onClick={handleWebRedirect}
              aria-label="פתח דרך הדפדפן"
            >
              פתח דרך הדפדפן
            </button>
          )}
        </div>
        
        <div className={styles.textContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          {variant === 'default' && (
            <p className={styles.directLink}>
              קישור ישיר:&nbsp;
              <code className={styles.linkCode}>
                https://www.roblox.com/games/start?placeId={placeId}
              </code>
            </p>
          )}
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
