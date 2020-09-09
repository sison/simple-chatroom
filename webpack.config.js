/*
 * @Author: sison.luo
 * @Date:   2019-09-02 21:41:22
 * @Last Modified by:   sison.luo
 * @Last Modified time: 2019-09-03 22:44:08
 */


const webpack = require('webpack')
const path = require('path')
const assetsWebpackPlugin = require('assets-webpack-plugin')

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: path.resolve(__dirname, 'entry/index.js'),
	output: {
		filename: '[name].bundle.js?[hash]',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader'
				]
			},
			{
				test: /\.js?$/,
				loaders: ['babel-loader']
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: '1024'
					}
				}, ]
			}
		]
	},
	resolve: {
		extensions: ['.js', '.json', '.css'],
		alias: {
			'@': path.resolve(__dirname, '/')
		}
	},
	optimization: {
		// splitChunks: {
		// 	minSize: 10,
		// 	cacheGroups: {
		// 		commons: {
		// 			name: 'commons',
		// 			minChunks: 2,
		// 			chunks: 'initial',
		// 			minSize: 0,
		// 			priority: 1,
		// 		}
		// 	}
		// }
	},
	plugins: [
		new webpack.ProvidePlugin({
			_: 'lodash',
			$: 'jquery'
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css?[hash]",
			// chunkFilename: "[name].css?[hash]"
		}),
		new OptimizeCSSAssetsPlugin()
		// new htmlwebpackplugin({
		// 	filename: 'index.html',
		// 	template: path.resolve(__dirname, 'index.html'),
		// 	inject: 'head',
		// 	chunks: ['commons'],
		// 	minify: {
		// 		removeComments: true,
		// 		collapseWhitespace: false,
		// 		minifyCSS: true
		// 	}
		// })
	],
	externals: {
		jquery: 'jQuery',
		lodash: 'Lodash'
	}
}