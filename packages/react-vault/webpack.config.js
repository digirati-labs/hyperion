const webpack = require('@fesk/scripts/webpack');

webpack.externals = webpack.externals ? webpack.externals : {};
webpack.externals.react = 'React';
webpack.externals['react-dom'] = 'ReactDOM';

module.exports = webpack;
