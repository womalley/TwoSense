

/* Given from Amazon's Firebase to connect code to database (Not my code!) */

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDNs60mQkp79n5tflFVEc7ihH8Kr1ayXM4",
    authDomain: "twosense-66771.firebaseapp.com",
    databaseURL: "https://twosense-66771.firebaseio.com",
    projectId: "twosense-66771",
    storageBucket: "twosense-66771.appspot.com",
    messagingSenderId: "1043280577170"
  };
  firebase.initializeApp(config);
/* End given code */

/* Implementing elements for login (My code) */
const emailIn = document.getElementById('emailIn');
const passwordIn = document.getElementById('passwordIn');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');

/* Create login on click event */
loginButton.addEventListener('click', e => {

    // set email and password vars by user input
    const email = emailIn.value;
    const password = passwordIn.value;
    
    // firebase auth
    const auth = firebase.auth();

    // sign in with email and password
    const loginAttempt = auth.signInWithEmailAndPassword(email, password); // login successful
    loginAttempt.catch(e => console.log(e.message)); // login failed (user credentials wrong or user does not exist)
});
