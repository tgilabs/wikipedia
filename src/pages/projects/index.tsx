import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

// Projects data
const ProjectsData = [
  {
    title: 'WorkWay',
    description: 'פלטפורמת ניהול פרוייקטים מתקדמת לעסקים',
    logo: '/img/workway-logo.png', // You'll need to add this logo
    websiteUrl: 'https://workway.tegriai.com',
    docsUrl: '/section/platforms/workway/intro',
    category: 'platform'
  },
  {
    title: 'איגוד הגיימינג הישראלי',
    description: 'האיגוד המרכז את כל הגיימרים הישראלים תחת קורת גג אחת',
    logo: '/img/gaming-union-logo.png', // You'll need to add this logo
    websiteUrl: 'https://gaming.org.il',
    docsUrl: '/section/community/about',
    category: 'community'
  },
  {
    title: 'אתר ההסברה המרכזי',
    description: 'המרכז הראשי לכל מידע הסברתי על ישראל',
    logo: '/img/hasbara-main-logo.png', // You'll need to add this logo
    websiteUrl: 'https://hasbara.tegriai.com',
    docsUrl: '/section/community/teams/hasbra',
    category: 'hasbara'
  },
  {
    title: 'אתר ההסברה למלחמת חרבות ברזל',
    description: 'מידע ועדכונים על מלחמת חרבות ברזל',
    logo: '/img/hasbara-war-logo.png', // You'll need to add this logo
    websiteUrl: 'https://war.hasbara.tegriai.com',
    docsUrl: '/section/community/teams/hasbra',
    category: 'hasbara'
  },
  {
    title: 'אתר ההסברה למזרח התיכון',
    description: 'הסברה ומידע על המזרח התיכון והסכסוך',
    logo: '/img/hasbara-me-logo.png', // You'll need to add this logo
    websiteUrl: 'https://middleeast.hasbara.tegriai.com',
    docsUrl: '/section/community/teams/hasbra',
    category: 'hasbara'
  },
  {
    title: 'PlayOff Platform',
    description: 'פלטפורמה לטורנירים ותחרויות גיימינג',
    logo: '/img/playoff-logo.png', // You'll need to add this logo
    websiteUrl: 'https://playoff.tegriai.com',
    docsUrl: '/section/gaming/tournaments',
    category: 'gaming'
  }
];

function ProjectsSection() {
  return (
    <section className={styles.projectsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <Heading as="h1" className={clsx('text--center margin-bottom--md font-karantina', styles.pageTitle)}>
            הפרוייקטים שלנו
          </Heading>
          <p className={clsx('text--center margin-bottom--xl font-assistant', styles.pageSubtitle)}>
            גלו את הפרוייקטים הטכנולוגיים והקהילתיים של TeGriAi המשנים את פני הגיימינג הישראלי
          </p>
        </div>
        
        <div className={styles.projectsGrid}>
          {ProjectsData.map((project, idx) => (
            <div key={idx} className={clsx(styles.projectCard, styles[project.category])}>
              <div className={styles.cardContent}>
                <div className={styles.projectLogo}>
                  <img 
                    src={project.logo} 
                    alt={`${project.title} לוגו`}
                    className={styles.logoImage}
                    onError={(e) => {
                      // Fallback to icon if image doesn't load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = '<i class="fas fa-cube"></i>';
                    }}
                  />
                </div>
                
                <Heading as="h3" className={clsx('font-karantina', styles.cardTitle)}>
                  {project.title}
                </Heading>
                
                <p className={clsx('font-assistant', styles.cardDescription)}>
                  {project.description}
                </p>
                
                <div className={styles.cardButtons}>
                  <Link
                    href={project.websiteUrl}
                    className={clsx('button button--primary', styles.websiteButton)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    בקר באתר
                  </Link>
                  <Link
                    to={project.docsUrl}
                    className={clsx('button', styles.docsButton)}
                  >
                    <i className="fas fa-book"></i>
                    תיעוד
                  </Link>
                </div>
              </div>
              
              <div className={styles.cardGlow}></div>
            </div>
          ))}
        </div>
        
        <div className={styles.joinPromotion}>
          <div className={styles.promotionContent}>
            <Heading as="h2" className={clsx('font-karantina', styles.promotionTitle)}>
              רוצים להיות חלק מהפרוייקטים?
            </Heading>
            <p className={clsx('font-assistant', styles.promotionText)}>
              הצטרפו לקהילת המפתחים שלנו ותרמו לפרוייקטים שמשנים את עולם הגיימינג הישראלי
            </p>
            <div className={styles.promotionButtons}>
              <Link
                className={clsx('button button--primary button--lg', styles.discordButton)}
                href="https://discord.gg/tgi"
              >
                <i className="fab fa-discord"></i>
                הצטרפו לדיסקורד
              </Link>
              <Link
                className={clsx('button button--secondary button--lg', styles.githubButton)}
                href="https://github.com/tgilabs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Projects(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="הפרוייקטים שלנו - TeGriAi"
      description="גלו את הפרוייקטים הטכנולוגיים והקהילתיים של TeGriAi - WorkWay, איגוד הגיימינג הישראלי, אתרי הסברה ועוד">
      <main>
        <ProjectsSection />
      </main>
    </Layout>
  );
}
