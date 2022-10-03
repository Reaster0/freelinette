import { dragElement, sendToBackground } from "../utils.js"
import {syncDisplayTest, replaceIframeWindowInit, saveBtnInit, exitBtnInit, drawerSystemInit, toggleShowParams, actionBtnInit, paramsBtnInit, exportJSONBtnInit, addNewTestBtnInit, elementPickerInit, multiPageInit } from "./initItem.js"
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
	contain.style.top = '0'
	contain.style.left = '0'
	contain.id = 'menu_contain'

	contain.appendChild(menuIframe)
	document.body.append(contain)

	menuIframe.onload = function () {
		initialiseTestMenu(contain, menuIframe, document)
	}

	async function initialiseTestMenu(contain, menuIframe, pageDocument)
	{
		menuIframe.contentDocument.head.innerHTML = `<meta charset="utf-8">`
		menuIframe.contentDocument.body.innerHTML = htmlPage
		const stylesheet = menuIframe.contentDocument.createElement('style')
		stylesheet.innerHTML = cssPage
		menuIframe.contentDocument.head.appendChild(stylesheet)
		
		dragElement(contain);
		await innerPageScript(menuIframe.contentDocument)


		async function innerPageScript(document){
			let _testInput = {
				"action": null,
				"element": {
					"selector": null,
					"path": null,
				},
				"params": {
					"name": null,
					"value": null,
					"valueExtend": null
				}
			}
		
			let testsQueue = []
			let currentTest = {
				"name": crypto.randomUUID(),
				"website": location.toString(),
				"tests": testsQueue
			}
		
			//menu to create tests
			let testInput = new Proxy(_testInput, {
				set: function (target, key, value) {
					if (key === "action"){
						if (value === null)
							document.getElementById("action-dropdown-button").innerHTML = "Action"
						else
							document.getElementById("action-dropdown-button").innerHTML = value
						}
						console.log("action set")
					if (key === "element") {
						if (value.selector === null)
							document.getElementById("elementPickerBtn").innerHTML = "Element"
						else
							document.getElementById("elementPickerBtn").innerHTML = value.selector
					}
					target[key] = value

					if (target.action != null && target.element.selector != null){
						document.getElementById("btnConfirmTest").disabled = false
						document.getElementById("params-dropdown-button").disabled = false
						document.getElementById("params-dropdown-button").classList.remove("deButtoned")
						document.getElementById("btnConfirmTest").className = "btnActionFullAlt"
						target.params = {
							name: null,
							value: null,
							valueExtend: null,
						}
						toggleShowParams(target.action, menuIframe.contentDocument)
					}
					return Reflect.set(target, key, value)
				}
			})

			drawerSystemInit(document)
			actionBtnInit(testInput, document)
			paramsBtnInit(document, pageDocument, testInput)
			elementPickerInit(document, testInput, pageDocument)
			addNewTestBtnInit(document, testsQueue, testInput, _testInput, currentTest)
			exportJSONBtnInit(document, currentTest)
			exitBtnInit(document, window)
			saveBtnInit(document, currentTest)
			await multiPageInit(document, pageDocument, currentTest, window)
		}
	}
}