const path = require('path');

const config = {
    entry: "./src/js/app.js",
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname + '/dist/js/')
    },
    devtool: 'inline-source-map',
    watch: true
};

module.exports = config;