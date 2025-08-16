function generateArray(length){
            let array =[]
            for(let i=1;i<=length;i++){
                array.push(i)
            }
            return array;
        }
        const wordArray = [
  "hangman", "oxygen", "jungle", "wizard", "python",
  "galaxy", "rhythm", "puzzle", "voyage", "anchor",
  "dagger", "castle", "whisper", "shadow", "crystal",
  "phantom", "rocket", "goblin", "dragon", "helmet",
  "tundra", "sphinx", "cactus", "marble", "quartz",
  "pirate", "scroll", "dagger", "compass", "island"
]
const hangmanContainer=document.getElementById("hangman-container")
const home = document.getElementById("home")
const inputContainer = document.getElementById("input-container");
const keyboard = document.getElementById("keyboard")
const resultContainer=document.getElementById("result-container")
let word = wordArray[Math.floor(Math.random()*wordArray.length)]
function addInputs(word){
    inputContainer.innerHTML=""
    for(let i=1;i<=word.length;i++){
        inputContainer.innerHTML+=`<input type="text" readonly id="input-${i}" class="input">`
    }
}
function addKeyboardElems(){
    keyboard.innerHTML="";
    let letters = "qwertyuiopasdfghjklzxcvbnm".toUpperCase().split("");
    for(let i=0;i<letters.length;i++){
        if(i===10){
            keyboard.innerHTML+=`<br>`
        }
   keyboard.innerHTML+=`<button type="button" onclick="addLetter(this)">${letters[i]}</button>`
    }
    keyboard.innerHTML+=`<button type="button" onclick="deleteLetter()">Del</button>
    <button type="button" onclick="checkWord()" id="check-key">Check</button>`

}

let counter = 0 ;
let forKeyboardNums = generateArray(word.length)
function addLetter(elem){
    if(counter<forKeyboardNums.length-1){
        document.getElementById(`input-${forKeyboardNums[counter]}`).value=elem.textContent;
 counter++;
    }
    else{
        counter=forKeyboardNums.length-1
         document.getElementById(`input-${forKeyboardNums[counter]}`).value=elem.textContent;
    }
   
}
function deleteLetter(){
    if(counter<=0){
        return;
    }
        if(document.getElementById(`input-${forKeyboardNums[counter]}`).value===""){
            counter--;
            document.getElementById(`input-${forKeyboardNums[counter]}`).value="";
        }
        else{
 document.getElementById(`input-${forKeyboardNums[counter]}`).value="";
        }
    }
document.addEventListener("keypress",function(e){
    let letters = "qwertyuiopasdfghjklzxcvbnm";
    if(!letters.includes(e.key)) return;
    if(gameStarted===false) return;
    if(counter<forKeyboardNums.length-1){
        document.getElementById(`input-${forKeyboardNums[counter]}`).value=e.key.toUpperCase();
 counter++;
    }
    else{
        counter=forKeyboardNums.length-1
         document.getElementById(`input-${forKeyboardNums[counter]}`).value=e.key.toUpperCase();
    }
})
document.addEventListener("keydown",function(e){
    if(gameStarted===false) return;
    if(e.key==="Backspace"){
        deleteLetter()
    }
    else if(e.key==="Enter"){
     checkWord()
    }
})
let tried = 0 ;
let gameWon = false;
let gameStarted = false;
let idsArray = ["line3","face","neck","left-hand","right-hand","body","left-leg","right-leg"]
idsArray.forEach(el=>{document.getElementById(el).style.height="0"
    document.getElementById(el).style.opacity="0";
})
let pixels = [50,70,20,45,45,60,50,50]
function checkWord(){
    tried++;
    let wordSplitted = word.split("").map(el=>el.toUpperCase())
    let inputs = [...document.querySelectorAll(".input")]
    let inputsValues = [...document.querySelectorAll(".input")].map(el=>el.value);
    for(let i=0;i<word.length;i++){
       if(inputsValues[i]===wordSplitted[i]){
        inputs[i].style.backgroundColor="black";
         inputs[i].style.color="white";
        let current = forKeyboardNums.findIndex(el=>`input-${el}`===`input-${i+1}`)
       if(current!==-1) forKeyboardNums.splice(current,1);
         inputs[i].id='';
        
       } 
     else{
        inputs[i].value="";
     }
    }
    counter=0;
    if(inputsValues.join("")===wordSplitted.join("")){
        gameWon=true;
        let delay = 0;
         inputs.forEach(el=>{el.style.animation=`scaleUp .3s ease ${delay}s`;
        delay+=0.2
         })
        setTimeout(function(){
            resultMessage(gameWon)
        },1500)
       
    }
    else{
        document.getElementById(`${idsArray[tried-1]}`).style.opacity=`1`;
        document.getElementById(`${idsArray[tried-1]}`).style.height=`${pixels[tried-1]}px`;
        
    };
    if(tried>=8 && gameWon===false){
        idsArray.forEach(el=>{document.getElementById(el).style.borderColor="#880808";
        document.getElementById(el).style.boxShadow="0px 0px 50px #880808";

        })
        setTimeout(function(){
            resultMessage(gameWon)
        },1000)
    }

}

function playGame(){
    counter=0;
    resultContainer.style.display="none";
    word = wordArray[Math.floor(Math.random()*wordArray.length)];
    forKeyboardNums = generateArray(word.length)
    console.log(word)
    tried=0;
    gameStarted=true;
    gameWon=false;
    home.style.display="none";
    keyboard.style.display="grid"
    inputContainer.style.display="flex"
    hangmanContainer.style.display="block";
    addInputs(word)
addKeyboardElems();
idsArray.forEach(el=>{document.getElementById(el).style.height="0"
    document.getElementById(el).style.opacity="0";
    document.getElementById(el).style.borderColor="";
        document.getElementById(el).style.boxShadow="";
})
}
function resultMessage(won){
    gameStarted=false;
     gameWon=false;
   hangmanContainer.style.display="none"
     keyboard.style.display="none";
    inputContainer.style.display="none";
    resultContainer.style.display="flex";
    resultContainer.innerHTML=`<h1 style="color:${won===true?"":"#880808"} ;text-shadow:${won===true?"":"0px 0px 20px red"}">${won===true?"You Survived":"You Got Hanged"}</h1> <h3>${won===true?"Wonderful!!":`<strong>${word.toUpperCase()}</strong> was the word`}</h3>
    <button type="button" id="playAgain" onclick="playGame()">Play Again</button>`
}
