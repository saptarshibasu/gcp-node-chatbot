import style from "../sass/styles.scss";

$(document).ready(function () {

});

let stopRecognition;

$(".home__container__speech-btn").click(function () {
    let recognition;

    if ($(this).find("i").hasClass("microphone-on")) {
        stopMicrophone($(this).find("i"));
        stopRecognition();
        stopRecognition = null;
    } else {
        if (window.webkitSpeechRecognition) {
            recognition = new webkitSpeechRecognition();
            acceptVoice(recognition, $(this).find("i"));
        } else if (window.SpeechRecognition) {
            recognition = new SpeechRecognition();
            acceptVoice(recognition, $(this).find("i"));
        } else {
            //Ugly alert for the time being - need to remove later
            alert("Your browser does not support web speech api");
        }

        stopRecognition = function () {
            console.log('stop recognition');
            if (recognition) {
                recognition.stop();
            }
        }
    }
});


function acceptVoice(recognition, microphone) {
    let i = 0;
    let lastResult = '';

    startMicrophone(microphone);

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = true;
    

    recognition.onstart = function () { console.log("start") }
    recognition.onresult = function (event) { 
        if(event.results[i].isFinal && lastResult !== event.results[i][0].transcript) {
            displayUserTranscript(event.results[i][0].transcript); i++; 
            $.ajax({
                url: "api/grocery/query",
                method: "POST",
                data: JSON.stringify({"query": event.results[i-1][0].transcript}),
                dataType: 'json',
                contentType: "application/json",
                 success: function(result,status,jqXHR ){
                    displayAgentTranscript(result.response);
                 },
                 error(jqXHR, textStatus, errorThrown){
                     console.error(errorThrown);
                 }
            }); 
        }
    }
    recognition.onerror = function (event) {
        stopMicrophone(microphone);
        reecognition.stop();
        stopRecognition = null;
    }
    recognition.onend = function () { stopMicrophone(microphone); stopRecognition = null; }
    recognition.start();
}

function startMicrophone(element) {
    if (element.hasClass("microphone-off")) {
        element.removeClass("microphone-off").addClass("microphone-on");
    }
}

function stopMicrophone(element) {
    if (element.hasClass("microphone-on")) {
        element.removeClass("microphone-on").addClass("microphone-off");
    }
}

function displayUserTranscript(transcript) {
    $(".home__container__transcript").find("ul").prepend(`<li class="transcript-container--user"><span class="transcript-container__transcript--user">${transcript}</span></li>`);
}

function displayAgentTranscript(transcript) {
    $(".home__container__transcript").find("ul").prepend(`<li class="transcript-container--agent"><span class="transcript-container__transcript--agent">${transcript}</span></li>`);
}