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

  plugins: [
    async function tailwindPlugin(context, options) {
      return {
        name: "docusaurus-tailwindcss",
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          postcssOptions.plugins.push(require("@tailwindcss/postcss"));
          postcssOptions.plugins.push(require("autoprefixer"));
          return postcssOptions;
        },
      };
    },
  ],

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
          href: 'https://discord.gg/tgi',
          position: 'left',
          html: '<i class="fab fa-discord"></i> הצטרף לדיסקורד',
          className: 'discord-button',
        },
        {
          to: '/docs/comunity/about',
          position: 'right',
          html: '<i class="fas fa-users"></i> קהילה',
          className: 'navbar-center-item',
        },
        {
          to: '/docs/gaming/roblox',
          position: 'right',
          html: '<i class="fas fa-gamepad"></i> שרתי משחק',
          className: 'navbar-center-item',
        },
        {
          to: '/docs/workway/intro',
          position: 'right',
          html: '<i class="fas fa-briefcase"></i> פרוייקטים',
          className: 'navbar-center-item',
        },
        {
          to: '/docs/legal/discord/rules',
          position: 'right',
          html: '<i class="fas fa-gavel"></i> חוק ותקן',
          className: 'navbar-center-item',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'ניווט',
          items: [
            {
              label: 'חקור מסמכים',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'קהילה',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'עוד',
          items: [
            {
              label: 'יומן קוסמי',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `זכויות יוצרים © ${new Date().getFullYear()} ויקי-ספייס. חוקרים את הקוסמוס של הידע.`,
    },
    prism: {
      theme: prismThemes.dracula,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
