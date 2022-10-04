const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    // Output the bundled code to dist directory
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    // Webpack plugins that will be used
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'JATE - Just Another Text Editor',
      }),
// Injects the custom service workers
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),
// Craetes the manifest file
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'JATE - Just Another Text Editor',
        short_name: 'JATE',
        description: 'A simple text editor',
        background_color: '#03379b',
        theme_color: '#ffffff',
        start_url: '/',
        publicPath: '/',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),     
    ],

    module: {
      // Css Loaders
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // Seting up the use of babel to use ES6
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        }
      ],
    },
  };
};