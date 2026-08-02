// ========================================
// 🌊 Waveform Ghost Trail Visualizer
// Compatível com Visualizer Core do Vih 💜
// ========================================

(function () {
  if (!window.Visualizers) window.Visualizers = {};

  // buffer persistente do ghost
  let ghostBuffer = null;

  window.Visualizers["waveform-ghost"] = function ({
    ctx,
    canvas,
    bufferLength,
    timeDataArray
  }) {
    // ===============================
    // 🎛 CONFIG (AJUSTE AQUI)
    // ===============================
    const CONFIG = {
      lineWidth: 2.0,
      glow: 0,
      amplitude: 0.6,

      smoothing: 0.8, // suavização da onda
      ghostFade: 0.08, // quanto o rastro some
      ghostAlpha: 0.845,
      glowPasses: 1
    };

    // ===============================
    // 🧠 cria buffer na primeira vez
    // ===============================
    if (!ghostBuffer) {
      ghostBuffer = new Float32Array(bufferLength);
      for (let i = 0; i < bufferLength; i++) {
        ghostBuffer[i] = timeDataArray[i];
      }
    }

    // ===============================
    // ✨ SMOOTHING
    // ===============================
    for (let i = 0; i < bufferLength; i++) {
      ghostBuffer[i] +=
        (timeDataArray[i] - ghostBuffer[i]) * CONFIG.smoothing;
    }

    // ===============================
    // 🌫️ FADE DO RASTRO (A MÁGICA)
    // ===============================
    ctx.fillStyle = `rgba(0, 0, 0, ${CONFIG.ghostFade})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ===============================
    // 🎨 cores do tema
    // ===============================
    const styles = getComputedStyle(document.body);
    const color = styles.getPropertyValue("--screen-text-color").trim();
    const glowColor = styles.getPropertyValue("--screen-text-glow").trim();

    ctx.strokeStyle = color;
    ctx.lineWidth = CONFIG.lineWidth;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = CONFIG.glow;
    ctx.globalAlpha = CONFIG.ghostAlpha;

    const sliceWidth = canvas.width / bufferLength;
    const amplitude = canvas.height * CONFIG.amplitude;

    // ===============================
    // ✨ MULTI PASS GLOW
    // ===============================
    for (let pass = 0; pass < CONFIG.glowPasses; pass++) {
      ctx.beginPath();

      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = ghostBuffer[i] / 128.0;
        const y = (v - 1) * amplitude + canvas.height / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };
})();