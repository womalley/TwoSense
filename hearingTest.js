var soundNum = 0;
var numTrue = 0;

var sounds = [
    ["./Tests/Hearing/100hz.mp3"],
    ["./Tests/Hearing/500hz.mp3"],
    ["./Tests/Hearing/5000hz.mp3"]
];

function nextSound(response) {
    if (soundNum < (sounds.length)) {
      if (response.toLowerCase() === "yes")
        numTrue++;
    }

    // TODO: change to radial buttons

    //console.log("soundNum: " + soundNum);

    soundNum++;

    // make sure test has not reached the end
    if (soundNum < (sounds.length)) {

          document.getElementById('soundFile').src = sounds[soundNum];

        //console.log("Next color blind test check");
    }
    else {
      // exit test
      //console.log("Test is over");

      //compare answer key array with user input array

      //go to page for showing users score?
      //window.location.replace("topScores.html");

      // reset counter
      soundNum = 0;
    }  

    onload = function() {
        document.getElementById('soundFile').src = sounds[0];
    }

}