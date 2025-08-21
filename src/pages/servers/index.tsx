import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

// Gaming servers cards
const GameServers = [
  {
    title: 'Roblox',
    icon: 'fas fa-cube',
    tagline: 'השרת הכי פופולרי שלנו',
    description: 'הצטרפו לשרתי הרובלוקס שלנו ותיהנו מחוויית משחק ייחודית',
    link: '/section/gaming/roblox/welcome',
    guidesLink: '/section/gaming/roblox/welcome',
    available: true,
    color: 'roblox'
  },
  {
    title: 'Minecraft',
    icon: 'fas fa-cubes',
    tagline: 'עולם אינסופי של יצירתיות',
    description: 'שרת מיינקראפט עם מודים ייחודיים ופעילות קהילתית',
    link: '#',
    available: false,
    color: 'minecraft'
  },
  {
    title: 'FiveM',
    icon: 'fas fa-car',
    tagline: 'חיי רחוב וירטואליים',
    description: 'שרת FiveM עם roleplay מתקדם וחוויה ישראלית אותנטית',
    link: '#',
    available: false,
    color: 'fivem'
  },
  {
    title: 'Rust',
    icon: 'fas fa-hammer',
    tagline: 'הישרדות קשה בעולם פתוח',
    description: 'שרת ראסט עם PvP מתקדם ובסיסים מותאמים אישית',
    link: '#',
    available: false,
    color: 'rust'
  }
];

function ServersSection() {
  return (
    <section className={styles.serversSection}>
      <div className={styles.starsBackground}></div>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h1" className={clsx('text--center margin-bottom--md font-karantina', styles.pageTitle)}>
            שרתי משחק
          </Heading>
          <p className={clsx('text--center margin-bottom--xl font-assistant', styles.pageSubtitle)}>
            גלו את שרתי המשחקים שלנו ותיהנו מחוויית גיימינג ישראלית ייחודית
          </p>
        </div>
        
        <div className={styles.serversGrid}>
          {GameServers.map((server, idx) => (
            <div key={idx} className={clsx(styles.serverCard, styles[server.color])}>
              <div className={styles.cardContent}>
                <div className={styles.cardIcon}>
                  <i className={server.icon}></i>
                </div>
                
                <Heading as="h3" className={clsx('font-karantina', styles.cardTitle)}>
                  {server.title}
                </Heading>
                
                <p className={clsx('font-assistant', styles.cardTagline)}>
                  {server.tagline}
                </p>
                
                <p className={clsx('font-assistant', styles.cardDescription)}>
                  {server.description}
                </p>
                
                <div className={styles.cardButton}>
                  {server.available ? (
                    server.title === 'Roblox' ? (
                      <div className={styles.robloxButtons}>
                        <Link
                          to={server.link}
                          className={clsx('button button--primary', styles.playButton)}
                        >
                          <i className="fas fa-play"></i>
                          שחק עכשיו
                        </Link>
                        <Link
                          to={server.guidesLink}
                          className={clsx('button button--secondary', styles.guidesButton)}
                        >
                          <i className="fas fa-book"></i>
                          מדריכים
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to={server.link}
                        className={clsx('button button--primary', styles.playButton)}
                      >
                        <i className="fas fa-play"></i>
                        שחק עכשיו
                      </Link>
                    )
                  ) : (
                    <div className={clsx('button button--secondary', styles.comingSoonButton)}>
                      <i className="fas fa-clock"></i>
                      בקרוב
                    </div>
                  )}
                </div>
                
                {!server.available && (
                  <div className={styles.comingSoonBadge}>
                    <span>בקרוב</span>
                  </div>
                )}
              </div>
              
              <div className={styles.cardGlow}></div>
            </div>
          ))}
        </div>
        
        <div className={styles.discordPromotion}>
          <div className={styles.promotionContent}>
            <Heading as="h2" className={clsx('font-karantina', styles.promotionTitle)}>
              רוצים להישאר מעודכנים?
            </Heading>
            <p className={clsx('font-assistant', styles.promotionText)}>
              הצטרפו לדיסקורד שלנו כדי לקבל עדכונים על שרתים חדשים ואירועים מיוחדים
            </p>
            <Link
              className={clsx('button button--primary button--lg', styles.discordButton)}
              href="https://discord.gg/tgi"
            >
              <i className="fab fa-discord"></i>
              הצטרפו לדיסקורד
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Servers(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="שרתי משחק - TeGriAi"
      description="גלו את שרתי המשחקים של TeGriAi - הקהילה הגדולה והכי ישראלית ברשת. רובלוקס, מיינקראפט, FiveM ועוד">
      <main>
        <ServersSection />
      </main>
    </Layout>
  );
}
