// ===============================
// 📟 GLITCH VISUALIZER
// ===============================

window.Visualizers.glitch = function ({ ctx, canvas, dataArray }) {
  const bass = dataArray[1] / 255;
  const w = canvas.width;
  const h = canvas.height;

  ctx.save();

  // Desenha scanlines básicas
  ctx.strokeStyle = ctx.strokeStyle;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < h; i += 4) {
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
  }

  // Reação ao Grave: Blocos de interferência
  if (bass > 0.7) {
    ctx.globalAlpha = bass * 0.4;
    for (let i = 0; i < 5; i++) {
      const bh = Math.random() * 20;
      const by = Math.random() * h;
      ctx.fillRect(0, by, w, bh); // Blocos horizontais que piscam
    }
  }
  
  ctx.restore();
};