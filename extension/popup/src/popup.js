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
		const testDelete = document.createElement('img')

		let resultTest = {}

		testAppend.className = 'testLayout'

		testName.className = "btnActionEmptyAlt"
		testName.textContent = testList[test].name
		testAppend.appendChild(testName)

		
		testPlay.src = "../icons/play-button.png"
		testPlay.className = "btnTestTrigger"
		testPlay.addEventListener('click', (event) => runTest(testList[test].name, resultTest, event))
		testAppend.appendChild(testPlay)

		testResult.src = "../icons/test-neutral-white.png"
		testResult.className = "testTrigger"
		testAppend.appendChild(testResult)


		testDelete.src = "../icons/crimson-cross.png"
		testDelete.className = "btnTestTrigger"
		testDelete.style.width = "20px"
		testDelete.addEventListener('click', (event) => deleteTest(testList[test].name, event))
		testAppend.appendChild(testDelete)

		document.querySelector('#listTests').appendChild(testAppend)
	}
}


async function runTest(name, resultTest, event) {
	console.log("runTest launched in the popup with name " + name)
	resultTest = await fetch(`http://localhost:3000/cypress/launch/${name}?token=e3e0ad32-db66-43c1-9f5e-586ac4099acb`, {
		method: 'GET',
		headers: {
			"token": "e3e0ad32-db66-43c1-9f5e-586ac4099acb"
		}
	})
	.then(response => response.json())
	
	if (resultTest.status === "success"){
		event.target.nextSibling.src = "../icons/test-success.png"
	}
	else {
		event.target.nextSibling.className = "btnTestTrigger"
		event.target.nextSibling.src = "../icons/test-fail.png"
		event.target.nextSibling.fail = true
		event.target.nextSibling.testName = name
		event.target.nextSibling.addEventListener('click', (event) => showResult(event))
	}
}

function showResult(event) {
	if (event.target.fail === true) {
		console.log("fail of the test")
		window.open(`http://localhost:3000/cypress/screen/${event.target.testName}?token=e3e0ad32-db66-43c1-9f5e-586ac4099acb`)
	}
	else {
		console.log("success of the test")
	}
}

async function deleteTest(name, event) {
	console.log("deleteTest" + name);
	await fetch(`http://localhost:3000/cypress/testList/${name}?token=e3e0ad32-db66-43c1-9f5e-586ac4099acb`, {
		method: 'DELETE',
		headers: {
			"token": "e3e0ad32-db66-43c1-9f5e-586ac4099acb"
		}
	})
	event.target.parentNode.parentNode.innerHTML = ""
	getAllTests()
}