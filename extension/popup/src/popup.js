console.log("popup launched")

function injectMenu() {
	browser.tabs.executeScript({
		file: "../testMenu/dist/testMenu-Build.js"
	})
	console.log("injectMenu launched in the popup")
}

function init() {
	document.getElementById('menu_injector').addEventListener('click', injectMenu)

	getAllTests();
}

document.addEventListener('DOMContentLoaded', init)

async function getAllTests() {
	const testList = await fetch(`http://localhost:3000/cypress/testList?token=e3e0ad32-db66-43c1-9f5e-586ac4099acb`)
		.then(response => response.json())

	for (const test in testList) {
		const testAppend = document.createElement('div')
		const testName = document.createElement('div')
		const testPlay = document.createElement('img')
		const testResult = document.createElement('img')

		testAppend.className = 'testLayout'

		testName.className = "btnActionEmptyAlt"
		testName.style = "width: 60%;"
		testName.textContent = testList[test].name
		testAppend.appendChild(testName)

		
		testPlay.src = "../icons/play-button.png"
		testPlay.className = "btnTestTrigger"
		testPlay.addEventListener('click', () => runTest(testList[test].name))
		testAppend.appendChild(testPlay)

		testResult.src = "../icons/test-neutral-white.png"
		testResult.className = "btnTestTrigger"
		testResult.addEventListener('click', () => showResult())
		testAppend.appendChild(testResult)

		document.querySelector('#listTests').appendChild(testAppend)
	}
}


function runTest(name) {
	console.log("runTest launched in the popup with name " + name)
}

function showResult() {
	console.log("showResult launched in the popup")
}