//browser.tabs.executeScript({file: "/content_scripts/picker.js"})

console.log("popup launched")

function init () {
	document.getElementById('menu_injector').addEventListener('click', () => {console.log('lol')}) //TODO launch coresponding function
	document.getElementById('toggle_highlight').addEventListener('click', () => {console.log('lol2')}) //TODO launch coresponding function
}

document.addEventListener('DOMContentLoaded', init)
