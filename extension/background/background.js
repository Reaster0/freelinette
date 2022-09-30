console.log("mdrbackground")

let tests = {}
let position = {
	x: 0,
	y: 0
}

browser.runtime.onMessage.addListener((message, e) => {
	
	console.log("message = ", message)
	if (message.event === "WindowReload"){
		tests = message.tests
		position = message.position
		//console.log("e = ", e)
		const tabId = e.tab.id
		//inject the script in the page	
		browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
			if (tab.status === "complete" && tab.active && tab.id === tabId) {
				console.log("i'll relaunch and tabId = ", tabId)
				//console.log("changeInfo = " ,changeInfo)
				console.log("tab = ", tab)
				browser.tabs.executeScript(tabId, {
					file: "../testMenu/dist/testMenu-Build.js"
				})
				browser.tabs.sendMessage(tab.windowId, "lol")
			}
		})
	}
})