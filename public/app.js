
src="https://www.gstatic.com/firebasejs/4.12.1/firebase.js";

var database = firebase.database();
var ref = database.ref('leaderboard');
ref.on('value', obtainData, errorData);

/* -------------------------- LOGIN PAGE AND ROUTING FUNCTIONS -------------------------- */

/* Create login on click event */
function loginButtonCheck() {

  // grab user inputs from login page
  const email = document.getElementById("emailIn").value;
  const password = document.getElementById("passwordIn").value;

  // sign in with email and password
  const loginAttempt = firebase.auth().signInWithEmailAndPassword(email, password); // login successful
  loginAttempt.catch(e => {
    window.location.replace("");
  });

  // log user information
  firebase.auth().onAuthStateChanged(firebaseUser => {

    if (firebaseUser) {
      console.log(firebaseUser);
      window.location.replace("home.html");
      console.log("User is logged in!");
    }
    else {
      console.log("User is not logged in!");
      //alert("The email you entered does not belong to an account. Please check your email and password.");
    }

  });
}

function registerButtonCheck() {

  // set email and password vars by user input
  const email = document.getElementById("emailIn").value;
  const password = document.getElementById("passwordIn").value;

  // firebase auth
  const auth = firebase.auth();

  // register with email and password
  const registerAttempt = auth.createUserWithEmailAndPassword(email, password); // should pass (unless user exists or email doesn't exist)
  registerAttempt.catch(e => {
    window.location.replace("");
    console.log(e.message);
    alert("The email you entered is already registered or does not exist.");
  });

}

// function populateUser() {
//   firebase.auth().onAuthStateChanged(user => {
//     if (user) { this.userId = user.uid }
//     console.log("USER ID: " + this.userId);

//     uid = this.userId;

//     firebase.database().ref().child('users').child(uid).set({
//       userId: this.userId,
//       colorTop: 0,
//       colorLast: 0,
//       hearingTop: 0,
//       hearingLast: 0
//     });
//   });
// }

// log user information
firebase.auth().onAuthStateChanged(firebaseUser => {

  if (firebaseUser) {
    console.log(firebaseUser);
    console.log("User is logged in!");

    var uid = firebase.auth().currentUser.uid;
    console.log("UID: " + uid);

    var userEmail = firebase.auth().currentUser.email;
    console.log("EMAIL: " + userEmail);

    // MAY NEED TO EDIT
    firebase.database().ref().child('users').child(uid).set({
      userId: uid,
      email: userEmail
    });

  }
  else {
    console.log("User is not logged in!");
  }
});

firebase.auth().onAuthStateChanged(user => {
  if (user) { this.userId = user.uid }
  console.log("USER ID: " + this.userId);
});


function profileRedirect() {
  window.location.replace("profile.html");
}

function colorTestRedirect() {
  window.location.replace("colorTest.html");
}

function hearingTestRedirect() {
  window.location.replace("hearingTest.html");
}

function topScoresRedirect() {
  window.location.replace("topScores.html");
}

function logout() {
  firebase.auth().signOut();
  window.location.replace("index.html");
}

function checkLoggedIn() {
  if (firebaseUser) {
    console.log(firebaseUser);
    window.location.replace("home.html");
    console.log("User is logged in!");
  }
  else {
    console.log("User is not logged in!");
  }
}

/* -------------------------- END LOGIN PAGE AND ROUTING FUNCTIONS -------------------------- */


/* -------------------------- COLOR-BLINDNESS TESTING FUNCTIONS -------------------------- */

var questionNum = 0;
var correctAns = 0;


// hide final score elements for color test until final else
var finalTextElement = document.getElementById("finalTextBody");
var colorScoreElement = document.getElementById("colorScore");
var tryAgainButtonElement = document.getElementById("tryAgainButton");

// hide elements if on color blindness test page (otherwise ignore)
if (finalTextElement != null && colorScoreElement != null && tryAgainButtonElement != null) {
  finalTextElement.style.display = "none";
  colorScoreElement.style.display = "none";
  tryAgainButtonElement.style.display = "none";
}

const question = [
  ["./Tests/Colorblindness/1.png", 'none'],
  ["./Tests/Colorblindness/2.0.png", '2'],
  ["./Tests/Colorblindness/2.1.png", '2'],
  ["./Tests/Colorblindness/3.1.png", '3'],
  ["./Tests/Colorblindness/3.png", 'none'],
  ["./Tests/Colorblindness/4.png", '4'],
  ["./Tests/Colorblindness/5.0.png", '5'],
  ["./Tests/Colorblindness/5.1.png", '5'],
  ["./Tests/Colorblindness/5.2.png", '5'],
  ["./Tests/Colorblindness/5.png", '5'],
  ["./Tests/Colorblindness/6.1.png", '6'],
  ["./Tests/Colorblindness/6.png", '6'],
  ["./Tests/Colorblindness/7.1.png", '7'],
  ["./Tests/Colorblindness/7.2.png", '7'],
  ["./Tests/Colorblindness/7.3.png", '7'],
  ["./Tests/Colorblindness/7.png", '7'],
  ["./Tests/Colorblindness/8.png", '8'],
  ["./Tests/Colorblindness/9.1.png", '9'],
  ["./Tests/Colorblindness/9.2.png", '9'],
  ["./Tests/Colorblindness/9.3.png", '9'],
  ["./Tests/Colorblindness/9.png", '9']
];

var colorAnsKey = ['none', '2', '2', '3', 'none', '4', '5', '5', '5', '5', '6', '6', '7', '7', '7', '7', '8', '9', '9', '9', '9'];
var colorAnsUser = [];
var correct = 0;
var finalScore;

function nextQuestion(response) {

  response = document.getElementById("userAnswerIn").value;
  console.log("User response: " + response);

  // add user response to user's answers array
  colorAnsUser.push(response);
  console.log("User answers: " + colorAnsUser);

  if ((questionNum < (question.length)) && (response == question[questionNum][1])) {
    // answer is correct
    console.log("User's answer is correct!")
    correct++;
  }

  console.log("questionNum: " + questionNum);

  questionNum++;
  // make sure test has not reached the end
  if (questionNum < (question.length)) {
    document.getElementById('colorImg').src = question[questionNum][0];
    console.log("Next color blind test check");

    //reset input field after button click
    document.getElementById('userAnswerIn').value = '';

    onload = function () {
      document.getElementById('colorImg').src = question[0][0];
    }
  }
  else {
    // exit test
    console.log("Test is over");

    //compare answer key array with user input array

    console.log("Number of correct answers: " + correct);

    // TODO: SET FINAL SCORE TO SOME MULTIPLE NUMBER (100?)
    finalScore = correct;
    var username = firebase.auth().currentUser.email;
    username = username.split("@");
    username = username[0];
    console.log("USERNAME: " + username);

    var data = {
      username: username,
      colorScore: finalScore
    }

    ref.push(data);

    document.getElementById("colorScore").innerHTML = finalScore + " / " + (question.length);

    // make test sheet hidden
    var imgElement = document.getElementById("colorImg");
    var textElement = document.getElementById("textBody");
    var inputTestElement = document.getElementById("userAnswerIn");
    var buttonTestElement = document.getElementById("nextQButton");

    imgElement.style.display = "none";
    textElement.style.display = "none";
    inputTestElement.style.display = "none";
    buttonTestElement.style.display = "none";

    // display final score results for color blindness test
    finalTextElement.style.display = "block";
    colorScoreElement.style.display = "block";
    tryAgainButtonElement.style.display = "block";

    questionNum = 0;
    correct = 0;
  }
}


/* -------------------------- END COLOR-BLINDNESS TESTING FUNCTIONS -------------------------- */



/* -------------------------------- HEARING TESTING FUNCTIONS -------------------------------- */

var soundNum = 0;
var numTrue = 0;

// hide final score elements for color test until final else
var finalTextHearingElement = document.getElementById("finalTextHearing");
var hearingScoreElement = document.getElementById("hearingScore");
var tryAgainHearingButtonElement = document.getElementById("tryAgainHearingButton");

// hide elements if on color blindness test page (otherwise ignore)
if (finalTextHearingElement != null && hearingScoreElement != null && tryAgainHearingButtonElement != null) {
  finalTextHearingElement.style.display = "none";
  hearingScoreElement.style.display = "none";
  tryAgainHearingButtonElement.style.display = "none";
}

var sounds = [
  ["./Tests/Hearing/left/20hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/500hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/1000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/2000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/3000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/5000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/7000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/8500hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/10000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/12000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/13500hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/15000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/16500hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/18000hzleft.mp3", "-1"],
  ["./Tests/Hearing/left/20000hzleft.mp3", "-1"],
  ["./Tests/Hearing/right/20hzright.mp3", "-1"],
  ["./Tests/Hearing/right/500hzright.mp3", "-1"],
  ["./Tests/Hearing/right/1000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/2000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/3000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/5000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/7000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/8500hzright.mp3", "-1"],
  ["./Tests/Hearing/right/10000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/12000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/13500hzright.mp3", "-1"],
  ["./Tests/Hearing/right/15000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/16500hzright.mp3", "-1"],
  ["./Tests/Hearing/right/18000hzright.mp3", "-1"],
  ["./Tests/Hearing/right/20000hzright.mp3", "-1"],
];

// TODO: Set answer key values!
var hearingAnsKey = [];
var hearingAnsUser = [];

function nextSound(resp) {

  console.log("button selected: " + resp);
  console.log("sound length: " + sounds.length);
  console.log("sound to play: " + sounds[soundNum][0]);

  // add user response to user's answers array
  hearingAnsUser.push(resp);

  console.log("User answers: " + hearingAnsUser);

  soundNum++;

  console.log("soundNum: " + soundNum);

  if (soundNum < (sounds.length)) {

    console.log("Set next sound");
    document.getElementById('soundFile').src = sounds[soundNum][0];

  }
  else {
    console.log("reset sound number");

    // make test sheet hidden
    var textHearingElement1 = document.getElementById("textHearing1");
    var textHearingElement2 = document.getElementById("textHearing2");
    var leftButtonElement = document.getElementById("leftButton");
    var rightButtonElement = document.getElementById("rightButton");
    var neitherButtonElement = document.getElementById("neitherButton");
    var soundFileElement = document.getElementById("soundFile");

    textHearingElement1.style.display = "none";
    textHearingElement2.style.display = "none";
    leftButtonElement.style.display = "none";
    rightButtonElement.style.display = "none";
    neitherButtonElement.style.display = "none";
    soundFileElement.style.display = "none";

    // display final score results for color blindness test
    finalTextHearingElement.style.display = "block";
    hearingScoreElement.style.display = "block";
    tryAgainHearingButtonElement.style.display = "block";

    soundNum = 0;
  }

  onload = function () {
    console.log("ONLOAD");
    document.getElementById('soundFile').src = sounds[0][0];
  }
}

/* ------------------------------ END HEARING TESTING FUNCTIONS ------------------------------ */


/* ------------------------------ LEADERBOARD DATABASE FUNCTIONS ------------------------------ */

function obtainData(data) {
  // show all scores
  console.log(data.val());
  var score = data.val();
  var keys = Object.keys(score);
  console.log("Keys: " + keys);

  var scoreLength = keys.length;
  console.log("LENGTH:" + scoreLength);
  var colorArr = [];
  var colorUser = [];

  // set all values to colorScore
  for (var index = 0; index < scoreLength; index++) {
    var k = keys[index];
    var colorScore = score[k].colorScore;
    var name = score[k].username;
    console.log("COLOR: " + colorScore);
    colorArr.push(score[k].colorScore); 
    colorUser.push(score[k].username);
  }

  // sort by score
  var swapped;
  do {
      swapped = false;
      for (var i=0; i < colorArr.length-1; i++) {
          if (colorArr[i] > colorArr[i+1]) {
              var temp = colorArr[i];
              colorArr[i] = colorArr[i+1];
              colorArr[i+1] = temp;

              var temp2 = colorUser[i];
              colorUser[i] = colorUser[i+1];
              colorUser[i+1] = temp;

              swapped = true;
          }
      }
  } while (swapped);


  console.log("HELLO: " + colorArr);

  // display the first 10
  if (scoreLength > 10) {
    scoreLength = 10;
  }

  var list = "";
  for (var index = 0; index < scoreLength; index++) {
   
    list += "<li>" + colorUser[index] + "  -  " + colorArr[index] + "</li>";
   
  }

  var colorLeaderboardElement = document.getElementById("colorLeaderboard");
  if (colorLeaderboardElement != null) {
    document.getElementById("colorLeaderboard").innerHTML = list;
  }

}

function errorData(err) {
  console.log("ERROR: " + err);
}

/* ---------------------------- END LEADERBOARD DATABASE FUNCTIONS ---------------------------- */

