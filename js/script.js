console.log("Your script.js file is executing.");

let currentSong = new Audio();

let songs;
let currentFolder;

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Ensure the input is an integer
  seconds = Math.floor(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the remaining seconds to always have two digits
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  // Format the remaining minutes to always have two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}`); ////////////////////////////////////////////////
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  //   let tds = div.getElementsByTagName("td");
  //   console.log(tds);
  let as = div.getElementsByTagName("a");
  // console.log(as);

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //show all songs in the playlist
  let songUl = document
    .querySelector(".library_content")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>

                  <img src="./svg/music.svg" alt="" />
                  <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Honey Singh</div>
                  </div>
                  <div class="play_now">
                    <img src="./svg/play_icon.svg" alt="" />
                  </div>

         </li>`;
  }

  // attach an event listener to each song
  Array.from(
    document.querySelector(".library_content").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "./svg/pause.svg";
  }
  document.querySelector(".song_info").innerHTML = decodeURI(
    track.split("-")[0]
  );
  document.querySelector(".song_time").innerHTML = "00:00/00:00";
};

// async function displayAlbums() {
//   let a = await fetch(`http://127.0.0.1:3000/songs/`);
//   let response = await a.text();

//   let div = document.createElement("div");
//   div.innerHTML = response;
//   let anchors = div.getElementsByTagName("a");
//   let primary_playlists = document.querySelector(".primary_playlists");
//   let array = Array.from(anchors);

//   for (let index = 0; index < array.length; index++) {
//     const e = array[index];

//     if (e.href.includes("/songs/")) {
//       // console.log(e.href.split("/")[5]);
//       let folder = e.href.split("/")[5];
//       //get the metadata of the folder
//       let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
//       let response = await a.json();
//       console.log(response);
//       primary_playlists.innerHTML =
//         primary_playlists.innerHTML +
//         `<div data-folder="${folder}" class="cards">
//               <img class="greenPlay_icon" src="./svg/greenPlay.svg" alt="" />
//               <img
//                 class="artist_image"
//                 src="/songs/${folder}/cover.jpg"
//                 alt=""
//               />
//               <h2>${response.title}</h2>
//               <p>${response.description}</p>
//             </div>`;
//     }
//   }
//   //load the playlist whenever the card is clicked
//   Array.from(document.getElementsByClassName("cards")).forEach((e) => {
//     e.addEventListener("click", async (item) => {
//       // console.log(e);
//       // console.log(item.currentTarget);
//       // console.log(item.currentTarget.dataset.folder);
//       songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
//       playMusic(songs[0]);
//       // console.log(item);
//       // console.log(item.currentTarget);
//       // console.log(item.currentTarget.dataset);
//     });
//   });
// }

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let primary_playlists = document.querySelector(".primary_playlists");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/")[4]; // Adjusted split index

      try {
        let metadataResponse = await fetch(
          `http://127.0.0.1:3000/songs/${folder}/info.json`
        );
        if (!metadataResponse.ok) continue; // Skip if JSON does not exist

        let metadata = await metadataResponse.json();

        let card = document.createElement("div");
        card.classList.add("cards");
        card.dataset.folder = folder;
        card.innerHTML = `
              <img class="greenPlay_icon" src="./svg/greenPlay.svg" alt="" />
              <img class="artist_image" src="/songs/${folder}/cover.jpg" alt="" />
              <h2>${metadata.title}</h2>
              <p>${metadata.description}</p>
        `;

        primary_playlists.appendChild(card);
      } catch (error) {
        console.error(`Error loading metadata for ${folder}:`, error);
      }
    }
  }

  // Attach event listener to load songs when clicking an album
  document.querySelectorAll(".cards").forEach((card) => {
    card.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${card.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  //get the list of all songs
  await getSongs("songs/ncs");
  playMusic(songs[0], true);
  //   console.log(songs);

  //display all the albums on the page
  displayAlbums();

  // //show all songs in playlist
  // let songUl = document
  //   .querySelector(".library_content")
  //   .getElementsByTagName("ul")[0];
  // for (const song of songs) {
  //   songUl.innerHTML =
  //     songUl.innerHTML +
  //     `<li>

  //               <img src="./svg/music.svg" alt="" />
  //               <div class="info">
  //                 <div>${song.replaceAll("%20", " ")}</div>
  //                 <div>Honey Singh</div>
  //               </div>
  //               <div class="play_now">
  //                 <img src="./svg/play_icon.svg" alt="" />
  //               </div>

  //      </li>`;
  // }

  //play the first song
  var audio = new Audio(songs[0]);
  //   audio.play();

  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    // console.log(duration);
    // The duration variable now holds the duration (in seconds) of the audio clip
  });

  // // attach an event listener to each song
  // Array.from(
  //   document.querySelector(".library_content").getElementsByTagName("li")
  // ).forEach((e) => {
  //   e.addEventListener("click", (element) => {
  //     console.log(e.querySelector(".info").firstElementChild.innerHTML);
  //     playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
  //   });
  // });

  // attach an event listener to play, next, previous buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "./svg/pause.svg";
    } else {
      currentSong.pause();
      play.src = "./svg/play_icon.svg";
    }
  });

  //attach an event listener to calculate the current time and duration of the song
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".song_time").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // add event listener to seek bar
  document.querySelector(".seek_bar").addEventListener("click", (e) => {
    // console.log(e.offsetX);
    let percentage = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percentage + "%";
    currentSong.currentTime = (currentSong.duration * percentage) / 100;
  });

  //add event listener for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".secondary").style.left = "0";
  });

  //add event listener for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".secondary").style.left = "-100%";
  });

  //add eventlistener for previous button
  previous.addEventListener("click", () => {
    console.log("previous button is clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //add eventlistener for next button             ///  chatgpt in this function to don't stop the song if it is the last song and next button is clicked instead just keep playing the last song
  next.addEventListener("click", () => {
    console.log("next button is clicked");
    // console.log(currentSong);
    // console.log(
    //   currentSong.src.split("/").slice("-1")[0].replaceAll("%20", " ")
    // );
    let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0]);
    if (index + 1 > length) {
      playMusic(songs[index + 1]);
    }
  });

  //add event listener to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      // console.log("Setting volume to ", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  //add event listener to mute the volume
  document.querySelector("#volume_icon").addEventListener("click", (e) => {
    console.log(e.target);
    if (e.target.src.includes("/svg/volume.svg")) {
      e.target.src = e.target.src.replace("/svg/volume.svg", "/svg/mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("/svg/mute.svg", "/svg/volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
  console.log("hello");
}

main();
