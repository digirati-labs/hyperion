const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        use: [
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => `
        <html>
          <style>
            body, html { overflow: hidden; }
          </style>
          <head>
            ${htmlWebpackPlugin.tags.headTags}
          </head>
          <body>
            <div id="root"></div>
            ${htmlWebpackPlugin.tags.bodyTags}
          </body>
        </html>
      `,
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devServer: {
    stats: 'errors-only',
    host: '0.0.0.0',
    contentBase: path.resolve('../static'),
  },
};
