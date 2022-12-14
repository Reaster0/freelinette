import { sendToBackground } from '../../testMenu/utils'

console.log("popup launched")

// async function openIncognito() {
// 	const tabUrl = await browser.tabs.query({active: true, currentWindow: true})
// 	.then((tabs) => {
// 		return tabs[0].url
// 	})

// 	await browser.windows.create({
// 		url: tabUrl,
// 		incognito: true
// 	})
// }

async function injectMenu() {

	//check if the browser tabs is in incognito mode
	// inspect the issue here with the cookies messages
	// await browser.tabs.query({active: true, currentWindow: true})
	// .then(async (tabs) => {
	// 	if (tabs[0].incognito)
	// 		console.log("incognito mode, all fine")
	// 	else
	// 		return await openIncognito()
	// })
	await browser.runtime.sendMessage({event: "saveBundleTest", test: null})
	browser.tabs.executeScript({
		file: "../testMenu/dist/testMenu-Build.js",
	})
	console.log("injectMenu launched in the popup")
}

async function init() {

	try{
		await fetch(`${process.env.SERVER_URL}`)
	}
	catch (e) {
		document.body.innerHTML = `<div class="button_slick Spotnik">server down</div>`
		return
	}

	document.getElementById('insertToken').addEventListener('keydown', registerToken)
	
	if ((await sendToBackground({event: "getToken"})).token == null) 
		return

	document.getElementById("insertToken").style.display = "none"
	document.getElementById("mainMenu").removeAttribute("hidden")
	document.getElementById('menu_injector').addEventListener('click', injectMenu)

	getAllTests();
}

document.addEventListener('DOMContentLoaded', init)

async function getAllTests() {
	const testList = await fetch(`${process.env.SERVER_URL}/cypress/testList`, {
		method: 'GET',
		headers: {
			"token": (await sendToBackground({event: "getToken"})).token
		}
	})
	.then(response => response.json())

	for (const test in testList) {
		const testAppend = document.createElement('div')
		const testName = document.createElement('div')
		const testPlay = document.createElement('img')
		const testLoad = document.createElement('div')
		const testResult = document.createElement('img')
		const testDelete = document.createElement('img')

		testAppend.className = 'testLayout'

		testName.className = "btnActionEmptyAlt"
		testName.textContent = testList[test].name
		testAppend.appendChild(testName)

		testPlay.src = "../icons/play-button.png"
		testPlay.className = "btnTestTrigger"
		testPlay.addEventListener('click', (event) => runTest(testList[test].name, event))
		testAppend.appendChild(testPlay)

		testLoad.className = "loader"
		testLoad.style.display = "none"
		testLoad.innerHTML = `
			<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
				width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
				<rect x="0" y="10" width="4" height="10" fill="#333" opacity="0.2">
				<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0s" dur="0.6s" repeatCount="indefinite" />
				</rect>
				<rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">
				<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.15s" dur="0.6s" repeatCount="indefinite" />
				</rect>
				<rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">
				<animate attributeName="opacity" attributeType="XML" values="0.2; 1; .2" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="height" attributeType="XML" values="10; 20; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
				<animate attributeName="y" attributeType="XML" values="10; 5; 10" begin="0.3s" dur="0.6s" repeatCount="indefinite" />
				</rect>
			</svg>`
		testAppend.appendChild(testLoad)

		testResult.className = "testTrigger"
		if (testList[test].result == "failed"){
			testResult.src = "../icons/test-fail.png"
			testResult.className = "btnTestTrigger"
			testResult.fail = true
			testResult.testName = testList[test].name
			testResult.addEventListener('click', (event) => showResult(event))
		}
		else if (testList[test].result == "success"){
			testResult.src = "../icons/test-success.png"
		}
		else
			testResult.src = "../icons/test-neutral-white.png"
		testAppend.appendChild(testResult)


		testDelete.src = "../icons/crimson-cross.png"
		testDelete.className = "btnTestTrigger"
		testDelete.style.width = "20px"
		testDelete.addEventListener('click', (event) => deleteTest(testList[test].name, event))
		testAppend.appendChild(testDelete)

		document.querySelector('#listTests').appendChild(testAppend)
	}
}


async function runTest(name, event) {
	console.log("runTest launched in the popup with name " + name)
	
	event.target.nextSibling.style.display = "block"
	event.target.style.display = "none"

	const resultTest = await fetch(`${process.env.SERVER_URL}/cypress/launch/${name}`, {
		method: 'GET',
		headers: {
			"token": (await sendToBackground({event: "getToken"})).token
		}
	})
	.then(response => response.json())

	event.target.nextSibling.style.display = "none"
	event.target.style.display = "block"
	
	if (resultTest.status === "success"){
		event.target.nextSibling.nextSibling.src = "../icons/test-success.png"
	}
	else {
		event.target.nextSibling.nextSibling.className = "btnTestTrigger"
		event.target.nextSibling.nextSibling.src = "../icons/test-fail.png"
		event.target.nextSibling.nextSibling.fail = true
		event.target.nextSibling.nextSibling.testName = name
		event.target.nextSibling.nextSibling.addEventListener('click', (event) => showResult(event))
	}
}

async function showResult(event) {
	if (event.target.fail === false) 
		return

	console.log("fail of the test")
	const imgTest = await fetch(`${process.env.SERVER_URL}/cypress/screen/${event.target.testName}`, {
		method: 'GET',
		headers: {
			"token": (await sendToBackground({event: "getToken"})).token
		}
	})
	.then(response => response.blob())
	.then(blob => {
			const url = URL.createObjectURL(blob)
			const img = document.createElement('img')
			img.src = url
			return img
		}
	)
	const newTab = window.open('')
	newTab.document.body.appendChild(imgTest)
}

async function deleteTest(name, event) {
	console.log("deleteTest" + name);
	await fetch(`${ServerURL}/cypress/testList/${name}`, {
		method: 'DELETE',
		headers: {
			"token": (await sendToBackground({event: "getToken"})).token
		}
	})
	event.target.parentNode.parentNode.innerHTML = ""
	getAllTests()
}

async function registerToken(e){
	if (e.key === "Enter") {
		const token = e.target.value
		const res = await fetch(`${process.env.SERVER_URL}/cypress/testList`, {
			method: 'GET',
			headers: {
				"token": token
			}
		})
		if (res.status === 200) {
			console.log("token is valid")
			sendToBackground({event: "registerToken", token: token})
			init()
		}
		else {
			e.target.value = ""
			e.target.placeholder = "Wrong token"
		}
	}
}