const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const path = require('path');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'CellularJS',
  tagline: 'A hybrid microservices framework to grow from zero to big.',
  url: 'https://cellularjs.com',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'cellularjs', // Usually your GitHub org/user name.
  projectName: 'cellularjs', // Usually your repo name.
  plugins: [path.resolve(__dirname, './plugins/firebase/index.js')],
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/cellularjs/cellularjs.com/edit/master',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/cellularjs/cellularjs.com/edit/master',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // The application ID provided by Algolia
        appId: 'Q18Q0O73H0',

        // Public API key: it is safe to commit it
        apiKey: 'bd69740144a0312018def868f08a918a',

        indexName: 'cellularjs',

        // Optional: see doc section belowe
        contextualSearch: true,

        startUrls: ['https://cellularjs.com/'],
        siteMaps: ['https://cellularjs.com/sitemap.xml'],
        discoveryPatterns: ['https://cellularjs.com/**'],

        // Optional: Specify domains wtehere the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
        // externalUrlRegex: 'external\\.com|domain\\.com',

        // Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
        replaceSearchResultPathname: {
          from: '/docs/', // or as RegExp: /\/docs\//
          to: '/',
        },

        // Optional: Algolia search parameters
        searchParameters: {},

        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
      },
      navbar: {
        title: 'CellularJS',
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Docs',
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/cellularjs/cellularjs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `
          Copyright © ${new Date().getFullYear()} CellularJS <a href='https://github.com/great-elephant' target='_blank' rel='noopener noreferrer'>🐘</a>
          <br/> Built with <a href='https://docusaurus.io' target='_blank' rel='noopener noreferrer'>Docusaurus</a>.
        `,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
