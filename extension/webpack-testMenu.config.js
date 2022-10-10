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
			SERVER_URL: "https://02deed4e-2189-4705-b726-e4487b2fd444.pub.instances.scw.cloud/freelinette"
		})
	]
}