const path = require('path');

module.exports = {
	entry: './testMenu/testMenu.js',
	output: {
		filename: 'testMenu-Build.js',
		path: path.resolve(__dirname, 'testMenu/dist')
	},
	mode: 'production',

	devServer: {
		static: {
			directory: path.join(__dirname, 'testMenu/dist'),
		},
		port: 42500,
	}
}