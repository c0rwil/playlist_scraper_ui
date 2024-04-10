/** @type {import('next').NextConfig} */

module.exports = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(woff|woff2|eot|ttf|otf|png|jpe?g|gif|pdf|node)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    publicPath: '/',
                },
            },
        });

        return config;
    },
};
