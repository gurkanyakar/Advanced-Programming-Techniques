let dataBase = [],
  questionNumber = 0,
  correctAnswers = 0,
  limit = 4;
let i, correct, countries;
let container = document.getElementById("container");

//sounds
const correctAudioFile = new Audio("https://www.dropbox.com/s/sd52l9ghgmdga83/correct.mp3?dl=1&raw=1");
const wrongAudioFile = new Audio("https://www.dropbox.com/s/4d5wnvvk2zyy0k7/wrong.mp3?dl=1&raw=1");
const finishAudioFile = new Audio("https://www.dropbox.com/s/oduhqpwx130bldi/finish.mp3?dl=1&raw=1");

fetch("https://restcountries.com/v2/all?fields=name,flag")
  .then((data) => data.json())
  .then((result) => {
    dataBase = result;
  })
  .catch((error) => {
    prev.innerHTML = error + " <br> Please try again later";
    console.log(error);
  });

// play the audio when the correct answer is chosen
function correctAudio() {
  correctAudioFile.play();
}

// play the audio when the wrong answer is chosen
function wrongAudio() {
  wrongAudioFile.play();
}

// play the audio when the game is finished
function finishAudio() {
  finishAudioFile.play();
}

function rmv() {
  container.innerHTML = "";
}

function flags() {
  rmv();
  questionNumber++;
  i = Math.floor(Math.random() * dataBase.length);
  countries = [dataBase[i].name];
  correct = dataBase[i].name;

  while (countries.length < limit) {
    let choice = dataBase[Math.floor(Math.random() * dataBase.length)].name;
    if (!countries.includes(choice)) {
      countries.push(choice);
    }
  }

  countries.sort();

  container.innerHTML += `
    <h3>Question number: ${questionNumber}</h3>
    <h4>What country does this flag belongs to?</h4>
    <img style="width:300px" src="${dataBase[i].flag}">
    <div id="buttons"></div>`;

  countries.map((country) => {
    document.getElementById("buttons").innerHTML += `
      <button onclick="testflag(\`${country}\`)">${country}</button>`;
  });
}

function testflag(el) {
  rmv();
  if (el == correct) {
    correctAudio();
    correctAnswers++;
    if (questionNumber % 10 != 0) {
      flags();
    } else {
      finish();
    }
  } else {
    wrongAudio();

    if (questionNumber % 10 != 0) {
      flags();
    } else {
      finish();
    }
  }
}

function finish() {
  finishAudio();
  container.innerHTML += `
    <h1>Bravo!<br>
    You finished the test!</h1>
    <h2>Your Score is <b>${correctAnswers}/${questionNumber}</b></h2>
    <button id="flags" onclick="flags()">Try Again</button>`;
  questionNumber = 0;
  correctAnswers = 0;
}
