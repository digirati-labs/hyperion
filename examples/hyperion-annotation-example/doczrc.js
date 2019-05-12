const sass = require('@fesk/webpack-config/lib/loaders/sass');
const miniCss = require('@fesk/webpack-config/lib/plugins/mini-css');

module.exports = {
  title: 'Hyperion annotation',
  description: 'Twitter powered annotation tool',
  src: './src/',
  dest: './dist/docs',
  base: '/docs/',
  debug: false,
  port: 5104,
  protocol: 'http',
  modifyBundlerConfig: config => {
    config.module.rules.push(sass);
    config.plugins.push(miniCss);
    return config;
  },
  themeConfig: {
    colors: {
      primary: '#252A7C',
      secondary: '#FEF900',
    },
    styles: {
      body: `
          font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
      `,
      '*, *:after, *:before': `
        box-sizing: border-box;
      `,
      container: `
        @media (min-width: 1279px) {
          width: 100%;
          max-width: 1280px;
        }
      `,
    },
  },
};
