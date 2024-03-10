const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { VuetifyLoaderPlugin } = require('vuetify-loader');

module.exports = {
    entry: './src/lib/widget-starter.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.js'
    },
    devServer: {
        hot: true,
        https: true
    },
      
    module: {
        rules: [
            {
                test: /\.(svg|eot|woff|ttf|svg|woff2)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/fonts/[name].[ext]'
                }
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: [/node_modules/, /src\/static/]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    "vue-style-loader",
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                            sassOptions: {
                                fiber: false,
                                indentedSyntax: true // optional
                            }
                        }
                    }
                ]
            },
            {
                test: /\.md$/i,
                use: "raw-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            "@": path.resolve("src")
        },
        fallback: {
            "child_process": false,
            "crypto": false,
            "fs": false,
            "http": false,
            "https": false,
            "os": false,
            "path": false,
            "stream": false,
            "tty": false,
            "url": false,
            "util": false,
            "zlib": false,
            "net": false,
            "tls": false
            // and also other packages that are not found
        }
    },
    plugins: [
        new CleanWebpackPlugin(), // cleanup files before every build
        new CopyPlugin({
            patterns: [
                { from: "./src/index.html", to: "./index.html" },
                { from: "./src/static", to: "static", globOptions: { ignore: ["*.md"] }, noErrorOnMissing: true }
            ]
        }),
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin()
    ]
}