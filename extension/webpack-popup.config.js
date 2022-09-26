const path = require('path')

module.exports = {
	entry: './popup/src/popup.js',
	output: {
		filename: 'popup-Build.js',
		path: path.resolve(__dirname, 'popup/dist')
	},
	mode: "production",
	watch: true,
	optimization: {
		minimize: false
	},
}