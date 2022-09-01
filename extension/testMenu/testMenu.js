
console.log('testMenu launched')

let contain = document.createElement('div')

let menuIframe = document.createElement('iframe')
//menuIframe.src = '/home/earnaud/Work/freelinette/extension/testMenu/injectedMenu/injectedMenu.html'
menuIframe.frameBorder = 0
menuIframe.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'
menuIframe.style.borderRadius = '10px'
menuIframe.style.height = '600px'
menuIframe.style.width = '400px'
menuIframe.id = 'menuIframe'


contain.style.zIndex = '4200000'
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
							<button id="data-dropdown-button" class="btnActionFull">Action</button>\
							<div class="dropDownMenu">\
								<button id="btnActionClick" class="btnActionEmptyAlt">Click</butt>\
								<button id="btnActionFill" class="btnActionEmptyAlt">Fill</butt>\
								<button id="btnActionObserve" class="btnActionEmptyAlt">Look</button>\
							</div>\
						</div>\
						<button class="btnActionEmpty">Element</button>\
						<button class="btnActionEmptyAlt">Params</button>\
					</div>\
					<button id="btnConfirmTest" class="btnActionFullAlt">+</button>\
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
			"element": null,
			"params": {}
		}
	
		let _testsQueue = []
	
		//menu to create tests
		let testInput = new Proxy(_testInput, {
			set: function (target, key, value) {
				console.log("has changed")
				if (key === "action"){
					if (value === null)
						document.getElementById("data-dropdown-button").innerHTML = "Action"
					else
						document.getElementById("data-dropdown-button").innerHTML = value
				}
				target[key] = value
			}
		})
	
		//queue of registered tests
		let testsQueue = new Proxy(_testsQueue, {
			set: function (target, key, value) {
				if (key == "length")
					return true
				console.log("testqueue has changed", key, value)
				target.push(value)
				const testList = document.getElementById("testList")
				newTestAppend(testList, value)
				return true
			}
		})
	
		drawerSystemInit()
		testConfigInput()
	
		
		function newTestAppend(parentNode, test){
			const testElement = document.createElement("div")
			testElement.className = "newTestInput"
	
			const actionBtn = document.createElement("button")
			actionBtn.className = "btnActionFull"
			if (test.action != null)
				actionBtn.innerHTML = test.action
			else
				actionBtn.innerHTML = "Action"
	
			const elementBtn = document.createElement("button")
			elementBtn.className = "btnActionEmpty"
			if (test.element != null)
				elementBtn.innerHTML = test.element
			else
				elementBtn.innerHTML = "Element"
	
			const paramsBtn = document.createElement("button")
			paramsBtn.className = "btnActionEmptyAlt"
			//todo
			paramsBtn.innerHTML = "Params"
	
			testElement.appendChild(actionBtn)
			testElement.appendChild(elementBtn)
			testElement.appendChild(paramsBtn)
			parentNode.appendChild(testElement)
	
		}
	
		//system for the buttons for creation of the tests (related to #newTestInput)
		function testConfigInput() {
			document.getElementById("btnConfirmTest").addEventListener("click", (e) => {
				console.log(_testInput)
				testsQueue.push(structuredClone(_testInput))
				testInput.action = null
				testInput.element = null
				testInput.params = {}
				console.log(_testsQueue)
			})
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
	
		//initialize the animation of the drawer with id #data-dropdown
		function drawerSystemInit() {
			document.addEventListener('click', e => {
				const isDropdownButton = e.target.matches('#data-dropdown-button')
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
