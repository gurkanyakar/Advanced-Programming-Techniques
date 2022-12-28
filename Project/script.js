serviceWork();
let dataBase = [];
let questionNumber = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let limit = 4;
let i, correct, countries;
let container = document.getElementById("container");
let timer;
let timerValue = 0;
let usernameInput = document.getElementById("usernameInput");
let startButton = document.getElementById("startButton");

// Inputa değer girildiğinde start butonunu aktif hale getir
usernameInput.addEventListener("input", () => {
  startButton.disabled = !usernameInput.value;
});

fetch("https://restcountries.com/v2/all?fields=name,flag")
  .then((data) => data.json())
  .then((result) => {
    dataBase = result;
  })
  .catch((error) => {
    prev.innerHTML = error + " <br> Please try again later";
    console.log(error);
  });

function rmv() {
  container.innerHTML = "";
}

function flags() {
  if (questionNumber == 0) {
    startTimer();
  }
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
  <h3 class="timerDisplay"></h3>
    <h4>${questionNumber}-Which country does this flag belongs to?</h4>
    <img style="width:250px" src="${dataBase[i].flag}">
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
    correctAnswers++;
    correctAnswersArray.push(correct);
    userAnswersArray.push(el);
    if (questionNumber % 7 != 0) {
      flags();
    } else {
      finish();
    }
  } else {
    incorrectAnswers++;
    correctAnswersArray.push(correct);
    userAnswersArray.push(el);
    if (questionNumber % 7 != 0) {
      container.innerHTML += `
      <h3 class="timerDisplay"></h3>
      <h3>Wrong answer!</h3>
      <h4>The correct answer is: ${correct}</h4>
      <button onclick="flags()">Next</button>`;
    } else {
      finish();
    }
  }
}

function finish() {
  stopTimer();
  container.innerHTML += `
    <h3>Your Score is <b>${correctAnswers}/${questionNumber}</b></h3>
    <h3 class="timerDisplay"></h3>
    <table style="width:80%; margin: 0 auto;">
      <tr>
        <th>Question</th>
        <th>Your answer</th>
        <th>Correct answer</th>
        <th>Flag</th>
      </tr>
    </table>
    <button id="flags" onclick="flags()">Try Again</button>
    <button id="scoretable" onclick="scoretable()">Score Table</button>`;
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
        <td><img style="width:30px" src="${flagURL}"></td>`;
    if (userAnswersArray[i] == correctAnswersArray[i]) {
      row.style.backgroundColor = "lightgreen";
    } else {
      row.style.backgroundColor = "pink";
    }
    document.querySelector("table").appendChild(row);
  }
  insertData();
  questionNumber = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  correctAnswersArray = [];
  userAnswersArray = [];
  timerValue = 0;
}

const firebaseConfig = {
  apiKey: "AIzaSyBhZkrgkYgxUYsLZpWUXRrefmCBeBZ2-d0",
  authDomain: "flags-of-the-world-50743.firebaseapp.com",
  projectId: "flags-of-the-world-50743",
  storageBucket: "flags-of-the-world-50743.appspot.com",
  messagingSenderId: "527707393910",
  appId: "1:527707393910:web:2eef300903b3e350cc3457",
  measurementId: "G-D1BY73E9E4",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

// Retrieve data from the "Scores" collection
/*
db.collection("Scores")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  })
  .catch((error) => {
    console.log("Error getting documents: ", error);
  });
*/
// Insert data into the "Scores" collection
function insertData() {
  db.collection("Scores")
    .add({
      name: usernameInput.value,
      score: correctAnswers,
      time: timerValue,
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

// top 10 scores
function scoretable() {
  let rank = 1;
  rmv();
  container.innerHTML += `
    <h2>Top 10 scores</h2>
    <table>
      <tr>
        <th>Rank</th>
        <th>Name</th>
        <th>Score</th>
        <th>Time</th>
      </tr>
    </table>
    <button onclick="flags()">Try Again</button>`;
  db.collection("Scores")
    .orderBy("score", "desc")
    .orderBy("time", "asc")
    .limit(10)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let row = document.createElement("tr");
        row.innerHTML = `
          <td>${rank}</td>
          <td>${doc.data().name}</td>
          <td>${doc.data().score}</td>
          <td>${doc.data().time}</td>`;
        document.querySelector("table").appendChild(row);
        rank++;
      });
    });
}
function startTimer() {
  timer = setInterval(() => {
    timerValue++;
    document.querySelector(
      ".timerDisplay"
    ).innerHTML = `Time: ${timerValue} seconds`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function serviceWork() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("serviceWorker.js")
      .then((registration) => {
        console.log("service worker registered!");
        console.log(registration);
      })
      .catch((err) => {
        console.log("service worker registration failed!");
        console.log(err);
      });
  }
}
