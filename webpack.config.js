const path = require('path');

const config = {
    entry: {
        app: './src/js/app.js',
    },
    output: {
        path: path.join(__dirname + '/dist/js/'),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    watch: true
};

module.exports = config;