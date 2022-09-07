const path = require('path');

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
	}
}