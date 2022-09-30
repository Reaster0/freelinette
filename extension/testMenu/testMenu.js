import {injectHtml} from './interface/html.js'

console.log('testMenu launched')
console.log("readyState = ", document.readyState)
console.log("body = ", document.body.innerHTML)
document.addEventListener('DOMContentLoaded', function() {
	console.log('DOMContentLoaded')
	injectHtml(document)
})
if (document.body.innerHTML){
	console.log("huhu body")
	injectHtml(document)
}