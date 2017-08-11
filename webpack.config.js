const webpack = require('webpack');
const { lstatSync, readdirSync } = require('fs')
const { resolve, basename } = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

// This function generates configuration for files in the
// ./src/apps/ folder
const generateAppsConfig = function() {
    const appsSrc = './src/apps';
    const appsDist = './apps/';

    const isDirectory = source => lstatSync(source).isDirectory();

    // Get all subdirectories in the ./src/apps,
    // so we can just add a new folder there and
    // have automatically the entry points updated

    const getDirectories = source =>
        readdirSync(source)
            .map(name => resolve(source, name))
            .filter(isDirectory);

    const appsDirs = getDirectories(appsSrc);

    // This will convert each folder path to an entry point. In this example
    // it fill look like this:
    // [
    //     {
    //         './apps/bitcoin': '/home/kuzzmi/Projects/webpack-multiple-entries/src/apps/bitcoin'
    //     },
    //     {
    //         './apps/ethereum': '/home/kuzzmi/Projects/webpack-multiple-entries/src/apps/ethereum'
    //     }
    // ]

    const entry = appsDirs.reduce((entry, dir) => {
        entry[appsDist + basename(dir) + '/bundle'] = `${dir}/index.js`;
        return entry;
    }, {});

    // This will convert each folder path to config for
    // CopyWebpackPlugin so we can store html files in the
    // same directory as source and simply copy during the
    // build.

    const htmls = appsDirs.reduce((arr, dir) => ([
        ...arr,
        {
            from: `${dir}/index.html`,
            to: appsDist + basename(dir),
        }
    ]), []);

    return {
        entry,
        htmls,
    };
};

// Our entry points and html paths
const { entry, htmls } = generateAppsConfig();

// Here we'll bundle common modules,
// so they are not included in each
// sub-app
entry.vendor = [ 'react', 'react-dom' ];

module.exports = {
    entry,

    output: {
        path: resolve(__dirname, 'dist'),

        // [name] here will be used from the "entry" object.
        // As each key in "entry" object forms a file path,
        // Webpack will create a matching folder structure
        // on build.
        filename: '[name].js',
    },

    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: ['react'],
            },
        }],
    },

    resolve: {
        alias: {
            core: resolve(__dirname, './src/core'),
        },
    },

    devServer: {
        contentBase: resolve(__dirname, 'dist'),
        publicPath: '/',
        hot: true,
    },

    plugins: [
        new CopyWebpackPlugin(htmls),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
        }),
    ],
};
