import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '🌌 ידע קוסמי',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        נווט דרך המרחב העצום של המידע כמו חקירה של גלקסיות רחוקות.
        כל פיסת ידע היא כוכב המחכה להתגלות.
      </>
    ),
  },
  {
    title: '🚀 התמקדות בגילוי',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        שגר למסע התיעוד שלך בזמן שאנחנו מטפלים בקוסמוס הטכני.
        התמקד ביצירת תוכן מעולה בתיקיית <code>docs</code>.
      </>
    ),
  },
  {
    title: '⭐ מופעל על ידי React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        הרחב את תחנת החלל שלך עם רכיבי React. בנה חוויה מאוחדת
        בכל הגלקסיה של התיעוד שלך.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3" className="font-karantina text-gradient">{title}</Heading>
        <p className="font-assistant">{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
