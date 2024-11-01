import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'הויקיפדיה של TeGriAi',
  tagline: 'ברוכים הבאים לעולם שלנו! הקהילה הישראלית הכי גדולה ברשת',
  favicon: 'img/logo.png',

  // Set the production url of your site here
  url: 'https://wiki.tegriai.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tgilabs', // Usually your GitHub org/user name.
  projectName: 'public-docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'he',
    locales: ['he'],
  },

  scripts: [
    {
      src: "https://forms.tegriai.com/api/packages/website",
      async: true,
      onload: `setTimeout(function() {
        window.formbricks.init({
          environmentId: "cm1d4un8q00eztu3ng6nkqe8r",
          apiHost: "https://forms.tegriai.com"
        });
      }, 500);`
    }
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/tgilabs/public-docs/tree/Production/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],


  plugins: [
    require.resolve('./plugins/hostages-ticker/index.js'),
    require.resolve('./plugins/accessibility/index.js'),
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/background.jpeg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'הויקיפדיה של TeGriAi',
      logo: {
        alt: 'TeGriAi Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'community',
          html: '<i class="fas fa-users"></i> קהילה',
          position: 'left',
        },
        {
          type: 'dropdown',
          html: '<i class="fas fa-gamepad"></i> שרתי משחק',
          position: 'left',
          items: [
            {
              href: '/servers/rules',
              html: '<i class="fas fa-balance-scale"></i> חוקי הקהילה',
            },
            {
              type: 'docSidebar',
              sidebarId: 'fivem',
              html: '<i class="fas fa-car"></i> פייבאם',
            },
          ],
        },
        {
          type: 'dropdown',
          html: '<i class="fas fa-book-open"></i> מדריכים', 
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'wiki',
              html: '<i class="fas fa-university"></i> הויקיפדיה שלנו', 
            },
            {
              type: 'docSidebar',
              sidebarId: 'workway',
              html: '<i class="fas fa-tasks"></i> המקום לכל משימה',
            },
            {
              type: 'docSidebar',
              sidebarId: 'tg1',
              html: '<i class="fas fa-gamepad"></i> פלטפורמת הטורנירים', 
            },
          ],
        },
        {
          type: 'docSidebar',
          sidebarId: 'lab',
          html: '<i class="fas fa-flask"></i> המעבדה',
          position: 'left',
        },
        {
          type: 'dropdown',
          html: '<i class="fas fa-gavel"></i> מדיניות',
          position: 'left',
          items: [
            {
              type: 'docSidebar',
              sidebarId: 'legaltegriai',
              html: '<i class="fas fa-globe"></i> חברה',
            },
            {
              type: 'docSidebar',
              sidebarId: 'legalworkway',
              html: '<i class="fas fa-tasks"></i> WorkWay',
            },
            {
              type: 'docSidebar',
              sidebarId: 'legalbranding',
              html: '<i class="fas fa-palette"></i> מותגים',
            },
            {
              type: 'docSidebar',
              sidebarId: 'legaldiscord',
              html: '<i class="fab fa-discord"></i> דיסקורד',
            },
            {
              type: 'docSidebar',
              sidebarId: 'legalfivem',
              html: '<i class="fas fa-car"></i> פייבאם',
            },
            ],
        },
        {
          type: 'dropdown',
          html: '<i class="fas fa-plus"></i> משאבים נוספים',
          position: 'right',
          items: [
            {
              href: 'https://www.tegriai.com',
              html: '<i class="fas fa-home"></i> אתר טגי',
            },
            {
              href: 'https://workway.co.il',
              html: '<i class="fas fa-briefcase"></i> WorkWay',
            },
            {
              href: 'https://cloud.ims-network.net/he',
              html: '<i class="fas fa-cloud"></i> הענן שלנו',
            },

          ],
        },
        {
          href: 'https://discord.gg/tgi',
          html: '<i class="fa-brands fa-discord"></i>',
          position: 'right',
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
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },

  } satisfies Preset.ThemeConfig,
};

export default config;