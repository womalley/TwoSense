

/* Create login on click event */
function loginButtonCheck() {

    // grab user inputs from login page
    const email = document.getElementById("emailIn").value;
    const password = document.getElementById("passwordIn").value;

    // sign in with email and password
    const loginAttempt = firebase.auth().signInWithEmailAndPassword(email, password); // login successful
    loginAttempt.catch(e => {
      alert("The email you entered does not belong to an account. Please check your email and password.");
      window.location.replace("");
    });

    //window.location.replace("home.html");
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
      window.location.replace("home.html");
      console.log("User is logged in!");
    }
    else {
      console.log("User is not logged in!");
    }
  });


function logout() {
  firebase.auth().signOut();
  window.location.replace("index.html");
}
