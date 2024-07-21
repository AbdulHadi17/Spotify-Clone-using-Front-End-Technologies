

let currentSong = new Audio();
let play = document.getElementById("play");

let classlistOfpause = "fa-solid fa-pause";
let classlistOfplay = "fa-regular fa-circle-play";

let prevBtn = document.querySelector("#previous");
let nextBtn = document.querySelector("#next");
let songs;

let currentFolder = "";

// 

async function getSongs(folder) {

    currentFolder = folder;
    let a = await fetch(`/songs/${currentFolder}/`);
    let response = await a.text();
 

    let div = document.createElement("div");
    div.innerHTML = response;

    let list = div.getElementsByTagName("a");
    songs = [];

    

    for (let index = 0; index < list.length; index++) {
        const element = list[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
           
        }



    }

    let liFirstElement = document.querySelector(".songsLists").getElementsByTagName("ol");
    liFirstElement[0].innerHTML = "";
   


    for (const song in songs) {

        let liElement = document.createElement("li");
        liElement.innerText = songs[song];

        // console.log(liElement.innerText.split("/songs/")[1].replaceAll("%20" , ""));

        let clearedText = liElement.innerText.split(`/${currentFolder}/`)[1].replaceAll("%20", " ").replace(".mp3", "")
        // liElement.innerText = 

        liElement.innerHTML = `<div class="songs-info-container">
                                <i class="fa-solid fa-music"></i>
                                <div class="song-info"><p>${clearedText}</p>
                                <p>Abdul Hadi</p></div>
                                <div class="playnow">
                                    <p>Play Now</p>
                                    <i class="fa-regular fa-circle-play"></i>
                                </div>
                            </div>`
        // console.log(songs[song])
        liFirstElement[0].append(liElement);

    }


    Array.from(document.querySelector(".songsLists").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", evt => {

         
            let clickedsong = e.querySelector(".song-info").querySelector("p").innerText.trim();
            playMusic(clickedsong);
        })

    })



    if (currentSong) {

        play.addEventListener("click", e => {

           
          
            if (currentSong.paused) {
                currentSong.play();
                play.classList.value = classlistOfpause;

            }
            else {

                currentSong.pause();
                play.classList.value = classlistOfplay;
            }
        })




    }


    currentSong.addEventListener("timeupdate", e => {


        let elapsedTime = timeFormatChanger(currentSong.currentTime);
        let FullTime = timeFormatChanger(currentSong.duration);

        document.querySelector(".musictime").innerText = `${elapsedTime} / ${FullTime}`;



        document.querySelector(".circle").style.left = `${(currentSong.currentTime / currentSong.duration) * 100}%`;


    })

    let seekBar = document.querySelector(".seekbar");

    seekBar.addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

       

        currentSong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * currentSong.duration;
    })

    document.querySelector("#close").addEventListener("click", e => {

        document.querySelector(".left").style.left = "-120%";

    })

    document.querySelector("#menu").addEventListener("click", e => {

        document.querySelector(".left").style.left = "0px";
    })




    // Previous Button Aaction Listener


    prevBtn.addEventListener("click", e => {

        currentSong.pause();
        


        if (currentSong.src != "") {
            //currentSong.pause();


            let currIndex = songs.indexOf(currentSong.src);
            if (currIndex <= 0) {
                currIndex = 1;
            }
            let prevsrc = songs[currIndex - 1];

            let b = prevsrc.split(`/${currentFolder}/`)[1];
            b = b.replaceAll("%20", " ");
            b = b.replace(".mp3", "");

            playMusic(b);


        }
    })


    // Next Button Aaction Listener
    nextBtn.addEventListener("click", e => {
        currentSong.pause();

        if (currentSong.src != "") {


            let currIndex = songs.indexOf(currentSong.src);
            if (currIndex >= songs.length - 1) {
                currIndex = (songs.length - 2);
            }
            let prevsrc = songs[currIndex + 1];

            let b = prevsrc.split(`/${currentFolder}/`)[1];
            b = b.replaceAll("%20", " ");
            b = b.replace(".mp3", "");

            if (!(currIndex >= songs.length - 1)) {

                //  currentSong.pause();
                playMusic(b);
            }



        }


    })



}

async function displayAlbums() {

    let a = await fetch(`/songs/`);
    let response = await a.text();
   

    let div = document.createElement("div");
    div.innerHTML = response;

   
    let array =  Array.from(div.getElementsByTagName("a"));
       
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        console.log(e);

            if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
               

                let folder = e.href.split("/").slice(-2)[0];

                if(folder == ""){
                    folder = "ncs";
                }
                let cardContainer = document.querySelector(".cards-container");
                
                let a = await fetch(`/songs/${folder}/info.json`);
                let response = await a.json();
              
                cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "${folder}" class="card">

                        <div class="circleplay">
                            <i class="fa-solid fa-play"></i>
                        </div>

                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
            }
        }

        Array.from(document.querySelectorAll(".card")).forEach(e => {
            e.addEventListener("click", async e => {
    
    
    
                await getSongs(e.currentTarget.dataset.folder);
                document.querySelector(".left").style.left = "0px";

                
    
            })
        })

}


function timeFormatChanger(time) {


    let minutes = Math.floor(time / 60);
    let remainingSeconds = Math.floor(time % 60);

    // Pad with leading zeros if necessary
    let minutesStr = String(minutes).padStart(2, '0');
    let secondsStr = String(remainingSeconds).padStart(2, '0');



    if (minutesStr == "NaN" && secondsStr == "NaN") {
        minutesStr = "00";
        secondsStr = "00";
    }

    return `${minutesStr}:${secondsStr}`;

}

async function playMusic(clickedsong) {

    currentSong.pause();
    currentSong.src = `/songs/${currentFolder}/${clickedsong}.mp3`;

   
    await currentSong.play();
    play.classList.value = classlistOfpause;

    document.querySelector(".musictitle").innerText = clickedsong + ".mp3";


}


async function main() {
    //await getSongs("cs");





    // audio.play();
    displayAlbums();



    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", e => {

       
        currentSong.volume = e.target.value / 100;
    })


    



}






main();






