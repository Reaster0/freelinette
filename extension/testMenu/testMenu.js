console.log('testMenu launched')

//document.body.textContent = "";

let testMenu = document.createElement('div')
testMenu.innerHTML = "\
<link rel='stylesheet' href='/home/earnaud/Work/freelinette/extension/popup/style.css'/>\
<mdr id='menu_injector' class='button_slick Spotnik'>\
inject the menu\
</mdr>\
<div id='toggle_highlight' class='button_slick Spotnik'>\
toggle highlight\
</div>"

let contain = document.createElement('div')

let blurDrop = document.createElement('iframe')
blurDrop.src = '/home/earnaud/Work/freelinette/extension/testMenu/injectedMenu/injectedMenu.html'
blurDrop.frameBorder = 0
blurDrop.style.boxShadow = '0 25px 40px rgba(0, 0, 0, 0.8)'


contain.style.zIndex = '420'
contain.style.position = 'fixed'
contain.style.top = '200px'
contain.style.left = '200px'


contain.appendChild(blurDrop)

document.body.append(contain)
