console.log('testMenu launched')

let contain = document.createElement('div')

let blurDrop = document.createElement('iframe')
//blurDrop.src = '/home/earnaud/Work/freelinette/extension/testMenu/injectedMenu/injectedMenu.html'
blurDrop.frameBorder = 0
blurDrop.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'
blurDrop.id = 'blurDrop'


contain.style.zIndex = '420'
contain.style.position = 'absolute'
contain.style.top = '40%'
contain.style.left = '20%'
contain.id = 'menu_contain'

contain.appendChild(blurDrop)
document.body.append(contain)

let lol = document.getElementById('blurDrop').contentDocument.createElement('div')
document.getElementById('blurDrop').contentDocument.getElementsByTagName('head')[0].appendChild(lol)


//console.log(document.getElementById('blurDrop'))
//let blur = document.getElementById('blurDrop').contentDocument
//let mdr = blur.createElement('div')
//mdr.id = 'glassMenu'
//let head = blur.getElementsByTagName('head')[0]
//let body = blur.getElementsByTagName('body')[0]

//head.appendChild(mdr)


// blurDrop.contentWindow.document.getElementsByClassName('html').innerHTML = '\
// <head>\
//     <meta charset="utf-8">\
// 	<style>\
// 	.glass\
// 	{\
// 		position: absolute;\
// 		top: 0;\
// 		left: 0;\
// 		width: 100%;\
// 		height: 100%;\
// 		/* box-shadow: 0 25px 40px rgba(0, 0, 0, 0.8); */\
// 		background: transparent;\
// 		backdrop-filter: blur(10px);\
// 		transition: 0.2s;\
// 		cursor: move;\
// 	}\
// </style>\
// </head>\
// <body>\
// 	<h1>pouet</h1>\
// 	<div id="glassMenu" class="glass"/>\
// </body>'


//dragElement(blurDrop);

//document.getElementById('blurDrop').contentWindow.postMessage('testing', '*')
//var iframe = document.getElementById('blurDrop');

//let contentWindow = iframe.contentWindow //this is better approach
//console.log(contentWindow.document.body.getElementsByTagName('div'))

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	console.log('drag element')
	//elmnt.contentWindow.document.getElementById("glassMenu").onmousedown = dragMouseDown
	//elmnt.onmousedown = dragMouseDown;

	function dragMouseDown(e) {
		console.log('element clicked')
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		console.log('element dragged')
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}


	function closeDragElement() {
		console.log('mouse out')
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
