import { getCSSPath, getCSSSelector } from "../utils.js"

export function saintPickerInit(document, menuIframe){
	
	const saintPicker = document.createElement("div")
	saintPicker.className = "saintPickerOverlay"
	document.body.appendChild(saintPicker)
	
	saintPicker.addEventListener("mousemove", (e) => {
		clearHighlight()
		e.target.style.zIndex = -2147483646
		let elem = document.elementFromPoint(e.x, e.y)
		e.target.style.zIndex = 2147483646
		elem.classList.add("saintHover")
	})
	
	saintPicker.addEventListener("click", (e) => {
		e.target.style.zIndex = -2147483646
		let elem = document.elementFromPoint(e.x, e.y)
		e.target.style.zIndex = 2147483646
		clearHighlight()
		document.querySelector(".saintPickerOverlay").remove()
		menuIframe.body
		.querySelector("#elementPickerBtn").dispatchEvent(new CustomEvent("elemInspector", {detail: elem}))
	})
	
	function clearHighlight() {
		document.querySelectorAll(".saintHover").forEach(e => {
			e.classList.remove("saintHover")
		})
	}
}

export function toggleShowParams(action, iframeDocument){
	console.log("toggleShowParams", action)

	iframeDocument.getElementById("btnParamSelect").setAttribute("hidden", "true")
	iframeDocument.getElementById("divTypeParam").setAttribute("hidden", "true")
	iframeDocument.getElementById("btnParamExist").setAttribute("hidden", "true")
	iframeDocument.getElementById("ParamDropDownMenu").style.left = null
	if (action === "Click"){
		console.log("show params click")
		iframeDocument.getElementById("btnParamSelect").removeAttribute("hidden")
		iframeDocument.getElementById("ParamDropDownMenu").style.left = null
	}
	else if (action === "Fill") {
		console.log("show params fill")
		iframeDocument.getElementById("divTypeParam").removeAttribute("hidden")
		iframeDocument.getElementById("ParamDropDownMenu").style.left = "-210%"
	}
	else if (action === "Look") {
		console.log("show params look")
		iframeDocument.getElementById("btnParamExist").removeAttribute("hidden")
		iframeDocument.getElementById("ParamDropDownMenu").style.left = null
	}
}

//system for the action buttons for creation of the tests (related to #newTestInput)
export function actionBtnInit(testInput, document) {
	document.getElementById("btnActionClick").addEventListener("click", () => {
		testInput.action = "Click"
		document.getElementById("btnParamSelect").innerHTML = '<option selected value="" hidden disabled>Select</option>'
	})
	document.getElementById("btnActionFill").addEventListener("click", () => {
		testInput.action = "Fill"
		document.getElementById("btnParamSelect").innerHTML = '<option selected value="" hidden disabled>Select</option>'
	})
	document.getElementById("btnActionObserve").addEventListener("click", () => {
		testInput.action = "Look"
		document.getElementById("btnParamSelect").innerHTML = '<option selected value="" hidden disabled>Select</option>'
	})
}

export function paramsBtnInit(document, pageDocument, testInput) {
	document.getElementById("params-dropdown-button").disabled = true

	document.getElementById("btnParamType").addEventListener("click", () => {
		testInput.params = {
			name: "Type",
			value: document.getElementById("inputTypeParam").value
		}
	})

	document.getElementById("btnParamSelect").addEventListener("click", (e) => {

		const select = pageDocument.querySelectorAll(testInput.element.path + " option")
		console.log(select)
		if (e.target.tagName != "OPTION"){
			e.target.innerHTML = '<option selected value="" hidden disabled>Select</option>'
			for (let i = 0; i < select.length; i++){
				console.log("i add one option")
				const option = document.createElement("option")
				option.value = select[i].value
				option.innerHTML = select[i].innerHTML
				e.target.appendChild(option)
			}
			testInput.params = {
				name: null,
				value: null,
			}
		}
		else
			testInput.params = {
				name: "Select",
				value: {
					id: e.target.value,
					text: e.target.innerHTML
				}
			}
	})

	document.getElementById("btnParamExist").addEventListener("click", () => {
		testInput.params = {
			name: "Exist",
			value: null,
		}
	})
}

//init the button to export to JSON
export function exportJSONBtnInit(document, testsQueue){
	document.getElementById("btnExportJSON").addEventListener("click", function(){
		console.log(JSON.stringify(testsQueue))
		const newTab = window.open("data:text/json," + encodeURIComponent(JSON.stringify(testsQueue, null, 2)), "_blank")
		newTab.focus()
	})
}

//init for the button to add new tests
export function addNewTestBtnInit(document, testsQueue, testInput, _testInput){
	document.getElementById("btnConfirmTest").addEventListener("click", () => {

	testsQueue.push(structuredClone(_testInput))
	newTestAppend(document.getElementById("testList"), structuredClone(_testInput), testsQueue.length - 1)
	testInput.action = null
	testInput.element = {
		"selector": null,
		"path": null,
	}
	testInput.params = {
		"name": null,
		"value": null,
		"valueExtend": null,
	}
	document.getElementById("inputTypeParam").value = null
	console.log(testsQueue)
	})
	document.getElementById("btnConfirmTest").disabled = true
	document.getElementById("btnConfirmTest").className = "btnActionFullAlt deButtoned"

	//append a new test in the dom
	function newTestAppend(parentNode, test, id){
		const addBtn = document.getElementById("btnConfirmTest")
		addBtn.disabled = true
		document.getElementById("btnConfirmTest").className = "btnActionFullAlt deButtoned"
		toggleShowParams(null, document)
		document.getElementById("params-dropdown-button").disabled = true
		document.getElementById("params-dropdown-button").classList.add("deButtoned")


		const testElement = document.createElement("div")
		testElement.className = "newTestInput"
		testElement.attributes.number = id
		testElement.style = "justify-content: space-between; gap: 2px;"

		const actionBtn = document.createElement("button")
		actionBtn.className = "btnActionFull deButtoned"
		if (test.action != null)
			actionBtn.innerHTML = test.action
		else
			actionBtn.innerHTML = "Action"

		const elementBtn = document.createElement("button")
		elementBtn.className = "btnActionEmpty deButtoned"
		elementBtn.style = "overflow-x: hidden; max-width: 30%;"
		if (test.element.selector != null)
			elementBtn.innerHTML = test.element.selector
		else
			elementBtn.innerHTML = "Element"

		const paramsBtn = document.createElement("button")
		paramsBtn.className = "btnActionEmptyAlt deButtoned"
		paramsBtn.style = "overflow-x: scroll; max-width: 30%;"
		if (test.params.name === null)
			paramsBtn.innerHTML = "Params"
		else
			paramsBtn.innerHTML = test.params.name + ": " + test.params.value

		const deleteBtn = document.createElement("button")
		deleteBtn.className = "buttonDelete"
		deleteBtn.innerHTML = "X"
		deleteBtn.onclick = function(){
			testsQueue.splice(testElement.attributes.number, 1)
			parentNode.innerHTML = ""
			for (let key in testsQueue)
				newTestAppend(parentNode, testsQueue[key], key)
		}

		testElement.appendChild(actionBtn)
		testElement.appendChild(elementBtn)
		testElement.appendChild(paramsBtn)
		testElement.appendChild(deleteBtn)
		parentNode.appendChild(testElement)
	}
}

//initialize the animation of the drawer with id #data-dropdown
export function drawerSystemInit(document) {
	document.addEventListener('click', e => {
		const isDropdownButton = e.target.matches('#action-dropdown-button')
		const isDropdownParamBtn = e.target.matches('#params-dropdown-button')
		if (!isDropdownButton && !isDropdownParamBtn && e.target.closest(".dropDown") != null && !e.target.matches("button"))
			return
		
		let currentDropdown
		if (isDropdownButton || isDropdownParamBtn) {
			currentDropdown = e.target.closest('.dropDown')
			currentDropdown.classList.toggle('active')
		}
		
		document.querySelectorAll(".dropDown.active").forEach(dropdown => {
			if (dropdown !== currentDropdown)
			dropdown.classList.remove('active')
		})
	})
}

//initialize the Element button
export function elementPickerInit(document, testInput, pageDocument){
	const elementBtn = document.getElementById("elementPickerBtn")

	elementBtn.addEventListener("click", () => {
		saintPickerInit(pageDocument, document)
		document.getElementById("btnParamSelect").innerHTML = '<option selected value="" hidden disabled>Select</option>'
	})

	elementBtn.addEventListener("elemInspector", (e) => {
		testInput.element = {
			"selector": getCSSSelector(e.detail),
			"path": getCSSPath(e.detail)
		}
		console.log(getCSSPath(e.detail))
	})
}

export function exitBtnInit(document) {
	document.getElementById("btnExitTest").addEventListener("click", (e) => {
		location.reload()
	})
}

export function saveBtnInit(document, currentTest) {
	document.getElementById("btnSaveTest").addEventListener("click", async (e) => {
		const res = await fetch("http://localhost:3000/cypress/testList", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": "e3e0ad32-db66-43c1-9f5e-586ac4099acb",
			},
			body: JSON.stringify(currentTest)
		}).then(res => res.json())

		//TODO check the response in res

		console.log(res)
		location.reload()
	})
}