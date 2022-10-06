console.log("mdrbackground")

let registeredTabId = null

let currentTest = null
let position = {
	x: 0,
	y: 0
}

let tokenLogin = null

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	
	console.log("message = ", message)

	if (message.event === "registerToken") {
		tokenLogin = message.token
		console.log("tokenLogin received = ", tokenLogin)
	}

	if (message.event === "getToken") {
		console.log("ill send back the token=", tokenLogin)
		sendResponse({token: tokenLogin})
	}

	//need to register the id of the tab that host the test menu
	if (message.event === "testMenuInit") {
		registeredTabId = sender.tab.id
		console.log("testMenuInit:")
		console.log(currentTest)
		sendResponse({
			x: position.x,
			y: position.y,
			currentTest: currentTest
		})
	}

	if (message.event === "saveBundleTest"){
		console.log("saveBundleTest")
		currentTest = message.test
	}
	
	if (message.event === "saveNewTest") {
		console.log("saveNewTest")
		console.log(message)
		currentTest.tests.push(structuredClone(message.test))
	}

	if (message.event === "deleteTest") {
		console.log("deleting: ", message.index)
		currentTest.tests.splice(message.index, 1)	
	}

	if (message.event === "unRegisterTab") {
		registeredTabId = null
		console.log("un registeredTabId = ", registeredTabId)
	}

	if (message.event === "WindowReload"){
		console.log("WindowReload", message.currentTest, message.position)
		//currentTest = message.currentTest
		position = message.position

		browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

			if (tab.status === "complete" && tab.active && tab.id === registeredTabId) {
				console.log("i'll relaunch and tabId = ", tabId)
				//console.log("changeInfo = " ,changeInfo)
				//console.log("tab = ", tab)
				browser.tabs.executeScript(tabId, {
					file: "../testMenu/dist/testMenu-Build.js"
				})
			}
		})
	}
})