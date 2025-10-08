//in some length from 1 array genertaor
function generateArray(length) {
  let array = [];
  for (let i = 1; i <= length; i++) {
    array.push(i);
  }
  return array;
}
//just selctors and variables
const hangmanContainer = document.getElementById("hangman-container");
const home = document.getElementById("home");
const inputContainer = document.getElementById("input-container");
const keyboard = document.getElementById("keyboard");
const resultContainer = document.getElementById("result-container");
const dialog = document.getElementById("load-msg");
let word;
let tried = 0;
let gameWon = false;
let gameStarted = false;
let idsArray = [
  "line3",
  "face",
  "neck",
  "left-hand",
  "right-hand",
  "body",
  "left-leg",
  "right-leg",
];
addKeyboardElems();
function addInputs(word) {
  inputContainer.innerHTML = "";
  for (let i = 1; i <= word.length; i++) {
    inputContainer.innerHTML += `<input type="text" readonly id="input-${i}" class="input">`;
  }
}
function addKeyboardElems() {
  keyboard.innerHTML = "";
  let letters = "qwertyuiopasdfghjklzxcvbnm".toUpperCase().split("");
  for (let i = 0; i < letters.length; i++) {
    // if (i === 10) {
    //   keyboard.innerHTML += `<br>`;
    // }
    keyboard.innerHTML += `<button type="button" onclick="addLetter(this)" class="keyboard-elem">${letters[i]}</button>`;
  }
  keyboard.innerHTML += `<button type="button" onclick="deleteLetter()">Del</button>
    <button type="button" onclick="checkWord()" id="check-key">Check</button>`;
}

let counter = 0;
let forKeyboardNums;
//addign letters and delteing using the physical keyboard and onscreen keyboard 
function addLetter(elem) {
  if (counter < forKeyboardNums.length - 1) {
    document.getElementById(`input-${forKeyboardNums[counter]}`).value =
      elem.textContent;
    counter++;
  } else {
    counter = forKeyboardNums.length - 1;
    document.getElementById(`input-${forKeyboardNums[counter]}`).value =
      elem.textContent;
  }
}
function deleteLetter() {
  if (counter <= 0) {
    return;
  }
  if (
    document.getElementById(`input-${forKeyboardNums[counter]}`).value === ""
  ) {
    counter--;
    document.getElementById(`input-${forKeyboardNums[counter]}`).value = "";
  } else {
    document.getElementById(`input-${forKeyboardNums[counter]}`).value = "";
  }
}
document.addEventListener("keypress", function (e) {
  let letters = "qwertyuiopasdfghjklzxcvbnm";
  if (!letters.includes(e.key)) return;
  if (gameStarted === false) return;
  if (counter < forKeyboardNums.length - 1) {
    document.getElementById(`input-${forKeyboardNums[counter]}`).value =
      e.key.toUpperCase();
    counter++;
  } else {
    counter = forKeyboardNums.length - 1;
    document.getElementById(`input-${forKeyboardNums[counter]}`).value =
      e.key.toUpperCase();
  }
});
document.addEventListener("keydown", function (e) {
  if (gameStarted === false) return;
  if (e.key === "Backspace") {
    deleteLetter();
  } else if (e.key === "Enter") {
    checkWord();
  }
});
//reseting the hangmun figure to origninal state
idsArray.forEach((el) => {
  document.getElementById(el).style.height = "0";
  document.getElementById(el).style.opacity = "0";
});
//pixels that each hangman part have
let pixels = [50, 70, 20, 45, 45, 60, 50, 50];
function checkWord() {
  tried++;
  let wordSplitted = word.split("").map((el) => el.toUpperCase());
  let inputs = [...document.querySelectorAll(".input")];
  let inputsValues = [...document.querySelectorAll(".input")].map(
    (el) => el.value
  );
  for (let i = 0; i < word.length; i++) {
    if (inputsValues[i] === wordSplitted[i]) {
      //if the word is the correct place
      inputs[i].style.backgroundColor = "var(--accent)";
      inputs[i].style.borderColor = "var(--accent)";
      inputs[i].style.color = "white";
      let current = forKeyboardNums.findIndex(
        (el) => `input-${el}` === `input-${i + 1}`
      );
      if (current !== -1) forKeyboardNums.splice(current, 1);
      inputs[i].id = "";
    } else {
  //    let btn = [...document.querySelectorAll(".keyboard-elem")].find(el=>el.textContent===inputs[i].value);
  // btn.setAttribute("disabled",true)
      inputs[i].value = "";
    }
  }
  counter = 0;
  if (inputsValues.join("") === wordSplitted.join("")) {
    gameWon = true;
    let delay = 0;
    inputs.forEach((el) => {
      el.style.animation = `scaleUp .3s ease ${delay}s`;
      delay += 0.2;
    });
    setTimeout(function () {
      resultMessage(gameWon);
    }, 1500);
  } else {
    document.getElementById(`${idsArray[tried - 1]}`).style.opacity = `1`;
    document.getElementById(`${idsArray[tried - 1]}`).style.height = `${
      pixels[tried - 1]
    }px`;
  }
  if (tried >= 8 && gameWon === false) {
    idsArray.forEach((el) => {
      document.getElementById(el).style.borderColor = "var(--blood)";
      document.getElementById(el).style.boxShadow = "0px 0px 200px var(--blood)";
    });
    setTimeout(function () {
      resultMessage(gameWon);
    }, 1000);
  }
}

async function playGame(elem) {
  try {
    elem.setAttribute("disabled",true)
   elem.innerHTML=`<p id="load" style="text-transform:lowercase;font-size:.9rem;">Loading</p>`
    for(let i=0;;i++){
 let response = await fetch(
      "https://random-word-api.vercel.app/api?words=1"
    );
    let data = await response.json();
    word = data[0];
    if(word.length<7) break;
    }
    counter = 0;
    elem.style.display = "none";
    resultContainer.style.display="none"
  resultContainer.close();
    forKeyboardNums = generateArray(word.length);
    tried = 0;
    inputContainer.style.display = "flex";
    addInputs(word);
    gameStarted = true;
    gameWon = false;
    idsArray.forEach((el) => {
      document.getElementById(el).style.height = "0";
      document.getElementById(el).style.opacity = "0";
      document.getElementById(el).style.borderColor = "";
      document.getElementById(el).style.boxShadow = "";
    });
  } catch (err) {
    console.log(err,"cound't fetch");
    dialog.innerHTML = `Sorry a problem happened.
   <button type="button" onclick="playGame()">Try Again</button>
    <button type="button" onclick="this.parentElement.close()">Close</button>
   `;
  }
}
function resultMessage(won) {
  gameStarted = false;
  gameWon = false;
  resultContainer.style.display="flex"
  resultContainer.showModal();
  resultContainer.innerHTML = `<h1>${
    won === true ? "You Survived (:" : ":( You got hanged"
  }</h1> <h3>${
    won === true
      ? "Wonderful!!"
      : `The word was <strong>${word.toUpperCase()}</strong> `
  }</h3>
    <button type="button" id="playAgain" onclick="playGame(this)">Play Again</button>`;
}

function themeChange(elem) {
  document.body.classList.toggle("light");
   elem.querySelector("i").style.rotate="0deg"
   setTimeout(()=>{
elem.querySelector("i").style.rotate="360deg";
  elem.querySelector("i").classList.toggle("fa-sun");
   elem.querySelector("i").classList.toggle("fa-moon"); 
   },100)}