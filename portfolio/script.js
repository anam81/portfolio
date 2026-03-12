// -----------------------------
// 1️⃣ Header/Footer dynamisch laden
// -----------------------------
function loadHTML(id, url) {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            // ✅ Header geladen? dann active-Klasse setzen
            if (id === "headerContainer") {
                const menuLinks = document.querySelectorAll(".menu li a");
                const currentPage = window.location.pathname.split("/").pop(); // z.B. "index.html"

                menuLinks.forEach(link => {
                    // Nur relative Links markieren
                    if (link.getAttribute("href") === currentPage) {
                        link.parentElement.classList.add("active");
                    } else {
                        link.parentElement.classList.remove("active");
                    }
                });
            }

            // Footer geladen? dann Jahr setzen
            if (id === "footerContainer") {
                const yearSpan = document.getElementById("year");
                if (yearSpan) yearSpan.textContent = new Date().getFullYear();
            }
        })
        .catch(err => console.error("Fehler beim Laden von", url, err));
}

loadHTML("headerContainer", "header.html");
loadHTML("footerContainer", "footer.html");

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

