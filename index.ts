const things = document.getElementById("things-to-take-from") as HTMLDivElement;
const takeButton = document.getElementById("takeButton") as HTMLButtonElement;

const sectionBox = document.getElementById("inlineCheckbox0") as HTMLInputElement;
const lineBox = document.getElementById("inlineCheckbox1") as HTMLInputElement;
const inlineBox = document.getElementById("inlineCheckbox2") as HTMLInputElement;
const commaBox = document.getElementById("inlineCheckbox3") as HTMLInputElement;

let selectedIndex: number | undefined = undefined;

const storedText = localStorage.getItem("text");
let text: string[] = [];
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
  const checkeds = JSON.parse(checkboxes) as {lineBoxChecked: boolean, inlineBoxChecked: boolean, commaBoxChecked: boolean};
  lineBox.checked = checkeds.lineBoxChecked;
  inlineBox.checked = checkeds.inlineBoxChecked;
  commaBox.checked = checkeds.commaBoxChecked;
}

function populateStorage() {
  const childText = getThingsAsText();
  const mergedText = childText.join("\n");
  localStorage.setItem("text", mergedText);
  localStorage.setItem("checkboxes", JSON.stringify({lineBoxChecked: lineBox.checked, inlineBoxChecked: inlineBox.checked, commaBoxChecked: commaBox.checked}));
  localStorage.setItem("selectedIndex", JSON.stringify(selectedIndex));
}

function getThingsAsText() {
  const childs = Array.from(things.children);
  const childText = flatMap(childs, (c) => oneOrEmpty(c.textContent?.trim()));
  return childText;
}

function applyTextToThings(text: string[]) {

}

function flatMap<I, T>(a: Array<I>, func: (v: I) => T[]) {
  return new Array<T>().concat(...a.map(func));
}

function oneOrEmpty<T>(input: T | null | undefined): Array<T> {
  if (input === null || input === undefined) {
    return [];
  } else {
    return [input];
  }
}

function replaceAllChars(s: string, c: string, r: string) {
  let newStr = "";
  for (let i = 0; i < s.length; i++) {
    if (s.charAt(i) === c) {
      newStr += r;
    } else {
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

  const pickedLine = lines[pickedIndex] as HTMLDivElement;
  pickedLine.classList.add("taken");
  populateStorage();
}

takeButton.onclick = result

things.onkeydown = (ev) => {
  if (ev.key == "Enter") {
    if (ev.shiftKey || ev.ctrlKey) {
      result();
      return false;
    }
  }
}
