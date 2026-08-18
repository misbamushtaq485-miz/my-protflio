let welcomeBtn = document.getElementById("welcomeBtn");

let message = document.getElementById("message");


welcomeBtn.onclick = function() {

    message.textContent = "Welcome to my portfolio!";

};
let sendBtn = document.getElementById("sendBtn");

let contactMessage = document.getElementById("contactMessage");


sendBtn.onclick = function() {

    contactMessage.textContent = "Thank you for contacting me!";

};
function showSection(sectionId) {

    document.getElementById("home").style.display = "none";
    document.getElementById("about").style.display = "none";
    document.getElementById("skills").style.display = "none";
    document.getElementById("projects").style.display = "none";
    document.getElementById("contact").style.display = "none";
    document.getElementById("learning").style.display = "none";
    document.getElementById("goals").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}

let darkBtn = document.getElementById("darkBtn");

darkBtn.onclick = function() {

    document.body.classList.toggle("dark-mode");

};
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", function() {

    sections.forEach(function(section) {

        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop < window.innerHeight - 100) {
            section.classList.add("show");
        }

    });

});
let text = "Information Technology Student";
let i = 0;

function typingEffect() {
    if (i < text.length) {
        document.getElementById("typingText").innerHTML += text.charAt(i);
        i++;
        setTimeout(typingEffect, 100);
    }
}

typingEffect();
window.onscroll = function() {
    let scrollTop = document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight -
                 document.documentElement.clientHeight;

    let progress = (scrollTop / height) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";
};
window.onscroll = function() {

    let scrollTop = document.documentElement.scrollTop;

    let height = document.documentElement.scrollHeight -
                 document.documentElement.clientHeight;

    let progress = (scrollTop / height) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";
};