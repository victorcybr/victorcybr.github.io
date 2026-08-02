const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const tracks = [
  {
    title: "Balrog Theme",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/fufxxj.mp3"
  },
  {
    title: "Disco Train",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/hjrkzb.mp3"
  },
  {
    title: "Fear Factory",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/a3vp8v.mp3"
  },
  {
    title: "Boomer Kuwanger",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/0vvvjt.mp3"
  },
  {
    title: "Cammy Theme",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/l8a6a6.mp3"
  },
  {
    title: "Don't Ever Forget",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/1inuz9.mp3"
  },
  {
    title: "Psylocke Theme",
    artist: "VictorCYBR",
    src: "https://files.catbox.moe/3w7qep.mp3"
  },
  {
    title: "Makenai Ai Ga Kitto Aru",
    artist: "VictorCYBR, IA, Hatsune Miku",
    src: "https://files.catbox.moe/tlh1f6.mp3"
  }
];


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

shuffle(tracks);
let currentTrack = 0;
let isPlaying = false;

function loadTrack(index) {
  audio.src = tracks[index].src;
  document.getElementById("track-title").textContent = tracks[index].title;
  document.getElementById("track-artist").textContent = tracks[index].artist;
}

function playTrack() {
  audio.play();
  playBtn.textContent = "⏸";
  isPlaying = true;
}

function pauseTrack() {
  audio.pause();
  playBtn.textContent = "▶";
  isPlaying = false;
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseTrack() : playTrack();
});

nextBtn.addEventListener("click", () => {
  currentTrack++;

  if (currentTrack >= tracks.length) {
    shuffle(tracks); // embaralha de novo quando acaba
    currentTrack = 0;
  }

  loadTrack(currentTrack);
  playTrack();
});

prevBtn.addEventListener("click", () => {
  currentTrack--;

  if (currentTrack < 0) {
    currentTrack = tracks.length - 1;
  }

  loadTrack(currentTrack);
  playTrack();
});


audio.addEventListener("ended", () => {
  nextBtn.click();
});


// carrega a primeira música
loadTrack(currentTrack);
