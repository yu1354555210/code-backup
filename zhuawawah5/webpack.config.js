var path = require('path')
var webpack = require('webpack')
var vuxLoader = require('vux-loader')

const webpackConfig = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: './dist/',
		//filename: 'build_[chunkhash:16].js'
		filename: 'build.js'
		//filename: '[name].js'
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				],
			}, {
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {}
					// other vue-loader options go here
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					plugins: ['syntax-dynamic-import']
				},
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]'
				}
			}
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	devServer: {
		// host: '192.168.0.38',
		historyApiFallback: true,
		noInfo: true,
		overlay: true
	},
	performance: {
		hints: false
	},
}

// module.exports = {
// //devtool: '#eval-source-map'
// }

if(process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			comments: false,
			sourceMap: false,
			compress: {
				warnings: false,
				//drop_console:true,
				//collapse_vars:true,
				//reduce_vars:true,
			},
			except: ['$super', '$', 'exports', 'require']
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}

module.exports = vuxLoader.merge(webpackConfig, {
	plugins: ['vux-ui']
})