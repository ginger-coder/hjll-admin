"use strict";
const path = require("path");
const defaultSettings = require("./src/settings.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const config = require("./src/config");
const webpack = require('webpack')
// 生产环境，测试和正式
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
// gzip
const CompressionPlugin = require('compression-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

const name = defaultSettings.title || "管理后台";

const port = process.env.port || process.env.npm_config_port || 9528; // dev port

// 添加时间戳
const Timestamp = parseInt(new Date().getTime() / 1000);

module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: process.env.NODE_ENV === "development",
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true,
        },
        proxy: {
            "/api": {
                // target: "http://192.168.51.141/",
                // target: config.BASE_URL, // 如果config.js有改动需要重启
                // target: "https://haijiu.hainacssp.com",
                target: config.BASE_URL, // 如果config.js有改动需要重启
                // target:  process.env.VUE_APP_BASE_URL,
                changeOrigin: true,
                logLevel: "debug",
                pathRewrite: {
                    "^/api": "",
                },
            },
            '/jsonapi': {
                target: process.env.VUE_APP_BASE_URL, //路径指向本地主机地址及端口号
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/jsonapi': '/' //路径转发代理
                }
            },
            // '/admin': {
            //     target: process.env.VUE_APP_BASE_URL,
            //     ws: true,
            //     changeOrigin: true,
            //     pathRewrite: {
            //         '^/admin': '/' 
            // },
            // "/api": {
            //     target: 'http://192.168.0.116:8076',
            //     pathRewrite: {
            //         "^/api": "",
            //     },
            // },
            // 本地开发专用 修改对应的 VUE_APP_BASE_API = /; VUE_APP_BASE_URL=本地ip  建议新建 .env.development.local 文件修改
            "/": {
                target: process.env.VUE_APP_BASE_URL,
            },
        },
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                "@p": resolve("public"),
                "@c": resolve("src/components"),
                "@": resolve("src"),
            },
        },
        output: {
            // 输出重构【模块名称.时间戳】
            filename: `[name].${Timestamp}.js`,
            chunkFilename: `static/js/[name].${Timestamp}.js`,
            globalObject: 'this',
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            })
        ]
    },
    chainWebpack(config) {
        config.plugin("preload").tap(() => [
            {
                rel: "preload",
                fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
                include: "initial",
            },
        ]);
        if (process.env.NODE_ENV !== "development") {
            config.plugin('compressionPlugin').use(new CompressionPlugin({
                filename: '[path].gz',
                algorithm: 'gzip',
                test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
                threshold: 10240, // 处理大于xx字节 的文件
                minRatio: 0.8, // 默认: 0.8
                // 是否删除源文件，默认: false
                // deleteOriginalAssets: false
            }));
            config.plugin("html").tap((args) => {
                if (args[0].minify) {
                    args[0].minify.removeAttributeQuotes = false;
                }
                return args;
            });
        }

        config.plugins.delete("prefetch");

        config.module.rule("svg").exclude.add(resolve("src/icons")).end();
        config.module
            .rule("icons")
            .test(/\.svg$/)
            .include.add(resolve("src/icons"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            })
            .end();
        config.module
            .rule("file")
            .test(/\.xls(x)?$/)
            .use("file-loader")
            .loader("file-loader")
            .options({
                name: `static/template/[name].${Timestamp}.[ext]`,
            })
            .end();

        config.when(process.env.NODE_ENV !== "development", (config) => {
            config
                .plugin("ScriptExtHtmlWebpackPlugin")
                .after("html")
                .use("script-ext-html-webpack-plugin", [
                    {
                        // `runtime` must same as runtimeChunk name. default is `runtime`
                        inline: /runtime\..*\.js$/,
                    },
                ])
                .end();
            config.optimization.splitChunks({
                chunks: "all",
                cacheGroups: {
                    libs: {
                        name: "chunk-libs",
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: "initial", // only package third parties that are initially dependent
                    },
                    elementUI: {
                        name: "chunk-elementUI", // split elementUI into a single package
                        priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
                    },
                    commons: {
                        name: "chunk-commons",
                        test: resolve("src/components"), // can customize your rules
                        minChunks: 3, //  minimum common number
                        priority: 5,
                        reuseExistingChunk: true,
                    },
                },
            });
            // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
            config.optimization.runtimeChunk("single");
        });
    },
};
