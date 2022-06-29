/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

const withAntdLess = require('next-plugin-antd-less');
const lessToJs = require('less-vars-to-js');
const fs = require('fs')
const path = require('path')

// Read less theme variables and convert them to a object
const themeVariables = lessToJs(
  fs.readFileSync(
    path.resolve(__dirname, './src/styles/theme.less'),
    'utf8'
  )
);

module.exports = withAntdLess({
  modifyVars: themeVariables,

  webpack(config) {
    return config;
  },
});
