// ===============================
// 🕶️ RETRO GRID VISUALIZER
// ===============================

const gridSettings = {
  speedBase: 1,
  speedBoost: 5,
  gridColor: null, // null = tema
  perspective: 0.5
};

let offset = 0;

window.Visualizers.retrogrid = function ({ ctx, canvas, dataArray }) {
  const bass = dataArray[1] / 255;
  offset += gridSettings.speedBase + (bass * gridSettings.speedBoost);

  const w = canvas.width;
  const h = canvas.height;
  const horizon = h * 0.6;
  
  ctx.save();
  ctx.strokeStyle = ctx.shadowColor; // Usa a cor do glow para a grade
  ctx.lineWidth = 1;

  // Linhas horizontais (movimento)
  for (let i = 0; i < 20; i++) {
    const y = horizon + Math.pow((i + (offset * 0.05) % 1) / 20, 2) * (h - horizon);
    ctx.globalAlpha = (y - horizon) / (h - horizon); // Fade no horizonte
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Linhas verticais (perspectiva)
  for (let i = -10; i <= 10; i++) {
    ctx.beginPath();
    ctx.moveTo(w / 2 + (i * w / 10), h);
    ctx.lineTo(w / 2 + (i * w / 100), horizon);
    ctx.stroke();
  }

  ctx.restore();
};