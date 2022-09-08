console.log("popup launched")

function injectMenu() {
	let executeScript = browser.tabs.executeScript({
		file: "../testMenu/dist/testMenu-Build.js"
	})
	console.log("injectMenu launched in the popup")
}

function init () {
	document.getElementById('menu_injector').addEventListener('click', injectMenu) //TODO launch coresponding function
	document.getElementById('toggle_highlight').addEventListener('click', () => {console.log('lol2')}) //TODO launch coresponding function
}

document.addEventListener('DOMContentLoaded', init)
