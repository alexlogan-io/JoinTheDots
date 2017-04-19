const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        //displays some info at top of build
        stats: { modules: false },
        // Here the application starts executing and webpack starts bundling
        entry: {
            'app': './Client/ts/app.ts'
        },
        // options for resolving module requests
        resolve: { extensions: ['.js', '.ts'] },
        output: {
            //the target directory for all output files
            path: path.join(__dirname, bundleOutputDir),
            // the filename template for entry chunks
            filename: '[name].js',
            // the url to the output directory resolved relative to the HTML page
            publicPath: '/dist/'
        },
        module: {
            // rules for modules (configure loaders, parser options, etc.)
            rules: [
                { test: /\.ts$/, use: 'awesome-typescript-loader' },
                { test: /\.html$/, use: 'raw-loader' },
                { test: /\.css$/, use: ExtractTextPlugin.extract({ use: 'css-loader' }) },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        // list of additional plugins
        plugins: [
            new ExtractTextPlugin('site.css'),
            new CheckerPlugin(),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
                // Plugins that apply in production builds only
                new webpack.optimize.UglifyJsPlugin()
            ])
    }];
};