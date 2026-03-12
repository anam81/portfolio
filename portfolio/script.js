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
                const logoEl = document.getElementById('logo-lottie');
                if (logoEl) {
                    // Lottie Container sichtbar machen
                    logoEl.style.pointerEvents = "auto";

                    const logoAnim = lottie.loadAnimation({
                        container: logoEl,
                        renderer: 'svg',
                        loop: false,
                        autoplay: true,
                        path: '/logo.json' // Pfad ggf. anpassen
                    });

                    // Hover → Animation neu starten
                    /* logoEl.addEventListener('mouseenter', () => {
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

const player = document.getElementById("mainPlayer")
const grid = document.getElementById("videoGrid")
const descriptionEl = document.getElementById("videoDescription")
let currentVideo = videos[0].id
// initial Beschreibung setzen
descriptionEl.innerHTML = videos.find(v => v.id === currentVideo).description || ""

function renderGrid() {

    grid.innerHTML = ""

    videos.forEach(video => {

        if (video.id === currentVideo) return

        const thumb = document.createElement("div")
        thumb.className = "thumb"

        const img = document.createElement("img")
        img.src = `https://vumbnail.com/${video.id}.jpg`

        thumb.appendChild(img)

        thumb.onclick = () => {
            // Video sofort wechseln
            currentVideo = video.id
            player.src = `https://player.vimeo.com/video/${video.id}?title=0&byline=0&portrait=0&color=dd5424`

            // Beschreibung mit HTML-Link setzen
            descriptionEl.innerHTML = video.description || ""

            // geklicktes Thumb ausblenden
            thumb.style.transition = "opacity 0.5s ease"
            thumb.style.opacity = 0

            // nach 0.5s Grid neu rendern
            setTimeout(() => {
                renderGrid()
            }, 350)
        }

        grid.appendChild(thumb)

    })

}

function loadVideo(id) {
    currentVideo = id
    player.src = `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&color=dd5424`

    // Beschreibung setzen
    const vid = videos.find(v => v.id === id)
    descriptionEl.innerHTML = vid.description || ""  // nur hier

    renderGrid()
}

renderGrid()

