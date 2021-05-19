const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry : './public/js/app.js',
    output : {
        path : path.resolve(__dirname, './public/dist'),
        filename : 'bundle.js'
    },
    module : {
        rules : [
            {
                test : /\.m?js$/,
                use : {
                    loader : 'babel-loader',
                    options : {
                        presets : ['@babel/preset-env']
                    }
                }
            }
        ]
    }
}