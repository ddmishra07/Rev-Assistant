let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

let pendingSearch = ""; // holds message to search if user says yes

function speak(text, callback) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "hi-IN";
    text_speak.onend = function () {
        if (callback) callback();
    };
    window.speechSynthesis.speak(text_speak);
}

function askAnythingElse() {
    speak("Anything else that I can help you with?", () => {
        recognition.start();
    });
}

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    console.log("Voice Input:", transcript);
    handleCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    voice.style.display = "block";
});

function handleCommand(message) {
    btn.style.display = "flex";
    voice.style.display = "none";

    // If waiting for confirmation to search
    if (pendingSearch) {
        if (message.includes("yes")) {
            window.open(`https://www.google.com/search?q=${pendingSearch}`);
            pendingSearch = "";
            askAnythingElse();
        } else if (message.includes("no")) {
            speak("Okay, I will listen again.", () => recognition.start());
            pendingSearch = "";
        } else {
            speak("Please say yes or no.", () => recognition.start());
        }
        return;
    }

    if (message.includes("what is rev400")) {
        speak("The RV400 is an AI enabled electric street bike from Revolt Motors, known for its sporty styling and smart features.");
        return;
    }

    if (message.includes("features of rev400")) {
        speak("The Revolt RV400 is India's first AI-enabled electric motorcycle. It features a 3.24 kilowatt hour swappable lithium battery, three ride modes, and a top speed of 85 kilometers per hour. It supports app-based controls, geo fencing, and artificial exhaust sounds.");
        return;
    }

    if (message.includes("open youtube")) {
        speak("Opening YouTube", () => {
            window.open("https://www.youtube.com/");
            askAnythingElse();
        });
    } else if (message.includes("open chatgpt")) {
        speak("Opening ChatGPT", () => {
            window.open("https://www.chatgpt.com/");
            askAnythingElse();
        });
    } else if (message.includes("open linkedin")) {
        speak("Opening LinkedIn", () => {
            window.open("https://www.linkedin.com/");
            askAnythingElse();
        });
    } else if (message.includes("open google")) {
        speak("Opening Google", () => {
            window.open("https://www.google.com/");
            askAnythingElse();
        });
    } else {
        // Instead of searching immediately, ask for confirmation
        pendingSearch = message;
        speak(`Should I search Google for ${message}? Please say yes or no.`, () => {
            recognition.start();
        });
    }
}
