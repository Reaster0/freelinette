console.log("mdrbackground")

let registeredTabId = null

let currentTest = {}
let position = {
	x: 0,
	y: 0
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	
	console.log("message = ", message)

	//need to register the id of the tab that host the test menu
	if (message.event === "testMenuInit") {
		registeredTabId = sender.tab.id
		console.log("registeredTabId = ", registeredTabId)
		sendResponse({
			x: position.x,
			y: position.y,
			currentTest: currentTest
		})
	}

	if (message.event === "unRegisterTab") {
		registeredTabId = null
		console.log("un registeredTabId = ", registeredTabId)
	}

	if (message.event === "WindowReload"){
		currentTest = message.currentTest
		position = message.position

		browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

			if (tab.status === "complete" && tab.active && tab.id === registeredTabId) {
				//console.log("i'll relaunch and tabId = ", tabId)
				//console.log("changeInfo = " ,changeInfo)
				//console.log("tab = ", tab)
				browser.tabs.executeScript(tabId, {
					file: "../testMenu/dist/testMenu-Build.js"
				})
			}
		})
	}
})