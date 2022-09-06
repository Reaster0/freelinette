import { dragElement, getCSSPath, getCSSSelector } from "../utils.js"

export function injectHtml(document){

	const injectStyle = document.createElement('style')
	injectStyle.innerHTML = '\
		.saintHover {\
			outline: deeppink dashed 2px !important;\
		}\
		.saintPickerOverlay{\
			position: fixed;\
			top: 0;\
			left: 0;\
			width: 100%;\
			height: 100%;\
			z-index: 2147483646;\
			cursor: pointer;\
		}'
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
		let head = menuIframe.contentDocument.getElementsByTagName('head')[0]
		let body = menuIframe.contentDocument.getElementsByTagName('body')[0]
		
		head.innerHTML = '\
		<meta charset="utf-8">\
		<link rel="stylesheet" href="./extension/testMenu/testMenu.css"\
		<style>\
		</style>'
		body.innerHTML = '\
		<body>\
			<div id="glassMenu" class="glass">\
				<div class="menuBackground">\
					<div id="testInterface">\
						<div id="newTestInput" class="newTestInput">\
							<div id="data-dropdown" class="dropDown">\
								<button id="action-dropdown-button" class="btnActionFull">Action</button>\
								<div class="dropDownMenu">\
									<button id="btnActionClick" class="btnActionEmptyAlt">Click</butt>\
									<button id="btnActionFill" class="btnActionEmptyAlt">Fill</butt>\
									<button id="btnActionObserve" class="btnActionEmptyAlt">Look</button>\
								</div>\
							</div>\
							<button id="elementPickerBtn" style="overflow-x: hidden;" class="btnActionEmpty">Element</button>\
							<button class="btnActionEmptyAlt">Params</button>\
						</div>\
						<button id="btnConfirmTest" class="btnActionFullAlt deButtoned">+</button>\
						<div id="testList"></div>\
					</div>\
				</div>\
			</div>\
		</body>'

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
					console.log("has changed")
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
					target[key] = value

					if (target.action != null && target.element.selector != null){
						document.getElementById("btnConfirmTest").disabled = false
						document.getElementById("btnConfirmTest").className = "btnActionFullAlt"
					}
					return Reflect.set(target, key, value)
				}
			})
		
			drawerSystemInit()
			actionBtnInit()
			elementPickerInit()
			addNewTestBtnInit()

		
			//append a new test in the dom
			function newTestAppend(parentNode, test, id){
				const addBtn = document.getElementById("btnConfirmTest")
				addBtn.disabled = true
				document.getElementById("btnConfirmTest").className = "btnActionFullAlt deButtoned"


				const testElement = document.createElement("div")
				testElement.className = "newTestInput"
				testElement.attributes.number = id
		
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
				//todo
				paramsBtn.innerHTML = "Params"
		
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
				document.getElementById("btnActionClick").addEventListener("click", (e) => {
					testInput.action = "Click"
				})
				document.getElementById("btnActionFill").addEventListener("click", (e) => {
					testInput.action = "Fill"
				})
				document.getElementById("btnActionObserve").addEventListener("click", (e) => {
					testInput.action = "Look"
				})
			}

			//init for the button to add new tests
			function addNewTestBtnInit(){
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
						"value": null}
					console.log(testsQueue)
				})
				document.getElementById("btnConfirmTest").disabled = true
				document.getElementById("btnConfirmTest").className = "btnActionFullAlt deButtoned"
			}

			//initialize the Element button
			function elementPickerInit(){
				const elementBtn = document.getElementById("elementPickerBtn")
				console.log("element picker init", elementBtn)

				elementBtn.addEventListener("click", (e) => {
					saintPickerInit(pageDocument, menuIframe)
					console.log("element picker")
				})

				elementBtn.addEventListener("elemInspector", (e) => {
					testInput.element = {
						"selector": getCSSSelector(e.detail),
						"path": getCSSPath(e.detail)
					}
					console.log("element picker event")
					console.log(getCSSPath(e.detail))
				})

			}
		
			//initialize the animation of the drawer with id #data-dropdown
			function drawerSystemInit() {
				document.addEventListener('click', e => {
					const isDropdownButton = e.target.matches('#action-dropdown-button')
					if (!isDropdownButton && e.target.closest("#data-dropdown") != null && !e.target.matches("button"))
						return
					
					let currentDropdown
					if (isDropdownButton) {
						currentDropdown = e.target.closest('#data-dropdown')
						currentDropdown.classList.toggle('active')
					}
					
					document.querySelectorAll("#data-dropdown.active").forEach(dropdown => {
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
	console.log('saintpicker init')
	console.log(document.body)
	
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
		console.log('saintPickermove')
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