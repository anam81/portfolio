// bg-slideshow.js
const images = [
    "bg/water.jpg",
    "bg/sun2.jpg",
    "bg/air.jpg",
    "bg/soil3.jpg"
];

// Aktuellen Index aus localStorage laden
let current = parseInt(localStorage.getItem('bgCurrent')) || 0;

const bg1 = document.querySelector('.bg1');
const bg2 = document.querySelector('.bg2');

let topDiv = bg1;
let bottomDiv = bg2;

// Initiale Bilder basierend auf dem gespeicherten Index
topDiv.style.backgroundImage = `url("${images[current]}")`;

// Für bottomDiv das nächste Bild vorbereiten (crossfade)
const nextIndex = (current + 1) % images.length;
bottomDiv.style.backgroundImage = `url("${images[nextIndex]}")`;
bottomDiv.style.opacity = '0';

function changeBackground() {
    const next = (current + 1) % images.length;

    // Bottom Div vorbereiten
    bottomDiv.style.backgroundImage = `url("${images[next]}")`;
    bottomDiv.style.opacity = '0';

    // Crossfade starten
    setTimeout(() => {
        topDiv.style.opacity = '0';
        bottomDiv.style.opacity = '1';
    }, 50);

    // Rollen tauschen und Index speichern
    setTimeout(() => {
        [topDiv, bottomDiv] = [bottomDiv, topDiv];
        current = next;
        localStorage.setItem('bgCurrent', current);
    }, 7050); // leicht mehr als Transition-Dauer
}

// Alle 10 Sekunden wechseln
setInterval(changeBackground, 11000);