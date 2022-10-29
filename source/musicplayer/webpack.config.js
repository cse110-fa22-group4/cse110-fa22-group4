const HtmlWebpackPlugin = require('html-webpack-plugin');

let outputDirectory = '/dist'

module.exports = [
    {
        mode: 'development',
        entry: './main.js',
        target: 'electron-main',
        output: {
            path: __dirname + outputDirectory,
            filename: 'main.js'
        }
    },
    {
        mode: 'development',
        entry: './preload.js',
        target: 'electron-preload',
        output: {
            path: __dirname + outputDirectory,
            filename: 'preload.js'
        }
    },
    {
        mode: 'development',
        entry: './renderer.js',
        target: 'electron-renderer',
        devtool: 'source-map',
        output: {
            path: __dirname + outputDirectory,
            filename: 'renderer.js'
        },
        plugins: [
            new HtmlWebpackPlugin( {
                template: './index.html',
                inject: false // THIS LINE IS VERY IMPORTANT! Without this line, webpack instantiates 2 main.js files.
            })
        ]
    }
];