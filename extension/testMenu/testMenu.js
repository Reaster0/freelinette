
console.log('testMenu launched')

let contain = document.createElement('div')

let menuIframe = document.createElement('iframe')
//menuIframe.src = '/home/earnaud/Work/freelinette/extension/testMenu/injectedMenu/injectedMenu.html'
menuIframe.frameBorder = 0
menuIframe.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'
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
	var dragValue
	console.log('drag element')
	console.log(elmnt.getElementsByTagName('iframe')[0])
	let iframe = elmnt.getElementsByTagName('iframe')[0]
	let menu = iframe.contentDocument.getElementById("glassMenu")
	console.log('lol')

	menu.addEventListener("mousedown", () => {
		menu.style.cursor = "move"
		menu.addEventListener("mousemove", onDrag)
	})
	menu.addEventListener("mouseup", () => {
		menu.style.cursor = ''
		menu.removeEventListener("mousemove", onDrag)
	})

	function onDrag({movementX, movementY}){
		let getStyle = window.getComputedStyle(elmnt)
		let left = parseInt(getStyle.left)
		let top = parseInt(getStyle.top)

		//console.log(left, top)
		elmnt.style.left = left + movementX + 'px'
		elmnt.style.top = top + movementY + 'px'
		//console.log(elmnt.style.left, elmnt.style.top)
		console.log(e)
	}


	

}
}
