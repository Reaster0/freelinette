import ElementPicker from "html-element-picker";

/**
 * DOM like style when element is hovered
 */
const firstPicker = new ElementPicker({
    action: {
        trigger: "mouseover",
        callback: (function (target) {
            target.classList.toggle("highlight");
        }),
    }
});

/**
 * Add element to test
 */
const secondPicker = new ElementPicker({
    action: {
        trigger: "click",
        callback: (function (target) {
            console.log(target);
        }),
    }
});