export function dragElement(elmnt) {
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

export function getCSSPath(el) {
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
export function getCSSSelector(el) {
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