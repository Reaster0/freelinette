
console.log('testMenu launched')

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

let contain = document.createElement('div')

let menuIframe = document.createElement('iframe')
//menuIframe.src = '/home/earnaud/Work/freelinette/extension/testMenu/injectedMenu/injectedMenu.html'
menuIframe.frameBorder = 0
menuIframe.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'
menuIframe.style.borderRadius = '10px'
menuIframe.style.height = '600px'
menuIframe.style.width = '400px'
menuIframe.id = 'menuIframe'


contain.style.zIndex = '2147483647'
contain.style.position = 'absolute'
contain.style.top = '40%'
contain.style.left = '20%'
contain.id = 'menu_contain'

contain.appendChild(menuIframe)
document.body.append(contain)


menuIframe.onload = function () {
	initialiseTestMenu(contain, menuIframe)

}

function initialiseTestMenu(contain, menuIframe)
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
			}
		})
	
		drawerSystemInit()
		actionBtnInit()
		ElementPickerInit()
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
		function ElementPickerInit(){
			const elementBtn = document.getElementById("elementPickerBtn")
			console.log("element picker init", elementBtn)

			elementBtn.addEventListener("click", (e) => {
				saintPickerInit()
				console.log("element picker")
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


	function dragElement(elmnt) {
		let menuPosBackup = {x: 0, y: 0}
		let initialMousePos = {x: 0, y: 0}
		let menu = elmnt.getElementsByTagName('iframe')[0].contentDocument.getElementById('glassMenu')

		menu.addEventListener("mousedown", ({pageX, pageY}) => {
			menu.style.cursor = "move"
			let style = window.getComputedStyle(elmnt)
			initialMousePos.x = pageX + parseInt(style.left)
			initialMousePos.y = pageY + parseInt(style.top)
			menuPosBackup.x = parseInt(window.getComputedStyle(elmnt).left)
			menuPosBackup.y = parseInt(window.getComputedStyle(elmnt).top)
			menu.addEventListener("mousemove", onDrag)
		})
		menu.addEventListener("mouseup", () => {
			menu.style.cursor = ''
			menu.removeEventListener("mousemove", onDrag)
		})
		menu.addEventListener("mouseleave", () => {
			menu.style.cursor = ''
			menu.removeEventListener("mousemove", onDrag)
		})

		function onDrag({pageX, pageY}) {
			let style = window.getComputedStyle(elmnt)

			elmnt.style.left = pageX + parseInt(style.left) - initialMousePos.x + menuPosBackup.x + 'px'
			elmnt.style.top = pageY + parseInt(style.top) - initialMousePos.y + menuPosBackup.y + 'px'
		}
	}
}

function saintPickerInit(){
	
	const saintPicker = document.createElement("div")
	saintPicker.className = "saintPickerOverlay"
	
	document.querySelector("body").appendChild(saintPicker)
	
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
		menuIframe.contentDocument.getElementsByTagName('body')[0]
		.querySelector("#elementPickerBtn").dispatchEvent(new CustomEvent("elemInspector", {detail: elem}))
	})

	function clearHighlight() {
		document.querySelectorAll(".saintHover").forEach(e => {
			e.classList.remove("saintHover")
		})
	}
}

function getCSSPath(el) {
	let path = []

	while (el.nodeType === Node.ELEMENT_NODE) {

		// V1
		//let selector = el.nodeName.toLowerCase()
		// if (el.id) {
		// 	selector += '#' + el.id
		// 	path.unshift(selector)
		// 	break
		// } else {
		// 	let sib = el, nth = 1
		// 	while (sib = sib.previousElementSibling) {
		// 		if (sib.nodeName.toLowerCase() == selector)
		// 			nth++
		// 	}
		// 	if (nth != 1)
		// 		selector += ":nth-of-type("+nth+")"
		// }
		// path.unshift(selector)
		// el = el.parentNode

		//V2
		const selector = getCSSSelector(el)
		path.unshift(selector)
		el = el.parentNode
	}
	return path.join(" > ")
}

//get the css selector of an element with it's classes and id
function getCSSSelector(el) {
	let selector = ""
	if (el.id) {
		selector += "#" + el.id
	} else {
		let classes = el.className.split(" ")
		classes.forEach(c => {
			if (c != "")
				selector += "." + c
		})
		selector = el.nodeName.toLowerCase() + selector
		let sib = el, nth = 1
		while (sib = sib.previousElementSibling) {
			if (sib.nodeName.toLowerCase() == selector)
				nth++
		}
		if (nth != 1)
			selector += ":nth-of-type("+nth+")"
	}
	return selector
}