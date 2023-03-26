const textarea = document.getElementById("textarea") as HTMLTextAreaElement;
const takeButton = document.getElementById("takeButton") as HTMLButtonElement;
const resultField = document.getElementById("resultField") as HTMLInputElement;

const inlineCheckbox1 = document.getElementById("inlineCheckbox1") as HTMLInputElement;
const inlineCheckbox2 = document.getElementById("inlineCheckbox2") as HTMLInputElement;

const text = localStorage.getItem("text");
if (text != null) {
  textarea.value = text;
}

const checkboxes = localStorage.getItem("checkboxes");
if (checkboxes != null) {
  const checkeds = JSON.parse(checkboxes) as {checkbox1: boolean, checkbox2: boolean};
  inlineCheckbox1.checked = checkeds.checkbox1;
  inlineCheckbox2.checked = checkeds.checkbox2;
}

function populateStorage() {
  localStorage.setItem("text", textarea.value);
  localStorage.setItem("checkboxes", JSON.stringify({checkbox1: inlineCheckbox1.checked, checkbox2: inlineCheckbox2.checked}))
  console.log(localStorage.getItem("text"));
}

function result() {
  let things = textarea.value.trim().split("\n").map((s) => s.trim()).filter((s) => s.length > 0);;
  if (inlineCheckbox1.checked) {
      things = things.join(" ").split(/\s+/).map((s) => s.trim()).filter((s) => s.length > 0);
  }
  if (inlineCheckbox2.checked) {
      if (inlineCheckbox1.checked) {
        things = textarea.value.split(/(\s+|,)/).map((s) => s.trim()).filter((s) => s.length > 0);
      } else {
        things = textarea.value.split(",").map((s) => s.trim()).filter((s) => s.length > 0);
      }
  }
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
    if (ev.shiftKey) {
      result();
      return false;
    }
  }
}
