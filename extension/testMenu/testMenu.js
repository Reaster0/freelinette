
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
				<div class="listTests">\
					<div id="newTestInput" class="newTestInput">\
						<div class="dropDown" data-dropdown>\
							<button class="btnActionFull" data-dropdown-button>Action</button>\
							<div class="dropDownMenu">\
								<button id="btnActionClick" class="btnActionEmptyAlt">Click</butt>\
								<button id="btnActionFill" class="btnActionEmptyAlt">Fill</butt>\
								<button id="btnActionObserve" class="btnActionEmptyAlt">Observe</button>\
							</div>\
						</div>\
						<button class="btnActionEmpty">Element</button>\
						<button class="btnActionEmptyAlt">Params</button>\
					</div>\
					<button id="btnConfirmTest" class="btnActionFullAlt">Confirm</button>\
				</div>\
			</div>\
		</div>\
	</body>'


	dragElement(contain);
	innerPageScript(menuIframe.contentDocument)


	function innerPageScript(document){
		let testInput = {}

		drawerSystemInit()
		inputingForm()
		testConfigInput()
	
	
	
		function testConfigInput() {
			document.getElementById("btnConfirmTest").addEventListener("click", (e) => {
				console.log(testInput)
			})
			document.getElementById("btnActionClick").addEventListener("click", (e) => {
				testInput.action = "click"
			})
			document.getElementById("btnActionFill").addEventListener("click", (e) => {
				testInput.action = "fill"
			})
			document.getElementById("btnActionObserve").addEventListener("click", (e) => {
				testInput.action = "observe"
			})
		}
	
		function drawerSystemInit() {
			document.addEventListener('click', e => {
				const isDropdownButton = e.target.matches('[data-dropdown-button')
				if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return 
				
				let currentDropdown
				if (isDropdownButton) {
					currentDropdown = e.target.closest('[data-dropdown]')
					currentDropdown.classList.toggle('active')
				}
				
				document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
					if (dropdown !== currentDropdown)
					dropdown.classList.remove('active')
				})
			})
		}
	
		function inputingForm() {
			const inputForm = document.getElementById('testInput')
			document.getElementById('newTestInput').onsubmit = function(e) {
				e.preventDefault();
				const newTest = document.createElement('div');
				newTest.className = 'test';
	
				const infoTest = document.createElement('input');
				infoTest.className = 'text';
				infoTest.value = inputForm.value
	
				const deleteBtn = document.createElement('button');
				deleteBtn.className = 'buttonDelete';
				deleteBtn.innerHTML = 'Delete';
				deleteBtn.addEventListener('click', function(e) {
					console.log('deleteBtn clicked');
					document.getElementsByClassName('listTests')[0].removeChild(newTest)
				})
	
				document.getElementsByClassName('listTests')[0].appendChild(newTest);
				newTest.appendChild(infoTest)
				newTest.appendChild(deleteBtn)
				inputForm.value = ''
			}
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
