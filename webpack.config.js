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
    entry: {
        // scripts и user - будут являтся именами выходных файлов в папке dist
        scripts: './src/index.js',
        user: './src/user.js',
    },
    output: {
        filename: '[name].[contenthash].js', // добавление contenthash в имени файла для учета кэширования
        assetModuleFilename: "assets/[hash][ext][query]", // для модуля ресерсов (изображений) указываем отдельную папку assets
        clean: true, // очищаем dist перед каждой сборкой
    },
    // Добавление исходной карты, чтобы при инспектировании элементов видеть в каком файле-строке находятся стили/скрипты
    devtool: 'source-map',
    optimization: {
        // плагин splitChunks создает дополнительный js файл (чанк) в который выносит импортируемые библиотеки в каждой
        // нашей entry points, и не толлько... , оптимизируя, уменяшая их размеры
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [
        new MiniCssExtractPlugin({ // из этого экземпляра юзаем loader для подключениея стилей см. rules
            // добавляем ХЭШ в имя файлов для корректной работы кэширования
            filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({  // https://github.com/jantimon/html-webpack-plugin
            template: "./src/index.pug" // template указывает откуда нужно брать шаблон  компилировать в папку dist
        })],
    module: {
        // здесь мы будем настраивать все наши loaders
        rules: [
            // каждый loader или цеполчка loaders настраивается в отдельно объекте {}
            {
                // ищем каждый файл html и передаем на обработку в html-loader.
                // Здесь мы используем этот loader для изьятия (ниже модуль ресурсов?) картинок из тега <img> и передачи в /assets
                test: /\.html$/i,
                loader: "html-loader",
            },
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
                                        // опирается browserslist из package.json
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
            },
            {
                // модуль ресурсов для изъятия изображений из стилей background-url
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                // модуль ресурсов для изъятия шрифтов
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                // обработчик файлов шаблонизатора pug
                test: /\.pug$/,
                loader: 'pug-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                // подключаем траспилер babel
                test: /\.m?js$/,
                exclude: /node_modules/, // игнорируем
                use: {
                    loader: 'babel-loader',
                    options: {
                        //preset-env для более гибкой настройки babel-loader
                        // например основываясь на информации св-ва browserslist из package.json
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devServer: {
        open: true,
        static: {
            directory: './src',
            watch: true
        },
    },
}
