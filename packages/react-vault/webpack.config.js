const webpack = require('@fesk/scripts/webpack');

webpack.externals = webpack.externals ? webpack.externals : {};
webpack.externals.react = 'react';
webpack.externals['react-dom'] = 'react-dom';

module.exports = webpack;
