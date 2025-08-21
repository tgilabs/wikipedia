import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

// Navigation cards based on docusaurus.config.ts navbar items
const NavigationCards = [
  {
    title: 'קהילה',
    icon: 'fas fa-users',
    description: 'הצטרפו לקהילת הגיימינג הגדולה והכי ישראלית ברשת',
    link: '/section/community/welcome',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    title: 'שרתי משחק',
    icon: 'fas fa-gamepad',
    description: 'גלו את שרתי המשחקים שלנו ברובלוקס ועוד',
    link: '/section/gaming/roblox',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    title: 'פרוייקטים',
    icon: 'fas fa-briefcase',
    description: 'למדו על הפרוייקטים הטכנולוגיים של TeGriAi',
    link: '/section/platforms/workway/intro',
    gradient: 'from-pink-500 to-orange-600'
  },
  {
    title: 'חוק ותקן',
    icon: 'fas fa-gavel',
    description: 'כללי הקהילה, מדיניות פרטיות וכל המידע החוקי',
    link: '/section/legal/landing',
    gradient: 'from-orange-500 to-yellow-600'
  }
];

function HomepageHeader() {
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.starsBackground}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={clsx('hero__title font-karantina', styles.heroTitle)}>
            TeGriAi Wiki
          </Heading>
          <p className={clsx('hero__subtitle font-assistant', styles.heroSubtitle)}>
            המקום הכי ישראלי ברשת
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--primary button--lg', styles.discordButton)}
              href="https://discord.gg/tgi">
              <i className="fab fa-discord"></i>
              בואו לדיסקורד
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavigationSection() {
  return (
    <section className={styles.navigationSection}>
      <div className="container">
        <Heading as="h2" className={clsx('text--center margin-bottom--lg font-karantina', styles.sectionTitle)}>
          גלו את הקהילה שלנו
        </Heading>
        <div className={styles.cardsGrid}>
          {NavigationCards.map((card, idx) => (
            <Link key={idx} to={card.link} className={styles.navigationCard}>
              <div className={styles.cardIcon}>
                <i className={card.icon}></i>
              </div>
              <Heading as="h3" className={clsx('font-karantina', styles.cardTitle)}>
                {card.title}
              </Heading>
              <p className={clsx('font-assistant', styles.cardDescription)}>
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GamingQuoteSection() {
  return (
    <section className={styles.quoteSection}>
      <div className="container">
        <div className={styles.quoteContainer}>
          <Heading as="h2" className={clsx('font-karantina', styles.quoteTitle)}>
            "גיימינג זה לא רק משחק - זה קהילה, זה חברות, זה בית"
          </Heading>
          <p className={clsx('font-assistant', styles.quoteAuthor)}>
            - קהילת TeGriAi
          </p>
          <div className={styles.quoteIcons}>
            <i className="fas fa-gamepad"></i>
            <i className="fas fa-heart"></i>
            <i className="fas fa-users"></i>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="ברוכים הבאים לוויקיפדיה של TeGriAi"
      description="הקהילה הגדולה והכי ישראלית ברשת - שרת דיסקורד, גיימינג ופרוייקטים טכנולוגיים">
      <HomepageHeader />
      <main>
        <NavigationSection />
        <GamingQuoteSection />
      </main>
    </Layout>
  );
}
