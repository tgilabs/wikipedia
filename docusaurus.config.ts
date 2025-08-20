import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'וויקיפדיה',
  tagline: 'הויקיפדיה הרשמית של TeGriAi | המקום הכי ישראלי ברשת | שרת הדיסקורד וקהילת הגיימינג של ישראל',
  favicon: 'img/logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://wiki.tegriai.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tgilabs', // Usually your GitHub org/user name.
  projectName: 'wikipedia', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Hebrew RTL configuration
  i18n: {
    defaultLocale: 'he',
    locales: ['he'],
    localeConfigs: {
      he: {
        label: 'עברית',
        direction: 'rtl',
        htmlLang: 'he-IL',
        calendar: 'gregory',
        path: 'he',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    // Force dark theme always for space theme
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'וויקיפדיה',
      logo: {
        alt: 'לוגו וויקיפדיה',
        src: 'img/logo.png',
      },
      hideOnScroll: false,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'community',
          position: 'left',
          html: '<i class="fas fa-users"></i> קהילה',
        },
        {
          to: 'intro',
          position: 'left',
          html: '<i class="fas fa-gamepad"></i> שרתי משחק',
        },
        {
          to: '/docs/workway/intro',
          position: 'left',
          html: '<i class="fas fa-briefcase"></i> פרוייקטים',
        },
        {
          type: 'docSidebar',
          sidebarId: 'legal',
          position: 'left',
          html: '<i class="fas fa-gavel"></i> חוק ותקן',
        },
        {
          href: 'https://discord.gg/tgi',
          position: 'right',
          html: '<i class="fab fa-discord"></i> בואו לדיסקורד',
          className: 'discord-button',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
      ],
      copyright: ` ${new Date().getFullYear()} TeGriAI © כל הזכויות שמורות . 
      <br> מופעל על ידי <a href="https://www.tegriai.com/lab">מעבדות טגי</a> 
      <br> הפרוייקט הזה הוא פרוייקט בקוד פתוח ברשיון <a href="https://github.com/tgilabs/public-docs?tab=CC-BY-4.0-1-ov-file">CC-BY-4.0 license</a>`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
