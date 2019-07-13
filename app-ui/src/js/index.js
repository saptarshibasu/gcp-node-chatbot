import style from "../sass/styles.scss";

$( document ).ready(function() {

});


$(".home__container__speech-btn").click(function () { 
    if($(this).find("i").hasClass("microphone-on")) {
      $(this).find("i").removeClass("microphone-on");
      $(this).find("i").addClass("microphone-off");
    } else {
      $(this).find("i").removeClass("microphone-off");
      $(this).find("i").addClass("microphone-on");
    }
    
});