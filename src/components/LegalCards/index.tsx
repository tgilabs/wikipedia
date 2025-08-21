import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faGamepad, 
  faGlobe, 
  faFlask, 
  faBriefcase 
} from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.css';

type LegalCardItem = {
  title: string;
  description: string;
  icon: any;
  link: string;
  isAvailable: boolean;
};

const LegalSections: LegalCardItem[] = [
  {
    title: 'דיסקורד',
    description: 'תקנון והנחיות לשימוש בשרת הדיסקורד של קהילת TeGriAi',
    icon: faComments,
    link: '/legal/discord/safety',
    isAvailable: true,
  },
  {
    title: 'Roblox',
    description: 'כללי התנהגות ובטיחות בפלטפורמת Roblox',
    icon: faGamepad,
    link: '/legal/roblox/rules',
    isAvailable: true,
  },
  {
    title: 'אתר',
    description: 'מדיניות פרטיות ותנאי שימוש באתר',
    icon: faGlobe,
    link: '/legal/website/privacy-policy',
    isAvailable: true,
  },
  {
    title: 'Perfume',
    description: 'מדיניות ותקנון הקשורים לפלטפורמת Perfume',
    icon: faFlask,
    link: '#',
    isAvailable: false,
  },
  {
    title: 'Workway',
    description: 'הנחיות ותקנון עבור פלטפורמת Workway',
    icon: faBriefcase,
    link: '#',
    isAvailable: false,
  },
];

function LegalCard({title, description, icon, link, isAvailable}: LegalCardItem) {
  const CardContent = () => (
    <div className={clsx('card', styles.legalCard, !isAvailable && styles.unavailable)}>
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          <FontAwesomeIcon icon={icon} className={styles.icon} />
        </div>
        <Heading as="h3" className={clsx('font-karantina', styles.cardTitle)}>
          {title}
        </Heading>
      </div>
      <div className={styles.cardBody}>
        <p className={clsx('font-assistant', styles.cardDescription)}>
          {description}
        </p>
      </div>
      <div className={styles.cardFooter}>
        {isAvailable ? (
          <span className={styles.availableBadge}>זמין</span>
        ) : (
          <span className={styles.unavailableBadge}>בפיתוח</span>
        )}
      </div>
    </div>
  );

  if (!isAvailable) {
    return (
      <div className={clsx('col', styles.cardColumn)}>
        <CardContent />
      </div>
    );
  }

  return (
    <div className={clsx('col', styles.cardColumn)}>
      <Link to={link} className={styles.cardLink}>
        <CardContent />
      </Link>
    </div>
  );
}

export default function LegalCards(): ReactNode {
  return (
    <section className={styles.legalCardsSection}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="font-karantina text-gradient">
            מדיניות הקהילה
          </Heading>
          <p className="font-assistant">
            כל המדיניות והתקנונים של קהילת TeGriAi במקום אחד
          </p>
        </div>
        <div className="row">
          {LegalSections.map((props, idx) => (
            <LegalCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
