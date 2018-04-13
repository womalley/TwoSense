

/* Create login on click event */
function loginButtonCheck() {

    // grab user inputs from login page
    const email = document.getElementById("emailIn").value;
    const password = document.getElementById("passwordIn").value;

    // firebase auth
    const auth = firebase.auth();

    // sign in with email and password
    const loginAttempt = auth.signInWithEmailAndPassword(email, password); // login successful
    loginAttempt.catch(e => {
      console.log(e.message);
      alert("The email you entered does not belong to an account. Please check your email and password.");
    }); // login failed (user credentials wrong or user does not exist)
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
    console.log(e.message);
    alert("The email you entered is already registered or does not exist.");
  });

  // log user information
  firebase.auth().onAuthStateChanged(firebaseUser => {

    if (firebaseUser) {
      console.log(firebaseUser);
      console.log("User is logged in!");
      
    }
    else {
      console.log("User is not logged in!");
    }
  });
}
