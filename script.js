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
/* function renderGrid() {
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
} */
// Cache für die Thumbnail-URLs
// Cache aus LocalStorage laden oder leeren
const thumbnailCache = JSON.parse(localStorage.getItem("thumbnailCache") || "{}");

async function renderGrid() {
    grid.innerHTML = "";

    const promises = videos.map(async video => {
        if (video.id === currentVideo) return;

        const thumb = document.createElement("div");
        thumb.className = "thumb";

        const img = document.createElement("img");
        // 👉 ALT setzen
        img.alt = "Motion Design in After Effects, Köln / Cologne " + video.description;
        thumb.appendChild(img);

        // 👉 SOFORT hinzufügen (richtige Reihenfolge!)
        grid.appendChild(thumb);

        // danach async laden
        if (thumbnailCache[video.id]) {
            img.src = thumbnailCache[video.id];
        } else {
            try {
                const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${video.id}`);
                const data = await response.json();
                img.src = data.thumbnail_url;

                thumbnailCache[video.id] = data.thumbnail_url;
                localStorage.setItem("thumbnailCache", JSON.stringify(thumbnailCache));
            } catch (err) {
                console.error("Fehler beim Laden", video.id, err);
            }
        }

        thumb.onclick = () => {
            thumb.style.transition = "opacity 0.5s ease";
            thumb.style.opacity = 0;

            setTimeout(() => {
                loadVideo(video.id);
            }, 350);
        };
    });

    await Promise.all(promises);
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
        wrapper.classList.remove('video-16-10', 'video-4-3', 'video-1-1', 'video-235-100'); // alte Klassen entfernen
        if (vid.ratio && vid.ratio !== "16/9") {
            const className = 'video-' + vid.ratio.replace('/', '-');
            wrapper.classList.add(className);
        }
    }

    // Grid neu rendern
    renderGrid();

    // Nach oben scrollen zum Video (nur wenn nicht sichtbar)
    if (wrapper && !isElementInViewport(wrapper)) {
        window.scrollTo({
            top: wrapper.offsetTop - 20,
            behavior: 'smooth'
        });
    }
}
// -----------------------------
// Erstes Video laden
// -----------------------------
loadVideo(currentVideo);

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

