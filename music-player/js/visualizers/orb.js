// ===============================
// 🔮 ORB VISUALIZER
// ===============================

const orbSettings = {
  baseRadius: 0.1,      // Tamanho base (20% do canvas)
  sensitivity: 2.0,     // O quanto ela cresce com o grave
  glowMax: 60,          // Brilho máximo no pico do grave
  lineWidth: 3,         // Espessura da borda
  smoothing: 0.80       // Suavização do movimento
};

let orbSize = 0;

window.Visualizers.orb = function ({ ctx, canvas, dataArray }) {
  // Pega a média dos graves (primeiros 4 buffers)
  const bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;
  const targetSize = (bass / 255);
  
  // Suaviza o crescimento
  orbSize += (targetSize - orbSize) * orbSettings.smoothing;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = (canvas.height * orbSettings.baseRadius) + (orbSize * canvas.height * 0.3 * orbSettings.sensitivity);

  ctx.save();
  
  // Cores do tema
  const themeColor = ctx.strokeStyle;
  const themeGlow = ctx.shadowColor;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  
  // Efeito de Vidro/Neon
  ctx.lineWidth = orbSettings.lineWidth;
  ctx.strokeStyle = themeColor;
  ctx.shadowBlur = orbSize * orbSettings.glowMax;
  ctx.shadowColor = themeGlow;
  
  // Gradiente interno suave
  const grad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, themeColor);
  ctx.fillStyle = grad;
  ctx.globalAlpha = 0.3;
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.stroke();
  
  ctx.restore();
};