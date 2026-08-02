// ========================================
// 🌅 Synthwave Grid Visualizer
// feito pra vibe do Vih 💜⚡
// ========================================

(function () {
  if (!window.Visualizers) window.Visualizers = {};

  // animação contínua do grid
  let gridOffset = 0;

  window.Visualizers["synthwave-grid"] = function ({
    ctx,
    canvas,
    bufferLength,
    dataArray
  }) {
    // ===============================
    // 🎛 CONFIG (AJUSTE LIVRE)
    // ===============================
    const CONFIG = {
      horizonY: 0.58,      // posição do horizonte
      gridSpacing: 10,     // distância das linhas
      gridSpeed: 0.15,      // velocidade do grid
      glow: 0,
      lineWidth: 2.0,
      bassImpact: 2.0      // quanto o grave afeta o grid
    };

    // ===============================
    // 🧹 limpa (esse visualizer limpa normal)
    // ===============================
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ===============================
    // 🎨 cores do tema
    // ===============================
    const styles = getComputedStyle(document.body);
    const color = styles.getPropertyValue("--screen-text-color").trim();
    const glowColor = styles.getPropertyValue("--screen-text-glow").trim();

    ctx.strokeStyle = color;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = CONFIG.glow;
    ctx.lineWidth = CONFIG.lineWidth;

    // ===============================
    // 🎵 pega intensidade do grave
    // ===============================
    let bass = 0;
    const bassBins = Math.floor(bufferLength * 0.08);

    for (let i = 0; i < bassBins; i++) {
      bass += dataArray[i];
    }

    bass /= bassBins;
    const bassNormalized = bass / 255;

    // ===============================
    // 🌅 horizonte
    // ===============================
    const horizon = canvas.height * CONFIG.horizonY;

    // ===============================
    // 🟣 SOL SYNTHWAVE
    // ===============================
    const sunRadius = 60 + bassNormalized * 40;

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      horizon,
      10,
      canvas.width / 2,
      horizon,
      sunRadius
    );

    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, horizon, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // ===============================
    // 🧠 movimento do grid
    // ===============================
    gridOffset += CONFIG.gridSpeed + bassNormalized * CONFIG.bassImpact;
    gridOffset %= CONFIG.gridSpacing;

    // ===============================
    // 🟪 linhas horizontais (perspectiva)
    // ===============================
    for (let i = 0; i < 20; i++) {
      const y = horizon + (i * CONFIG.gridSpacing - gridOffset);

      if (y > canvas.height) continue;

      const perspective = (y - horizon) / (canvas.height - horizon);
      const width = canvas.width * perspective;

      ctx.beginPath();
      ctx.moveTo((canvas.width - width) / 2, y);
      ctx.lineTo((canvas.width + width) / 2, y);
      ctx.stroke();
    }

    // ===============================
    // 🟪 linhas verticais
    // ===============================
    const columns = 12;

    for (let i = -columns; i <= columns; i++) {
      const t = i / columns;
      const bottomX = canvas.width / 2 + t * canvas.width * 0.9;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, horizon);
      ctx.lineTo(bottomX, canvas.height);
      ctx.stroke();
    }
  };
})();