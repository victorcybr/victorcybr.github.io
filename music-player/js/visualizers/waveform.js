// ===============================
// 🌊 WAVEFORM VISUALIZER
// ===============================

// 🎛️ CONFIGURAÇÕES (Edite aqui à vontade)
const waveSettings = {
  // A Linha Principal (o fio elétrico)
  lineWidth: 2,        // Espessura da linha fina (0.5 a 2 fica top)
  lineColor: null,     // Se null, usa a cor do tema. Ou use "white", "#ff0000"
  
  // O Brilho (Glow)
  glowWidth: 3,        // Espessura da "fita" que gera o brilho (não a linha visível)
  glowBlur: 30,        // O quanto o brilho espalha
  glowPasses: 5,       // Quantas vezes desenhar o brilho (mais passes = mais forte)
  glowOpacity: 1,      // Transparência de cada camada de brilho (0.1 a 0.3)
  
  // Comportamento
  amplitude: 0.6,      // Altura da onda (0.1 a 1.0)
  smoothing: 0.8       // Suavização (0.1 = rápido, 0.9 = lento)
};

let smoothTimeData = null;

window.Visualizers.waveform = function ({
  ctx,
  canvas,
  bufferLength,
  timeDataArray
}) {
  // --- 1. MATEMÁTICA E SUAVIZAÇÃO ---
  if (!smoothTimeData || smoothTimeData.length !== bufferLength) {
    smoothTimeData = new Float32Array(bufferLength);
    for (let i = 0; i < bufferLength; i++) {
        smoothTimeData[i] = timeDataArray[i];
    }
  }

  for (let i = 0; i < bufferLength; i++) {
    smoothTimeData[i] += (timeDataArray[i] - smoothTimeData[i]) * waveSettings.smoothing;
  }

  // --- 2. DEFINIR O CAMINHO (PATH) ---
  // Calculamos os pontos APENAS UMA VEZ para economizar processamento
  ctx.beginPath();

  const sliceWidth = canvas.width / bufferLength;
  const h = canvas.height;
  const amp = h * waveSettings.amplitude;

  let x = 0;
  for (let i = 0; i < bufferLength; i++) {
    const v = smoothTimeData[i] / 128.0; 
    const y = (v - 1) * amp + h / 2;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    x += sliceWidth;
  }

  // --- 3. RENDERIZAÇÃO INTELIGENTE ---
  ctx.save(); // Salva o estado para não bagunçar outros efeitos

  // Captura as cores do CSS que vieram do visualizer.js
  const themeColor = ctx.strokeStyle; // Cor do texto
  const themeGlow = ctx.shadowColor;  // Cor do neon

  // -- FASE 1: O GLOW (INDEPENDENTE) --
  // Aqui usamos uma linha GROSSA e TRANSPARENTE apenas para gerar luz
  ctx.shadowColor = themeGlow;
  ctx.shadowBlur = waveSettings.glowBlur;
  ctx.lineWidth = waveSettings.glowWidth; // Linha grossa invisível
  ctx.strokeStyle = themeGlow; // O corpo do glow tem a cor do glow
  ctx.globalAlpha = waveSettings.glowOpacity; // Bem transparente para não ficar chapado
  
  // Desenha o brilho várias vezes para acumular força
  // "blendMode" screen ajuda a luz a somar de forma bonita
  // ctx.globalCompositeOperation = "screen"; 
  for (let i = 0; i < waveSettings.glowPasses; i++) {
     ctx.stroke();
  }

  // -- FASE 2: O NÚCLEO (A LINHA FINA) --
  // Agora desenhamos a linha real por cima
  ctx.globalCompositeOperation = "source-over"; // Volta ao normal
  ctx.globalAlpha = 1; // Opacidade total
  ctx.shadowBlur = 0;  // Sem blur no núcleo (fica nítido)
  ctx.lineWidth = waveSettings.lineWidth; // Espessura fina que você queria
  ctx.strokeStyle = waveSettings.lineColor || themeColor; // Cor do tema ou fixa
  
  ctx.stroke();

  ctx.restore(); // Limpa a bagunça
};