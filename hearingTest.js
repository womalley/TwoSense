var soundNum = 0;
var numTrue = 0;

var sounds = [
    ["./Tests/Hearing/100hz.mp3"],
    ["./Tests/Hearing/500hz.mp3"],
    ["./Tests/Hearing/1000hz.mp3"],
    ["./Tests/Hearing/2000hz.mp3"],
    ["./Tests/Hearing/3000hz.mp3"],
    ["./Tests/Hearing/5000hz.mp3"],
    ["./Tests/Hearing/7000hz.mp3"],
    ["./Tests/Hearing/20hz.mp3"]
];

function nextSound(response) {

    if (soundNum < (sounds.length)) {
      if (response.toLowerCase() === "yes")
        numTrue++;
    }
    soundNum++;

    if (soundNum < (sounds.length)) {
        
        var audio = document.getElementById('audioPlayer');
        if (audio.paused) {
            audio.play();
        }else{
            audio.pause();
            audio.currentTime = 0
        }
        
        document.getElementById('audioPlayer').src = document.getElementById('soundFile').src = sounds[soundNum];

    } else {
      soundNum = 0;
    }  

    onload = function() {
        document.getElementById('soundFile').src = sounds[0];
    }
}