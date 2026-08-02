function cssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function hexToRgba(hex, alpha = 1) {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex.split("").map(c => c + c).join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// ===============================
// 🎵 PLAYLIST (EDITE AQUI)
// ===============================
const tracks = [
  { artist: "VictorCYBR", title: "Disco Train", src: "https://files.catbox.moe/hjrkzb.mp3" },
  { artist: "VictorCYBR", title: "Fear Factory", src: "https://files.catbox.moe/a3vp8v.mp3" },
  { artist: "VictorCYBR", title: "Boomer Kuwanger", src: "https://files.catbox.moe/0vvvjt.mp3" },
  { artist: "VictorCYBR", title: "Cammy Theme", src: "https://files.catbox.moe/l8a6a6.mp3" },
  { artist: "VictorCYBR", title: "Unwavering Heart / Emotion", src: "https://files.catbox.moe/iqj0rl.mp3" },
  { artist: "VictorCYBR", title: "Don't Ever Forget (Lo-Fi)", src: "https://files.catbox.moe/1inuz9.mp3" },
  { artist: "VictorCYBR", title: "Psylocke Theme", src: "https://files.catbox.moe/3w7qep.mp3" },
  { artist: "VictorCYBR", title: "Makenai Ai Ga Kitto Aru", src: "https://files.catbox.moe/tlh1f6.mp3" },
  { artist: "VictorCYBR", title: "Balrog Theme", src: "https://files.catbox.moe/fufxxj.mp3" },
  { artist: "VictorCYBR", title: "Mattrex / Burn Dinorex", src: "https://files.catbox.moe/eycdny.mp3" },
];

let playOrder = tracks.map((_, i) => i);
let currentIndex = 0;
let isShuffle = false;
let dragging = false;


// ===============================
// 🎯 ELEMENTOS
// ===============================
const audio = document.getElementById("audio");
audio.crossOrigin = "anonymous";

const nowPlayingEl = document.getElementById("now-playing");
const artistEl = document.getElementById("artist");
const trackEl = document.getElementById("track");
const statusEl = document.getElementById("status");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

const playlistEl = document.getElementById("playlist");

const playBtn = document.getElementById("playpause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const stopBtn = document.getElementById("stop");
const shuffleBtn = document.getElementById("shuffle");
const muteBtn = document.querySelector(".mute");
const volumeSlider = document.getElementById("volume");

const wrap = document.querySelector(".seeker-wrap");
const seeker = document.querySelector(".seeker");
const fill = document.querySelector(".seeker-fill");
const thumb = document.querySelector(".seeker-thumb");

// ===============================
// ⏱️ UTIL
// ===============================
function formatTime(sec) {
  if (isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// ===============================
// 🎵 LOAD TRACK
// ===============================
function loadTrackByOrder(orderIndex) {
  const trackIndex = playOrder[orderIndex];
  const t = tracks[trackIndex];

  audio.src = t.src;
  artistEl.textContent = t.artist;
  trackEl.textContent = t.title;

  statusEl.textContent = "Stopped";

  audio.currentTime = 0;
  audio.load();

  renderPlaylist();

  autoScrollText(nowPlayingEl);
}

function playTrack() {
  initVisualizer(); // ⭐ inicia visualizer com segurança

  const p = audio.play();
  if (p) p.catch(() => {});
  statusEl.textContent = "Playing";
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
}

function pauseTrack() {
  audio.pause();
  statusEl.textContent = "Paused";
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function stopTrack() {
  audio.pause();
  audio.currentTime = 0;
  statusEl.textContent = "Stopped";
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

// ===============================
// 📜 AUTO SCROLL TEXTO
// ===============================
function autoScrollText(element) {
  // 1. Limpa timers anteriores caso o usuário troque de música muito rápido
  if (element.scrollTimer) clearTimeout(element.scrollTimer);
  if (element.resetTimer) clearTimeout(element.resetTimer);

  // 2. Reseta a posição instantaneamente (sem animação)
  element.style.transition = 'none';
  element.style.transform = 'translateX(0)';

  // 3. Dá um tempo mínimo para o navegador renderizar o novo texto na tela
  setTimeout(() => {
    // Calcula o espaço do container e o tamanho real do texto
    const containerWidth = element.parentElement.clientWidth;
    const textWidth = element.scrollWidth;

    // Só anima se o texto for maior que o container
    if (textWidth > containerWidth) {
      const distance = textWidth - containerWidth + 15; // 15px de margem no final
      const speed = distance / 45; // Define a velocidade (45px por segundo)

      // 4. Espera 2 segundos (2000ms) antes de começar a rolar
      element.scrollTimer = setTimeout(() => {
        // Aplica o movimento
        element.style.transition = `transform ${speed}s linear`;
        element.style.transform = `translateX(-${distance}px)`;

        // 5. Quando terminar de rolar, espera 2 segundos, volta ao início e repete
        element.resetTimer = setTimeout(() => {
           autoScrollText(element); // Chama a função de novo, criando um loop
        }, (speed * 1000) + 2000); 

      }, 2000);
    }
  }, 50);
}

// ===============================
// ⏭️ NEXT / PREV
// ===============================
function nextTrack() {
  currentIndex = (currentIndex + 1) % playOrder.length;
  loadTrackByOrder(currentIndex);
  playTrack();
}

function prevTrack() {
  currentIndex = (currentIndex - 1 + playOrder.length) % playOrder.length;
  loadTrackByOrder(currentIndex);
  playTrack();
}

// ===============================
// 🔀 SHUFFLE
// ===============================
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);

  if (isShuffle) {
    playOrder = shuffleArray(tracks.map((_, i) => i));
  } else {
    playOrder = tracks.map((_, i) => i);
  }

  currentIndex = 0;
  loadTrackByOrder(currentIndex);
});

// ===============================
// 🎚️ SEEKER
// ===============================
function updateSeekerVisual(percent) {
  fill.style.width = percent * 100 + "%";

  const seekerRect = seeker.getBoundingClientRect();
  const wrapRect = wrap.getBoundingClientRect();
  const thumbWidth = thumb.offsetWidth;

  const min = thumbWidth / 2;
  const max = seekerRect.width - thumbWidth / 2;
  const x = min + percent * (max - min);

  const thumbPixelX = seekerRect.left - wrapRect.left + x;
  thumb.style.left = thumbPixelX + "px";
}

function updateSeekerFromMouse(clientX) {
  const rect = seeker.getBoundingClientRect();
  let percent = (clientX - rect.left) / rect.width;
  percent = Math.max(0, Math.min(1, percent));

  updateSeekerVisual(percent);

  if (audio.duration) {
    audio.currentTime = percent * audio.duration;
  }
}

// ===============================
// 🎧 EVENTOS ÁUDIO
// ===============================
audio.addEventListener("timeupdate", () => {
  if (dragging) return;

  const percent = audio.currentTime / audio.duration;
  updateSeekerVisual(percent);

  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", nextTrack);

// ===============================
// 🖱️ DRAG SEEKER
// ===============================
wrap.addEventListener("mousedown", (e) => {
  dragging = true;
  updateSeekerFromMouse(e.clientX);
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  updateSeekerFromMouse(e.clientX);
});

window.addEventListener("mouseup", () => {
  dragging = false;
});

// ===============================
// 🔘 BOTÕES
// ===============================
playBtn.addEventListener("click", () => {
  if (audio.paused) playTrack();
  else pauseTrack();
});

stopBtn.addEventListener("click", stopTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.classList.toggle("active", audio.muted);
});

volumeSlider.addEventListener("input", (e) => {
  audio.volume = Number(e.target.value);
});

// ===============================
// 🚀 PLAYLIST
// ===============================
function renderPlaylist() {
  playlistEl.innerHTML = "";

  playOrder.forEach((trackIndex, orderIndex) => {
    const track = tracks[trackIndex];

    const item = document.createElement("div");
    item.className = "playlist-item";
    item.textContent = `${orderIndex + 1}. ${track.artist} - ${track.title}.mp3`;

    if (orderIndex === currentIndex) {
      item.classList.add("active");
    }

    item.addEventListener("click", () => {
      currentIndex = orderIndex;
      loadTrackByOrder(currentIndex);
      playTrack();
    });

    playlistEl.appendChild(item);
  });
}

function shuffleArray(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===============================
// 🎨 THEME SWITCHER (OTIMIZADO)
// ===============================
const themeSelect = document.getElementById("theme");
const THEME_KEY = "player-theme";

function applyTheme(themeName) {
  // 1. Primeiro, removemos TODAS as classes de tema que existem no select
  // Isso evita que você tenha que escrever uma por uma no remove()
  const allThemes = Array.from(themeSelect.options)
    .map(option => option.value) // Pega o valor de cada opção
    .filter(value => value !== ""); // Ignora o valor vazio (Default)

  document.body.classList.remove(...allThemes);

  // 2. Adiciona a nova classe APENAS se não for o tema padrão (vazio)
  if (themeName) {
    document.body.classList.add(themeName);
  }
  
  // Se for vazio, o CSS :root padrão assume o controle automaticamente
  // porque removemos as outras classes acima.
}

// Quando mudar o select
themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;
  
  applyTheme(selectedTheme);
  localStorage.setItem(THEME_KEY, selectedTheme);
});

// Carregar tema salvo ao iniciar
function loadSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);

  // Se existir algo salvo, aplica. Se não, o HTML já está no padrão.
  if (saved !== null) {
    themeSelect.value = saved; // Atualiza o select visualmente
    applyTheme(saved);         // Aplica no body
  }
}

// Inicializa a função de carregar
loadSavedTheme();


// ===============================
// 🚀 INIT
// ===============================
window.addEventListener("load", () => {
  loadSavedTheme(); // ⭐ IMPORTANTE
  loadTrackByOrder(currentIndex);
  updateSeekerVisual(0);
  renderPlaylist();
});

audio.volume = Number(volumeSlider.value);