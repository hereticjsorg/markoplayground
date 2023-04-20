const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const fs = require("fs-extra");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const babelConfig = require("./babel.config");

module.exports = (env, argv) => {
    try {
        fs.removeSync(path.resolve(__dirname, "dist"));
    } catch {
        // Ignore
    }
    return ([{
        context: path.resolve(`${__dirname}`),
        performance: {
            maxEntrypointSize: 10485760,
            maxAssetSize: 5242880,
        },
        name: "Userspace",
        target: ["web", "es5"],
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].[fullhash:8].js"
        },
        devtool: argv.mode === "production" ? false : "inline-source-map",
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                }, {
                    test: /\.(woff(2)?|ttf|eot|otf|png|jpg|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    type: "asset/resource",
                    generator: {
                        filename: "asset.[contenthash:8][ext]"
                    }
                }, {
                    test: /\.(css|scss|sass)$/,
                    use: [{
                            loader: argv.mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
                        }, {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1,
                                sourceMap: false,
                                url: true,
                            }
                        },
                        {
                            loader: "sass-loader"
                        },
                    ].filter(i => i !== null)
                },
                {
                    test: /\.marko$/,
                    loader: "@marko/webpack/loader",
                    options: {
                        babelConfig: {
                            ...babelConfig(),
                        }
                    }
                },
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        ...babelConfig()
                    }
                }
            ]
        },
        optimization: {
            splitChunks: {
                chunks: "all",
                maxInitialRequests: 3,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                        filename: "npm.[chunkhash].js",
                    },
                    style: {
                        name: "style",
                        test: /style\.s?css$/,
                        chunks: "all",
                        enforce: true,
                        minChunks: 2,
                        filename: "style.[fullhash:8].js",
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                        filename: data => {
                            if (argv.mode === "production") {
                                return `heretic.${data.chunk.id}.[fullhash:8].js`;
                            }
                            const nameArr = data.chunk.id.split(/_/);
                            return nameArr.length > 4 ? `heretic.${nameArr[nameArr.length - 3]}.${nameArr[nameArr.length - 2]}.${data.chunk.renderedHash}.[fullhash:8].js` : `heretic.generic.${data.chunk.renderedHash}.[fullhash:8].js`;
                        }
                    },
                },
                hidePathInfo: true,
            },
            usedExports: true,
            minimizer: argv.mode === "production" ? [
                new TerserPlugin({
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                }),
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            "default",
                            {
                                discardComments: {
                                    removeAll: true
                                },
                            },
                        ],
                    },
                }),
            ] : [],
        },
        plugins: [
            new webpack.DefinePlugin({
                "typeof window": "'object'",
                "process.browser": true
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src/index.html"),
            }),
            argv.mode === "production" ? new MiniCssExtractPlugin({
                filename: "[name].[fullhash:8].css",
                experimentalUseImportModule: true,
                ignoreOrder: true,
            }) : () => {},
            new ESLintPlugin({
                failOnError: true,
                failOnWarning: false,
            }),
        ],
        resolve: {
            alias: {},
            extensions: [".tsx", ".ts", ".js"],
        }
    }]);
};
