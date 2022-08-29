
console.log('testMenu launched')

let contain = document.createElement('div')

let menuIframe = document.createElement('iframe')
//menuIframe.src = '/home/earnaud/Work/freelinette/extension/testMenu/injectedMenu/injectedMenu.html'
menuIframe.frameBorder = 0
menuIframe.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'
menuIframe.style.borderRadius = '10px'
menuIframe.style.height = '300px'
menuIframe.style.width = '200px'
menuIframe.id = 'menuIframe'


contain.style.zIndex = '420'
contain.style.position = 'absolute'
contain.style.top = '40%'
contain.style.left = '20%'
contain.id = 'menu_contain'

contain.appendChild(menuIframe)
document.body.append(contain)

menuIframe.onload = function () {
	let lol = document.createElement('div')
	menuIframe.contentDocument.getElementsByTagName('head')[0].appendChild(lol)
	console.log(lol)

	let head = menuIframe.contentDocument.getElementsByTagName('head')[0]
	let body = menuIframe.contentDocument.getElementsByTagName('body')[0]

	head.innerHTML = '\
	<meta charset="utf-8">\
	<style>\
	.glass\
	{\
		position: absolute;\
		top: 0;\
		left: 0;\
		width: 100%;\
		height: 100%;\
		/* box-shadow: 0 25px 40px rgba(0, 0, 0, 0.8); */\
		background: transparent;\
		backdrop-filter: blur(10px);\
		transition: 0.2s;\
	}\
	</style>'
	body.innerHTML = '\
	<body>\
		<div id="glassMenu" class="glass"/>\
	</body>'


	dragElement(contain);


function dragElement(elmnt) {
	let menuPosBackup = {x: 0, y: 0}
	let initialMousePos = {x: 0, y: 0}
	console.log('drag element')
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

	function onDrag({pageX, pageY, offsetX, offsetY}) {
		let style = window.getComputedStyle(elmnt)

		elmnt.style.left = pageX + parseInt(style.left) - initialMousePos.x + menuPosBackup.x + 'px'
		elmnt.style.top = pageY + parseInt(style.top) - initialMousePos.y + menuPosBackup.y + 'px'
	}

}
}
