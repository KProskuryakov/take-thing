const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
const takeButton = document.getElementById("takeButton") as HTMLButtonElement;
const resultField = document.getElementById("resultField") as HTMLInputElement;

const lineBox = document.getElementById("inlineCheckbox1") as HTMLInputElement;
const inlineBox = document.getElementById("inlineCheckbox2") as HTMLInputElement;
const commaBox = document.getElementById("inlineCheckbox3") as HTMLInputElement;

const text = localStorage.getItem("text");
if (text != null) {
  textarea.value = text;
}

const checkboxes = localStorage.getItem("checkboxes");
if (checkboxes != null) {
  const checkeds = JSON.parse(checkboxes) as {lineBoxChecked: boolean, inlineBoxChecked: boolean, commaBoxChecked: boolean};
  lineBox.checked = checkeds.lineBoxChecked;
  inlineBox.checked = checkeds.inlineBoxChecked;
  commaBox.checked = checkeds.commaBoxChecked;
}

function populateStorage() {
  localStorage.setItem("text", textarea.value);
  localStorage.setItem("checkboxes", JSON.stringify({lineBoxChecked: lineBox.checked, inlineBoxChecked: inlineBox.checked, commaBoxChecked: commaBox.checked}))
}

function flatMap<T>(a: Array<T>, func: (v: T) => T[]) {
  return new Array<T>().concat(...a.map(func));
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
  let things = [textarea.value.trim()];
  if (lineBox.checked) {
    things = flatMap(things, (v) => v.split("\n").map(s => s.trim()));
  } else {
    things = things.map(v => replaceAllChars(v, "\n", " "));
  }
  if (inlineBox.checked) {
      if (commaBox.checked) {
        things = flatMap(things, (v) => [replaceAllChars(v, ",", " ").trim()]);
      }
      things = flatMap(things, (v) => v.split(/\s+/).map(s => s.trim()));
  } else if (commaBox.checked) {
    things = flatMap(things, (v) => v.split(",").map(s => s.trim()));
  }
  things = things.filter((s) => s.length > 0);
  if (things.length === 0) {
      resultField.value = "Nothing to take from";
      return true;
  }
  resultField.value = things.filter((s) => s.trim().length > 0)[Math.floor(Math.random() * things.length)];
  populateStorage();
}

takeButton.onclick = result

textarea.onkeydown = (ev) => {
  if (ev.key == "Enter") {
    if (ev.shiftKey || ev.ctrlKey) {
      result();
      return false;
    }
  }
}
