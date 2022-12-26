let dataBase = [],
  questionNumber = 0,
  correctAnswers = 0,
  incorrectAnswers = 0,
  limit = 4;
let i, correct, countries;
let container = document.getElementById("container");

//sounds
const correctAudioFile = new Audio(
  "https://www.dropbox.com/s/sd52l9ghgmdga83/correct.mp3?dl=1&raw=1"
);
const wrongAudioFile = new Audio(
  "https://www.dropbox.com/s/4d5wnvvk2zyy0k7/wrong.mp3?dl=1&raw=1"
);
const finishAudioFile = new Audio(
  "https://www.dropbox.com/s/oduhqpwx130bldi/finish.mp3?dl=1&raw=1"
);

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

let correctAnswersArray = [];
let userAnswersArray = [];

function testflag(el) {
  rmv();
  if (el == correct) {
    correctAudio();
    correctAnswers++;
    correctAnswersArray.push(correct);
    userAnswersArray.push(el);
    if (questionNumber % 10 != 0) {
      flags();
    } else {
      finish();
    }
  } else {
    wrongAudio();
    incorrectAnswers++;
    correctAnswersArray.push(correct);
    userAnswersArray.push(el);
    if (questionNumber % 10 != 0) {
      container.innerHTML += `
      <h3>Wrong answer!</h3>
      <h4>The correct answer is: ${correct}</h4>
      <button onclick="flags()">Next</button>`;
    } else {
      finish();
    }
  }
}

function finish() {
  finishAudio();
  container.innerHTML += `
    <h2>Your Score is <b>${correctAnswers}/${questionNumber}</b></h2>
    <table>
      <tr>
        <th>Question</th>
        <th>Your answer</th>
        <th>Correct answer</th>
        <th>Flag</th>
      </tr>
    </table>
    <button id="flags" onclick="flags()">Try Again</button>`;

  let flagURL = "";
  for (let i = 0; i < correctAnswersArray.length; i++) {
    let correctCountry = dataBase.find(
      (country) => country.name === correctAnswersArray[i]
    );
    flagURL = correctCountry.flag;
    let row = document.createElement("tr");
    row.innerHTML = `
        <td>${i + 1}</td>
        <td>${userAnswersArray[i]}</td>
        <td>${correctAnswersArray[i]}</td>
        <td><img style="width:50px" src="${flagURL}"></td>`;
    if (userAnswersArray[i] == correctAnswersArray[i]) {
      row.style.backgroundColor = "lightgreen";
    } else {
      row.style.backgroundColor = "pink";
    }
    document.querySelector("table").appendChild(row);
  }

  questionNumber = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
}
