const path = require('path');
const { EnvironmentPlugin } = require("webpack");

module.exports = {
	entry: './popup/src/popup.js',
	output: {
		filename: 'popup-Build.js',
		path: path.resolve(__dirname, 'popup/dist')
	},
	target: 'web',
	mode: "production",
	watch: true,
	optimization: {
		minimize: false
	},
	plugins: [
		new EnvironmentPlugin({
			SERVER_URL: "https://02deed4e-2189-4705-b726-e4487b2fd444.pub.instances.scw.cloud/freelinette"
		}),
	]
}