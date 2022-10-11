const path = require('path');
const { EnvironmentPlugin } = require("webpack");

module.exports = {
	entry: './testMenu/testMenu.js',
	output: {
		filename: 'testMenu-Build.js',
		path: path.resolve(__dirname, 'testMenu/dist')
	},
	mode: 'production',
	watch: true,
	module: {
		rules: [
			{
				test: /\.(html|css)$/i,
				//use: 'raw-loader', //V4
				type: 'asset/source', //V5
			},
		]
	},
	optimization: {
		minimize: false
	},
	plugins: [
		new EnvironmentPlugin({
			SERVER_URL: `http://localhost:3000/freelinette`
		})
	]
}