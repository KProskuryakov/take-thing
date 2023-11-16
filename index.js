"use strict";
const things = document.getElementById("things-to-take-from");
const takeButton = document.getElementById("takeButton");
const sectionBox = document.getElementById("inlineCheckbox0");
const lineBox = document.getElementById("inlineCheckbox1");
const inlineBox = document.getElementById("inlineCheckbox2");
const commaBox = document.getElementById("inlineCheckbox3");
let selectedIndex = undefined;
const storedText = localStorage.getItem("text");
let text = [];
if (storedText !== null) {
    text = storedText.split("\n");
    for (let line of text) {
        const newDiv = document.createElement("div");
        newDiv.innerText = line;
        things.appendChild(newDiv);
    }
}
const checkboxes = localStorage.getItem("checkboxes");
if (checkboxes !== null) {
    const checkeds = JSON.parse(checkboxes);
    lineBox.checked = checkeds.lineBoxChecked;
    inlineBox.checked = checkeds.inlineBoxChecked;
    commaBox.checked = checkeds.commaBoxChecked;
}
function populateStorage() {
    const childText = getThingsAsText();
    const mergedText = childText.join("\n");
    localStorage.setItem("text", mergedText);
    localStorage.setItem("checkboxes", JSON.stringify({ lineBoxChecked: lineBox.checked, inlineBoxChecked: inlineBox.checked, commaBoxChecked: commaBox.checked }));
    localStorage.setItem("selectedIndex", JSON.stringify(selectedIndex));
}
function getThingsAsText() {
    const childs = Array.from(things.children);
    const childText = flatMap(childs, (c) => { var _a; return oneOrEmpty((_a = c.textContent) === null || _a === void 0 ? void 0 : _a.trim()); });
    return childText;
}
function applyTextToThings(text) {
}
function flatMap(a, func) {
    return new Array().concat(...a.map(func));
}
function oneOrEmpty(input) {
    if (input === null || input === undefined) {
        return [];
    }
    else {
        return [input];
    }
}
function replaceAllChars(s, c, r) {
    let newStr = "";
    for (let i = 0; i < s.length; i++) {
        if (s.charAt(i) === c) {
            newStr += r;
        }
        else {
            newStr += s.charAt(i);
        }
    }
    return newStr;
}
function result() {
    const textThings = getThingsAsText();
    const pickedIndex = Math.floor(Math.random() * textThings.length);
    const lines = Array.from(things.children);
    lines.forEach((e) => e.classList.remove("taken"));
    console.log(pickedIndex);
    const pickedLine = lines[pickedIndex];
    pickedLine.classList.add("taken");
    populateStorage();
}
takeButton.onclick = result;
things.onkeydown = (ev) => {
    if (ev.key == "Enter") {
        if (ev.shiftKey || ev.ctrlKey) {
            result();
            return false;
        }
    }
};
