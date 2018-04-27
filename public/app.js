
src = "https://www.gstatic.com/firebasejs/4.12.1/firebase.js";

var database = firebase.database();

// reference to color blind leaderboards
var ref = database.ref('leaderboard');
console.log("REF: " + ref);
ref.on('value', obtainData, errorData);

// reference to hearing test leaderboards
var hearingRef = database.ref('hearingLeaderboard');
console.log("HEARING REF: " + hearingRef);
hearingRef.on('value', obtainHearingData, errorData);

var userRef;

/* -------------------------- LOGIN PAGE AND ROUTING FUNCTIONS -------------------------- */

/* Create login on click event */
function loginButtonCheck() {

  // grab user inputs from login page
  const email = document.getElementById("emailIn").value;
  const password = document.getElementById("passwordIn").value;

  // sign in with email and password
  const loginAttempt = firebase.auth().signInWithEmailAndPassword(email, password); // login successful
  loginAttempt.catch(e => {
    //alert("The email and password does not exist. Please check your email and password.");
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

    // create reference to user's color blindness test score
    userRef = database.ref('profile').child(uid);
    console.log("USER COLOR REF: " + userRef);
    // setting up routing to user's database for grabbing user's top color score
    userRef.on('value', obtainUserProfile, errorData);

    var userEmail = firebase.auth().currentUser.email;
    console.log("EMAIL: " + userEmail);

    // set user's email to user's database (for profile page)
    userRef.update({email: userEmail});

    // set user's default username in user's database (for profile page)
    var username = userEmail;
    username = username.split("@");
    username = username[0];
    userRef.update({username: username});

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

// firebase.auth().onAuthStateChanged(user => {
//   if (user) { this.userId = user.uid }
//   console.log("USER ID: " + this.userId);
// });

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
  ["./Tests/Colorblindness/7.png", '7'],
  ["./Tests/Colorblindness/9.png", '9'],
  ["./Tests/Colorblindness/3.1.png", '3'],
  ["./Tests/Colorblindness/7.3.png", '7'],
  ["./Tests/Colorblindness/3.png", '3'],
  ["./Tests/Colorblindness/4.png", '4'],
  ["./Tests/Colorblindness/5.0.png", '5'],
  ["./Tests/Colorblindness/9.2.png", '9'],
  ["./Tests/Colorblindness/5.1.png", '5'],
  ["./Tests/Colorblindness/2.1.png", '2'],
  ["./Tests/Colorblindness/7.2.png", '7'],
  ["./Tests/Colorblindness/9.1.png", '9'],
  ["./Tests/Colorblindness/5.2.png", '5'],
  ["./Tests/Colorblindness/5.png", '5'],
  ["./Tests/Colorblindness/6.1.png", '6'],
  ["./Tests/Colorblindness/6.png", '6'],
  ["./Tests/Colorblindness/9.3.png", '9'],
  ["./Tests/Colorblindness/7.1.png", '7'],
  ["./Tests/Colorblindness/8.png", '8']
];

var colorAnsKey = ['none', '2', '7', '9', '3', '7', '3', '4', '5', '9', '5', '2', '7', '9', '5', '5', '6', '6', '9', '7', '8'];
var colorAnsUser = [];
var correct = 0;
var finalScore;

function nextQuestion(response, userProfileData) {

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

    // set final score based on correct number of answers
    finalScore = Math.trunc(((correct / question.length) * 10000));
    var username = firebase.auth().currentUser.email;
    username = username.split("@");
    username = username[0];
    console.log("USERNAME: " + username);

    var data = {
      username: username,
      colorScore: finalScore
    }

    ref.push(data);
    userRef.update({lastColor: finalScore});

    var uid = firebase.auth().currentUser.uid;
    console.log("USER ID: " + uid);
    var colorCheckRef = database.ref('profile').child(uid);
    console.log("CHECK: " + colorCheckRef);
    colorCheckRef.on('value', obtainUserProfile, errorData);

    // get a reference of the high score
    var checkScore;
    var colorCheck = database.ref("profile/" + uid + "/colorHigh");
    colorCheck.on("value", function(snap) {
      console.log(snap.val());
      checkScore = snap.val();
    }, function (errorObject) {
      console.log("ERROR: " + errorObject.code);
    });
    
    // check to see if high score for user should be updated
    if ((checkScore < finalScore) || (checkScore == null)) {
      console.log("New score is the new HIGH score!!!");
      colorCheckRef.update({colorHigh: finalScore});
    }
   

    document.getElementById("colorScore").innerHTML = finalScore; // + " / " + (question.length);

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
var hearingCorrect = 0;
var leftCorrect = 0;
var rightCorrect = 0;
var totalHearingScore;

// hide final score elements for color test until final else
var finalTextHearingElement1 = document.getElementById("finalTextHearing1");
var finalTextHearingElement2 = document.getElementById("finalTextHearing2");
var finalTextHearingElement3 = document.getElementById("finalTextHearing3");

var hearingScoreElement = document.getElementById("hearingScore");
var leftScoreElement = document.getElementById("leftHearingScore");
var rightScoreElement = document.getElementById("rightHearingScore");
var tryAgainHearingButtonElement = document.getElementById("tryAgainHearingButton");

// hide elements if on color blindness test page (otherwise ignore)
if (finalTextHearingElement1 != null && hearingScoreElement != null && tryAgainHearingButtonElement != null) {
  finalTextHearingElement1.style.display = "none";
  finalTextHearingElement2.style.display = "none";
  finalTextHearingElement3.style.display = "none";

  hearingScoreElement.style.display = "none";
  leftScoreElement.style.display = "none";
  rightScoreElement.style.display = "none";
  tryAgainHearingButtonElement.style.display = "none";

  // set default volume level to 50%
  var audio = document.getElementById("soundFile");
  audio.volume = 0.4;
}

var sounds = [
  ["./Tests/Hearing/Left/500hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/8500hzright.mp3", "1"],
  ["./Tests/Hearing/Left/1000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/5000hzright.mp3", "1"],
  ["./Tests/Hearing/Left/2000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/20000hzright.mp3", "1"],
  ["./Tests/Hearing/Left/3000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/16500hzright.mp3", "1"],
  ["./Tests/Hearing/Left/20000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/18000hzright.mp3", "1"],
  ["./Tests/Hearing/Right/3000hzright.mp3", "1"],
  ["./Tests/Hearing/Right/10000hzright.mp3", "1"],
  ["./Tests/Hearing/Left/7000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/15000hzright.mp3", "1"],
  ["./Tests/Hearing/Left/8500hzleft.mp3", "0"],
  ["./Tests/Hearing/Left/10000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/13500hzright.mp3", "1"],
  ["./Tests/Hearing/Left/12000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/1000hzright.mp3", "1"],
  ["./Tests/Hearing/Left/13500hzleft.mp3", "0"],
  ["./Tests/Hearing/Left/15000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/500hzright.mp3", "1"],
  ["./Tests/Hearing/Left/16500hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/7000hzright.mp3", "1"],
  ["./Tests/Hearing/Left/18000hzleft.mp3", "0"],
  ["./Tests/Hearing/Left/5000hzleft.mp3", "0"],
  ["./Tests/Hearing/Right/2000hzright.mp3", "1"],
  ["./Tests/Hearing/Right/12000hzright.mp3", "1"],
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

  if ((soundNum < (sounds.length)) && (resp == sounds[soundNum][1])) {
    // answer is correct
    console.log("User's answer is correct!")
    hearingCorrect++;

    // individual ear scores
    if (sounds[soundNum][1] == 0) {
      leftCorrect++;
    }
    else if (sounds[soundNum][1] == 1) {
      rightCorrect++;
    }
  }

  console.log("User answers: " + hearingAnsUser);

  soundNum++;

  console.log("soundNum: " + soundNum);

  if (soundNum < (sounds.length)) {

    console.log("Set next sound");
    document.getElementById('soundFile').src = sounds[soundNum][0];

  }
  else {
    console.log("reset sound number");

    // set scores and username
    totalHearingScore = hearingCorrect;
    var totalHearingScoreVal = Math.trunc(((totalHearingScore / sounds.length) * 10000));

    var username = firebase.auth().currentUser.email;
    username = username.split("@");
    username = username[0];
    console.log("USERNAME: " + username);

    // add to firebase real-time database
    var hearingData = {
      username: username,
      hearingScore: totalHearingScoreVal
    }
    hearingRef.push(hearingData);

    // set last hearing score in user's database
    userRef.update({lastHearing: totalHearingScoreVal});

    // check to see if high score for user should be updated
    // var hearingCheck = userProfileData.val().hearingHigh;

    // if (hearingCheck < totalHearingScoreVal) {
    //   userRef.update({hearingHigh: totalHearingScoreVal});
    // }

    var uid = firebase.auth().currentUser.uid;
    console.log("USER ID: " + uid);
    var hearingCheckRef = database.ref('profile').child(uid);
    console.log("CHECK: " + hearingCheckRef);
    hearingCheckRef.on('value', obtainUserProfile, errorData);

    // get a reference of the high score
    var checkScore;
    var hearingCheck = database.ref("profile/" + uid + "/hearingHigh");
    hearingCheck.on("value", function(snap) {
      console.log(snap.val());
      checkScore = snap.val();
    }, function (errorObject) {
      console.log("ERROR: " + errorObject.code);
    });
  
    // set ear quality values
    leftEar = Math.trunc(((leftCorrect / (sounds.length / 2)) * 100));
    rightEar = Math.trunc(((rightCorrect / (sounds.length / 2)) * 100));

    // check to see if high score for user should be updated
    if ((checkScore < totalHearingScoreVal) || (checkScore == null)) {
      console.log("New score is the new HIGH score!!!");
      hearingCheckRef.update({hearingHigh: totalHearingScoreVal});
      hearingCheckRef.update({leftEar: leftEar});
      hearingCheckRef.update({rightEar: rightEar});
    }

    // print to html
    document.getElementById("hearingScore").innerHTML = totalHearingScoreVal; //totalHearingScore + " / " + (sounds.length);
    document.getElementById("leftHearingScore").innerHTML = leftEar + "%";
    document.getElementById("rightHearingScore").innerHTML = rightEar + "%";

    console.log("LEFT: " + leftCorrect);
    console.log("RIGHT: " + rightCorrect);


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
    finalTextHearingElement1.style.display = "block";
    finalTextHearingElement2.style.display = "block";
    finalTextHearingElement3.style.display = "block";

    hearingScoreElement.style.display = "block";
    leftScoreElement.style.display = "block";
    rightScoreElement.style.display = "block";
    tryAgainHearingButtonElement.style.display = "block";

    soundNum = 0;
  }

  onload = function () {
    console.log("ONLOAD");
    document.getElementById('soundFile').src = sounds[0][0];
  }
}

/* ------------------------------ END HEARING TESTING FUNCTIONS ------------------------------ */


/* ------------------------- BLINDNESS LEADERBOARD DATABASE FUNCTIONS ------------------------- */

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
    for (var i = 0; i < colorArr.length - 1; i++) {
      if (colorArr[i] < colorArr[i + 1]) {
        var temp = colorArr[i];
        colorArr[i] = colorArr[i + 1];
        colorArr[i + 1] = temp;

        var temp2 = colorUser[i];
        colorUser[i] = colorUser[i + 1];
        colorUser[i + 1] = temp2;

        swapped = true;
      }
    }
  } while (swapped);

  console.log("Color Scores: " + colorArr);
  console.log("Color Names: " + colorUser);

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


/* -------------------------- HEARING LEADERBOARD DATABASE FUNCTIONS -------------------------- */

function obtainHearingData(hearingData) {
  // show all scores
  console.log(hearingData.val());
  var soundScore = hearingData.val();
  var keys = Object.keys(soundScore);
  console.log("Keys: " + keys);

  var scoreLength = keys.length;
  console.log("LENGTH:" + scoreLength);
  var hearingArr = [];
  var hearingUser = [];

  // set all values to colorScore
  for (var index = 0; index < scoreLength; index++) {
    var k = keys[index];
    var hearScore = soundScore[k].hearingScore;
    var name = soundScore[k].username;
    console.log("HEARING: " + hearScore);
    hearingArr.push(soundScore[k].hearingScore);
    hearingUser.push(soundScore[k].username);
  }

  // sort by score
  var swapped;
  do {
    swapped = false;
    for (var i = 0; i < hearingArr.length - 1; i++) {
      if (hearingArr[i] < hearingArr[i + 1]) {
        var temp = hearingArr[i];
        hearingArr[i] = hearingArr[i + 1];
        hearingArr[i + 1] = temp;

        var temp2 = hearingUser[i];
        hearingUser[i] = hearingUser[i + 1];
        hearingUser[i + 1] = temp2;

        swapped = true;
      }
    }
  } while (swapped);

  console.log("Hearing Scores: " + hearingArr);
  console.log("Hearing Names: " + hearingUser);

  // display the first 10
  if (scoreLength > 10) {
    scoreLength = 10;
  }

  var list = "";
  for (var index = 0; index < scoreLength; index++) {

    list += "<li>" + hearingUser[index] + "  -  " + hearingArr[index] + "</li>";

  }

  var hearingLeaderboardElement = document.getElementById("hearingLeaderboard");
  if (hearingLeaderboardElement != null) {
    document.getElementById("hearingLeaderboard").innerHTML = list;
  }

}

/* ------------------------ END HEARING LEADERBOARD DATABASE FUNCTIONS ------------------------ */


  /* -------------------------------- PROFILE DATABASE FUNCTIONS -------------------------------- */

function obtainUserProfile(userProfileData) {

  // show stats in console log for testing
  console.log("Current email: " + userProfileData.val().email);
  console.log("Current username: " + userProfileData.val().username);
  console.log("Current color score: " + userProfileData.val().lastColor);
  console.log("Current hearing score: " + userProfileData.val().lastHearing);
  console.log("Top color score: " + userProfileData.val().colorHigh);
  console.log("Top hearing score: " + userProfileData.val().hearingHigh);
  console.log("Top left ear score: " + userProfileData.val().leftEar);
  console.log("top right ear score: " + userProfileData.val().rightEar);

  // set all user database values to variables
  var email = userProfileData.val().email;
  var username = userProfileData.val().username;
  var color = userProfileData.val().lastColor;
  var hearing = userProfileData.val().lastHearing;
  var colorHigh = userProfileData.val().colorHigh;
  var hearingHigh = userProfileData.val().hearingHigh;
  var leftEarHigh = userProfileData.val().leftEar;
  var rightEarHigh = userProfileData.val().rightEar;

  // grab elements from profile page (to set user data to below)
  var userEmailElement = document.getElementById("userEmailField");
  var usernameElement = document.getElementById("usernameField");
  var lastColorElement = document.getElementById("lastColorField");
  var lastHearingElement = document.getElementById("lastHearingField");
  var colorHighElement = document.getElementById("colorHighField");
  var hearingHighElement = document.getElementById("hearingHighField");

  // if on profile page, fill all elements with the user's data
  if ((userEmailElement != null)) {
    document.getElementById("userEmailField").innerHTML = email;
    document.getElementById("usernameField").innerHTML = username;
    document.getElementById("lastColorField").innerHTML = color;
    document.getElementById("lastHearingField").innerHTML = hearing;
    document.getElementById("colorHighField").innerHTML = colorHigh;
    document.getElementById("hearingHighField").innerHTML = hearingHigh;
    document.getElementById("leftEarField").innerHTML = (leftEarHigh + "%");
    document.getElementById("rightEarField").innerHTML = (rightEarHigh + "%");
  }

}
  /* ------------------------------ END PROFILE DATABASE FUNCTIONS ------------------------------ */

