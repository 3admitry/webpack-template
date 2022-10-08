const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let mode = 'development'
// process.env.NODE_ENV - системная переменная окружения
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}

console.log(mode + ' mode')

module.exports = {
    mode: mode,
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({  // https://github.com/jantimon/html-webpack-plugin
            template: "./src/index.html" // template указывает откуда нужно брать шаблон  компилировать в папку dist
        })],
    module: {
        // здесь мы будем настраивать все наши loaders
        rules: [
            // каждый loader или цеполчка loaders настраивается в отдельно объекте
            {
                test: /\.(sa|sc|c)ss$/, // регулярное выражение для поиска файлов с такими выражениями и передачи в loaders
                use: [
                    //style-loader - js напрямую встраивает стили в DOM дерево в блок <head> (смотреть на localhost)
                    //MiniCssExtractPlugin - извлекает стили отдельным файлом main.css в папку dist
                    (mode === 'development') ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        // в данном пакете автомитечески включе автопрефексер, который добавляет
                                        // префексы стилям для поддержки старых браузеров
                                        "postcss-preset-env",
                                        {
                                            // Options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    "sass-loader",
                ],
            }
        ]
    }
}
