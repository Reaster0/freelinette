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



let redMenu = document.createElement('div')
redMenu.innerHTML = '\
<link rel="stylesheet" href="/home/earnaud/Work/freelinette/extension/testMenu/testMenu.css"/>\
<div class="FABMenu">\
  <input type="checkbox" checked/>\
  <div class="hamburger">\
    <div class="dots">\
      <span class="first"></span>\
      <span class="second"></span>\
      <span class="third"></span>\
    </div>\
  </div>\
  <div class="action_items_bar">\
    <div class="action_items">\
      <span class="first_item">\
        <i class="material-icons">\
        favorite\
        </i>\
      </span>\
      <span class="second_item">\
        <i class="material-icons">\
        chat\
        </i>\
      </span>\
      <span class="third_item">\
        <i class="material-icons">\
        get_app\
        </i>\
      </span>\
      <span class="fourth_item">\
        <i class="material-icons">\
        share\
        </i>\
      </span>\
    </div>\
  </div>\
</div>'

document.body.append(redMenu)
