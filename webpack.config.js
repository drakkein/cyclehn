const path = require('path');
const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');


const appPath = (...names) => path.join(process.cwd(), ...names);

const PUBLIC_PATH = 'https:/hnpwa.drakkein.me';
//This will be merged with the config from the flavor
module.exports = {
    entry: {
        main: [appPath('src', 'index.ts'), appPath('src', 'css', 'styles.scss')]
    },
    output: {
        filename: 'bundle.js',
        path: appPath('build')
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            options: {
                context: __dirname
            }
        }),
        new SWPrecacheWebpackPlugin(
            {
                cacheId: 'cycle-hnpwa',
                dontCacheBustUrlsMatching: /\.\w{8}\./,
                filename: 'service-worker.js',
                staticFileGlobs: [appPath('build') + '/**/*.{js,html,css,png,jpg,gif,svg}'],
                minify: true,
                navigateFallback: PUBLIC_PATH + 'index.html'
            }
        )
    ]
};
