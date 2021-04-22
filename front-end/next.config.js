/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

const less = require('@zeit/next-less')
const sass = require('@zeit/next-sass')

const convert = require('less-vars-to-js')

const fs = require('fs')
const path = require('path')

// Read less theme variables and convert them to a object
const theme = convert(fs.readFileSync(path.resolve(__dirname, './src/styles/theme.less'), 'utf8'))

module.exports = sass({
  // Enable css modules
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 3,
    localIdentName: '[local]___[hash:base64:5]'
  },

  // Unpack options from less and default loaders
  ...less({
    lessLoaderOptions: {
      lessOptions: {
        // Enable js support in less (required by antd)
        javascriptEnabled: true,
        // Pass theme to antd
        modifyVars: theme,
        importLoaders: 0
      },
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        // Location where antd styles lives
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];

        config.externals = [
          // Make sure that antd styling is left alone
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()

            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback()
            }
          },

          // Unpack other options if they exist
          ...(typeof origExternals[0] === 'function' ? [] : origExternals)
        ]

        // Ignore files in antd folder
        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader'
        })
      }

      return config
    }
  })
})
