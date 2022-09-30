console.log("mdrbackground")

let tests = {}
let position = {
	x: 0,
	y: 0
}

browser.runtime.onMessage.addListener((message, e) => {
	console.log("message = ", message)
	tests = message.tests
	position = message.position
	//inject the script in the page	

	setTimeout(() => {
	browser.tabs.executeScript({
		file: "../testMenu/dist/testMenu-Build.js",
	})
	},100)
})