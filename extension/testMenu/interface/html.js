import { dragElement, getCSSPath, getCSSSelector } from "../utils.js"
import htmlPage from "./testMenu.html"
import cssPage from "./testMenu.css"

export function injectHtml(document){
	const injectStyle = document.createElement('style')
	injectStyle.innerHTML = `
		.saintHover {
			outline: deeppink dashed 2px !important;
		}
		.saintPickerOverlay{
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2147483646;
			cursor: pointer;
		}`
	document.head.appendChild(injectStyle)

	let menuIframe = document.createElement('iframe')
	menuIframe.frameBorder = 0
	menuIframe.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'
	menuIframe.style.borderRadius = '10px'
	menuIframe.style.height = '600px'
	menuIframe.style.width = '400px'
	menuIframe.id = 'menuIframe'

	let contain = document.createElement('div')
	contain.style.zIndex = '2147483647'
	contain.style.position = 'fixed'
	contain.style.top = '40%'
	contain.style.left = '20%'
	contain.id = 'menu_contain'

	contain.appendChild(menuIframe)
	document.body.append(contain)


	menuIframe.onload = function () {
		initialiseTestMenu(contain, menuIframe, document)
	}

	function initialiseTestMenu(contain, menuIframe, pageDocument)
	{
		menuIframe.contentDocument.head.innerHTML = `<meta charset="utf-8">`
		menuIframe.contentDocument.body.innerHTML = htmlPage
		const stylesheet = menuIframe.contentDocument.createElement('style')
		stylesheet.innerHTML = cssPage
		menuIframe.contentDocument.head.appendChild(stylesheet)
		
		dragElement(contain);
		innerPageScript(menuIframe.contentDocument)


		function innerPageScript(document){
			let _testInput = {
				"action": null,
				"element": {
					"selector": null,
					"path": null,
				},
				"params": {
					"name": null,
					"value": null}
			}
		
			let testsQueue = []
		
			//menu to create tests
			let testInput = new Proxy(_testInput, {
				set: function (target, key, value) {
					if (key === "action"){
						if (value === null)
							document.getElementById("action-dropdown-button").innerHTML = "Action"
						else
							document.getElementById("action-dropdown-button").innerHTML = value
						}
					if (key === "element") {
						if (value.selector === null)
							document.getElementById("elementPickerBtn").innerHTML = "Element"
						else
							document.getElementById("elementPickerBtn").innerHTML = value.selector
					}
					if (key === "params") {
						if (value.name === null)
							document.getElementById("inputTypeParam").value = "Params"
						else
							document.getElementById("inputTypeParam").value = value.name
					}
					target[key] = value
					//console.log("key: ", key, "value: ", value)

					if (target.action != null && target.element.selector != null){
						document.getElementById("btnConfirmTest").disabled = false
						document.getElementById("btnConfirmTest").className = "btnActionFullAlt"
					}
					return Reflect.set(target, key, value)
				}
			})
		
			drawerSystemInit()
			actionBtnInit()
			paramsBtnInit()
			elementPickerInit()
			addNewTestBtnInit()
			exportJSONBtnInit()


			//init the button to export to JSON
			function exportJSONBtnInit(){
				document.getElementById("btnExportJSON").addEventListener("click", function(){
					console.log(JSON.stringify(testsQueue))
					const newTab = window.open("data:text/json," + encodeURIComponent(JSON.stringify(testsQueue, null, 2)), "_blank")
					newTab.focus()
				})
			}

		
			//append a new test in the dom
			function newTestAppend(parentNode, test, id){
				const addBtn = document.getElementById("btnConfirmTest")
				addBtn.disabled = true
				document.getElementById("btnConfirmTest").className = "btnActionFullAlt deButtoned"


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
		
			//system for the action buttons for creation of the tests (related to #newTestInput)
			function actionBtnInit() {
				document.getElementById("btnActionClick").addEventListener("click", () => {
					testInput.action = "Click"
				})
				document.getElementById("btnActionFill").addEventListener("click", () => {
					testInput.action = "Fill"
				})
				document.getElementById("btnActionObserve").addEventListener("click", () => {
					testInput.action = "Look"
				})
			}

			function paramsBtnInit() {
				console.log("paramsBtnInit")
				document.getElementById("btnParamType").addEventListener("click", () => {
					console.log("btnParamType clicked")
					testInput.params = {
						name: "Type",
						value: document.getElementById("inputTypeParam").value
					}
					console.log(_testInput)
				})
			}

			//init for the button to add new tests
			function addNewTestBtnInit(){
				document.getElementById("btnConfirmTest").addEventListener("click", () => {

				// if(document.getElementById("inputTypeParam").value != null)
				// 	testInput.params.value = document.getElementById("inputTypeParam").value
					
				testsQueue.push(structuredClone(_testInput))
				newTestAppend(document.getElementById("testList"), structuredClone(_testInput), testsQueue.length - 1)
				testInput.action = null
				testInput.element = {
					"selector": null,
					"path": null,
				}
				testInput.params = {
					"name": null,
					"value": null
				}
				document.getElementById("inputTypeParam").value = null
				console.log(testsQueue)
				})
				document.getElementById("btnConfirmTest").disabled = true
				document.getElementById("btnConfirmTest").className = "btnActionFullAlt deButtoned"
			}

			//initialize the Element button
			function elementPickerInit(){
				const elementBtn = document.getElementById("elementPickerBtn")

				elementBtn.addEventListener("click", (e) => {
					saintPickerInit(pageDocument, menuIframe)
				})

				elementBtn.addEventListener("elemInspector", (e) => {
					testInput.element = {
						"selector": getCSSSelector(e.detail),
						"path": getCSSPath(e.detail)
					}
					console.log(getCSSPath(e.detail))
				})

			}
		
			//initialize the animation of the drawer with id #data-dropdown
			function drawerSystemInit() {
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
		}
	}
}

function saintPickerInit(document, menuIframe){
	
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
		menuIframe.contentDocument.body
		.querySelector("#elementPickerBtn").dispatchEvent(new CustomEvent("elemInspector", {detail: elem}))
	})
	
	function clearHighlight() {
		document.querySelectorAll(".saintHover").forEach(e => {
			e.classList.remove("saintHover")
		})
	}
}