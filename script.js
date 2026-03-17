// -----------------------------
// Header/Footer dynamisch laden + active setzen + Lottie Hover
// -----------------------------
function loadHTML(id, url) {
    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`Fehler beim Laden von ${url}`);
            return res.text();
        })
        .then(data => {
            // HTML einfügen
            document.getElementById(id).innerHTML = data;

            // -----------------------------
            // Header: active-Klasse setzen + Lottie
            // -----------------------------
            if (id === "headerContainer") {
                const currentPage = document.body.dataset.page;

                // Menü Links prüfen
                document.querySelectorAll(".menu a[data-page]").forEach(link => {
                    if (link.dataset.page === currentPage) {
                        link.parentElement.classList.add("active");
                    } else {
                        link.parentElement.classList.remove("active");
                    }
                });

                // Lottie Animation starten
                const logoOverlay = document.getElementById('logo-overlay');
                if (logoOverlay) {
                    setTimeout(() => {
                        const logoAnim = lottie.loadAnimation({
                            container: logoOverlay,
                            renderer: 'svg',
                            loop: false,
                            autoplay: true,
                            path: 'assets/logo.json'
                        });

                    }, 850); // 1 Sekunde Verzögerung

                    // Hover → Animation neu starten
                    /* logoOverlay .addEventListener('mouseenter', () => {
                        logoAnim.stop(); // zurück auf Frame 0
                        logoAnim.play(); // Animation starten
                    }); */
                }
            }

            // -----------------------------
            // Footer: Jahr automatisch setzen
            // -----------------------------
            if (id === "footerContainer") {
                const yearSpan = document.getElementById("year");
                if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            }
        })
        .catch(err => console.error(err));
}

// -----------------------------
// Header und Footer laden
// -----------------------------
loadHTML("headerContainer", "/header.html");
loadHTML("footerContainer", "/footer.html");


// -----------------------------
// 2️⃣ Video Grid & Wechsel (alte Logik)
// -----------------------------
const player = document.getElementById("mainPlayer");
const grid = document.getElementById("videoGrid");
const descriptionEl = document.getElementById("videoDescription");
let currentVideo = videos[0].id;

// -----------------------------
// Grid rendern
// -----------------------------
function renderGrid() {
    grid.innerHTML = "";

    videos.forEach(video => {
        if (video.id === currentVideo) return; // aktuelles Video ausblenden

        const thumb = document.createElement("div");
        thumb.className = "thumb";

        const img = document.createElement("img");
        img.src = `https://vumbnail.com/${video.id}.jpg`;
        thumb.appendChild(img);

        thumb.onclick = () => loadVideo(video.id);

        grid.appendChild(thumb);
    });
}

// -----------------------------
// Zentrale Funktion zum Videowechsel
// -----------------------------
function loadVideo(id) {
    currentVideo = id;

    const vid = videos.find(v => v.id === id);
    if (!vid) return;

    // Player src setzen
    player.src = `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&color=dd5424`;

    // Beschreibung setzen
    descriptionEl.innerHTML = vid.description || "";

    // Wrapper-Klasse für Ratio setzen
    const wrapper = document.querySelector('.video-wrapper');
    if (wrapper) {
        wrapper.classList.remove('video-16-10', 'video-4-3'); // alte Klassen entfernen
        if (vid.ratio && vid.ratio !== "16/9") {
            const className = 'video-' + vid.ratio.replace('/', '-');
            wrapper.classList.add(className);
        }
    }

    // Grid neu rendern
    renderGrid();
}
// -----------------------------
// Erstes Video laden
// -----------------------------
loadVideo(currentVideo);

