// -----------------------------
// 1️⃣ Header/Footer dynamisch laden
// -----------------------------
function loadHTML(id, url) {
    fetch(url)
        .then(res => res.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

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

const videos = [

{ id:"43720180", title:"demoreel"},
{ id:"760828515", title:"from outside"},
{ id: "159606491", title: "impulses" },
{ id: "259777046", title: "the tri drank the angle" },
{ id: "363118107", title: "circulation" },
{ id:"141259204", title:"der weg ist das ziel"},
{ id:"760855186", title:"pbm.radio"},
{ id:"6798661", title:"aviarium"},
{ id:"13058458", title:"ejercicio nocturno"},
{ id:"60821187", title:"algorhythmus"},
{ id:"115930638", title:"demoreel 2"}

]

const player = document.getElementById("mainPlayer")
const grid = document.getElementById("videoGrid")

let currentVideo = videos[0].id

function renderGrid(){

grid.innerHTML=""

videos.forEach(video=>{

if(video.id === currentVideo) return

const thumb = document.createElement("div")
thumb.className="thumb"

const img = document.createElement("img")
img.src=`https://vumbnail.com/${video.id}.jpg`

thumb.appendChild(img)

thumb.onclick=()=>{
loadVideo(video.id)
}

grid.appendChild(thumb)

})

}

function loadVideo(id){

currentVideo=id

player.src=`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&color=dd5424`

renderGrid()

}

renderGrid()

