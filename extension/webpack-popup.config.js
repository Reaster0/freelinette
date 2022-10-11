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
			SERVER_URL: `http://localhost:3000/freelinette`
		}),
	]
}