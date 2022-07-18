// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hyperion',
  tagline: 'IIIF Framework for building frameworks',
  url: 'https://hyperion.stephen.wf',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'digirati-labs', // Usually your GitHub org/user name.
  projectName: 'hyperion', // Usually your repo name.
  stylesheets: ['https://cdn.jsdelivr.net/npm/@codesandbox/sandpack-react/dist/index.css'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/digirati-labs/hyperion-framework/edit/main/packages/documentation/',
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
      navbar: {
        title: 'Hyperion framework',
        logo: {
          alt: 'My Site Logo',
          src: 'https://raw.githubusercontent.com/stephenwf/hyperion/master/hyperion-logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'tutorial/installation',
            position: 'left',
            label: 'Tutorial',
          },
          {
            type: 'doc',
            docId: 'api/api',
            position: 'left',
            label: 'API',
          },
          {
            href: 'https://github.com/digirati-labs/hyperion',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/digirati-labs/hyperion',
              },
            ],
          },
        ],
        copyright: `Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
