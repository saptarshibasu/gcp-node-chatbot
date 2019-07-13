import style from "../sass/styles.scss";

$( document ).ready(function() {

});


$(".home__container__speech-btn").click(function () { 
    if($(this).find("i").hasClass("microphone-on")) {
      toggleMicrophone($(this).find("i"));
    } else {
        if (window.webkitSpeechRecognition) {
            acceptVoice(new webkitSpeechRecognition(), $(this).find("i"));
        } else if (window.SpeechRecognition) {
            acceptVoice(new SpeechRecognition(), $(this).find("i"));
        } else {
            //Ugly alert for the time being - need to remove later
            alert("Your browser does not support web speech api");
        }
    }
});

function acceptVoice(recognition, microphone) {
    toggleMicrophone(microphone);

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() { console.log("start") }
    recognition.onresult = function(event) { displayTranscript(event.results[0][0].transcript); }
    recognition.onerror = function(event) { microphone.removeClass("microphone-on").addClass("microphone-off"); }
    recognition.onend = function() { microphone.removeClass("microphone-on").addClass("microphone-off"); }
    recognition.start();
}

function toggleMicrophone(element) {
    if(element.hasClass("microphone-off")) {
        element.removeClass("microphone-off").addClass("microphone-on");
    } else {
        element.removeClass("microphone-on").addClass("microphone-off");
    }
}

function displayTranscript(transcript) {
    $(".home__container__transcript").find("ul").append(`<li>Me:  ${transcript}</li>`);
    if($(".home__container__transcript ul").children().length > 10) {
        $(".home__container__transcript ul li").first().remove();
    }
}