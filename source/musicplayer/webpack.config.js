const HtmlWebpackPlugin = require('html-webpack-plugin');

let outputDirectory = '/dist'

module.exports = [
    {
        mode: 'development',
        entry: './main/main.js',
        target: 'electron-main',
        devtool: 'source-map',
        output: {
            path: __dirname + outputDirectory,
            filename: 'main.js'
        }
    },
    {
        mode: 'development',
        entry: './preload/preload.js',
        target: 'electron-preload',
        devtool: 'source-map',
        output: {
            path: __dirname + outputDirectory,
            filename: 'preload.js'
        }
    },
    {
        mode: 'development',
        entry: './renderer/renderer.js',
        target: 'electron-renderer',
        devtool: 'source-map',
        output: {
            path: __dirname + outputDirectory,
            filename: 'renderer.js'
        },
        plugins: [
            new HtmlWebpackPlugin( {
                template: './html/index.html',
                inject: false // THIS LINE IS VERY IMPORTANT! Without this line, webpack instantiates 2 main.js files.
            })
        ]
    }
];