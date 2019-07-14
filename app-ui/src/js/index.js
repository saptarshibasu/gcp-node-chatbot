import style from "../sass/styles.scss";

$( document ).ready(function() {

});

let stopRecognition;
let isRecognitionStopped;
let startRecognition;

$(".home__container__speech-btn").click(function () { 
    let recognition;
    let recorgnitionStopped = false;

    if($(this).find("i").hasClass("microphone-on")) {
      stopMicrophone($(this).find("i"));
      stopRecognition();
    } else {
        if (window.webkitSpeechRecognition) {
            if(!recognition) {
                recognition = new webkitSpeechRecognition();
            }
            acceptVoice(recognition, $(this).find("i"));
        } else if (window.SpeechRecognition) {
            if(!recognition) {
                recognition = new SpeechRecognition();
            }
            acceptVoice(recognition, $(this).find("i"));
        } else {
            //Ugly alert for the time being - need to remove later
            alert("Your browser does not support web speech api");
        }
        stopRecognition = function() {
            if(recognition) {
                recognition.stop();
            }
            recorgnitionStopped = true;
            setTimeout(function() {
                recorgnitionStopped = false
            }, 1000);
        }

        isRecognitionStopped = function() {
            return recorgnitionStopped;
        }

        startRecognition = function() {
            if(recognition && !isRecognitionStopped()) {
                recognition.start();
            }
        }
    }
});


function acceptVoice(recognition, microphone) {
    startMicrophone(microphone);

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() { console.log("start") }
    recognition.onresult = function(event) { displayTranscript(event.results[0][0].transcript); }
    recognition.onerror = function(event) { stopMicrophone(); stopRecognition(); }
    recognition.onend = function() { startRecognition() }
    recognition.start();
}

function startMicrophone(element) {
    if(element.hasClass("microphone-off")) {
        element.removeClass("microphone-off").addClass("microphone-on");
    }
}

function stopMicrophone(element) {
    stopRecognition();
    if(element.hasClass("microphone-on")) {
        element.removeClass("microphone-on").addClass("microphone-off");
    }
}

function displayTranscript(transcript) {
    $(".home__container__transcript").find("ul").append(`<li class="transcript-container--user"><span class="transcript-container__transcript--user">${transcript}</span></li>`);
    if($(".home__container__transcript ul").children().length > 4) {
        $(".home__container__transcript ul li").first().remove();
    }
}