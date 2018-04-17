
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

  // log user information
  firebase.auth().onAuthStateChanged(firebaseUser => {

    if (firebaseUser) {
      console.log(firebaseUser);
      //window.location.replace("home.html");
      console.log("User is logged in!");
    }
    else {
      console.log("User is not logged in!");
    }
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

var question = [
    ["./Tests/Colorblindness/1.png", '-1'],
    ["./Tests/Colorblindness/2.0.png", '2'],
    ["./Tests/Colorblindness/2.1.png", '2'],
    ["./Tests/Colorblindness/3.1.png", '3'],
    ["./Tests/Colorblindness/3.png", '3'],
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

function nextQuestion(response) {
    if ((questionNum < (question.length)) && (response == question[questionNum][1])) {
        // answer is correct
        correct++;
    }

    // TODO: add progress bar

    console.log("questionNum: " + questionNum);

    questionNum++;
    // make sure test has not reached the end
    if (questionNum < (question.length)) {
        document.getElementById('colorImg').src = question[questionNum][0];
        console.log("Next color blind test check");
    }
    else {
      // exit test
      console.log("Test is over");

      //go to page for showing users score?
      //window.location.replace("topScores.html");

      // reset counter
      questionNum = 0;
    }

    onload = function() {
        document.getElementById('colorImg').src = question[0][0];
    }

}
 

/* -------------------------- END COLOR-BLINDNESS TESTING FUNCTIONS -------------------------- */


