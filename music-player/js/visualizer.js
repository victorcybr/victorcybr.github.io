// ===============================
// 🌌 VISUALIZER CORE
// ===============================

window.Visualizers = {};

// Configurações
const VIZ_KEY = "viz-mode";
const canvas = document.getElementById("visualizer-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// Audio Context
let audioContext;
let analyser;
let source;
let dataArray;     // Para dados de frequência (Barras)
let timeDataArray; // Para dados de tempo (Waveform) - Novo!
let bufferLength;
let visualizerStarted = false;

// Lista de efeitos (nomes devem bater com os arquivos na pasta visualizers)
const visualizerList = [
  "bars",
  "waveform"
];

// Carrega o modo salvo ou usa 0 (primeiro da lista)
let visualizerMode = parseInt(localStorage.getItem(VIZ_KEY) || 0);

// ===============================
// INIT
// ===============================
function initVisualizer() {
  if (visualizerStarted || !canvas) return;

  // Cria o contexto de áudio se não existir
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    
    // Conecta no elemento de áudio do player.js
    const audio = document.getElementById("audio");
    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256; 
    bufferLength = analyser.frequencyBinCount;
    
    // Aloca memória apenas uma vez
    dataArray = new Uint8Array(bufferLength);
    timeDataArray = new Uint8Array(bufferLength);
  }

  visualizerStarted = true;
  requestAnimationFrame(drawVisualizer);
}

// ===============================
// DRAW LOOP
// ===============================
function drawVisualizer() {
  if (!visualizerStarted) return;

  requestAnimationFrame(drawVisualizer);

  // Limpa o canvas
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Estilos globais (pegando do CSS)
  const color = getComputedStyle(document.body).getPropertyValue("--screen-text-color").trim();
  const glow = getComputedStyle(document.body).getPropertyValue("--screen-text-glow").trim();

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.shadowColor = glow;

  // Pega os dados de áudio
  analyser.getByteFrequencyData(dataArray);   // Graves/Agudos
  analyser.getByteTimeDomainData(timeDataArray); // Onda sonora

  // Chama o efeito atual
  const name = visualizerList[visualizerMode];
  const vizFunction = window.Visualizers[name];

  if (vizFunction) {
    vizFunction({
      ctx,
      canvas,
      bufferLength,
      dataArray,     // Passamos as frequências
      timeDataArray  // Passamos a onda temporal (pra não precisar pegar de novo no waveform.js)
    });
  }
}

// ===============================
// 🎛️ CONTROLES DE TROCA
// ===============================
function changeVisualizer(direction) {
  if (direction === "next") {
    visualizerMode = (visualizerMode + 1) % visualizerList.length;
  } else {
    visualizerMode = (visualizerMode - 1 + visualizerList.length) % visualizerList.length;
  }
  // Salva no navegador
  localStorage.setItem(VIZ_KEY, visualizerMode);
}

const vizPrevBtn = document.getElementById("viz-prev");
const vizNextBtn = document.getElementById("viz-next");

if (vizPrevBtn) vizPrevBtn.addEventListener("click", () => changeVisualizer("prev"));
if (vizNextBtn) vizNextBtn.addEventListener("click", () => changeVisualizer("next"));