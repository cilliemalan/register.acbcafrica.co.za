const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const config = require('./config');

const dist = path.resolve(__dirname, 'public');
const now = new Date().toISOString().replace(/[:.ZT-]/g,'');

const plugins = [
    new HtmlWebpackPlugin({ template: 'app/index.ejs', gaTrackingId: config.gaTrackingId }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        environment: JSON.stringify(config.environment),
        recaptchaKey: JSON.stringify(config.recaptchaKey),
        clientId: JSON.stringify(config.clientId)
    })
];

module.exports = {
    entry: {
        app: [
            'react-hot-loader/patch',
            './app/index.js',
            'webpack-hot-middleware/client'
        ]
    },
    resolve: { extensions: ['.js', '.jsx'] },
    devtool: 'inline-source-map',
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                        plugins: ['react-hot-loader/babel', 'transform-object-rest-spread']
                    }
                }
            }
        ]
    },
    output: {
        publicPath: '/',
        filename: 'bundle.js',
        path: path.resolve(__dirname, dist)
    }
};