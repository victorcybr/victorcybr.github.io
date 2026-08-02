// ===============================
// ✨ PARTICLE FOUNTAIN VISUALIZER
// ===============================

const partSettings = {
  maxParticles: 50,     // Limite para não travar o PC
  baseSize: 0.5,        // Tamanho mínimo da partícula
  gravity: 0.70,        // Força que puxa elas para baixo (0 = gravidade zero)
  drift: 1.95,          // Espalhamento lateral
  bassThreshold: 0.7,   // Sensibilidade do "bumbo" (0.0 a 1.0)
  glow: 5               // Intensidade do brilho das partículas
};

let particles = [];

window.Visualizers.particles = function ({ ctx, canvas, dataArray, bufferLength }) {
  // 1. ANÁLISE DE ÁUDIO
  // Pegamos o grave (bumbo) e o agudo (hi-hats/caixa)
  const bass = dataArray[2] / 255; 
  const treble = dataArray[bufferLength - 10] / 255;

  // 2. CRIAÇÃO (Spawn)
  // Se o grave bater forte, cria partículas grandes
  if (bass > partSettings.bassThreshold) {
    const amount = Math.floor(bass * 5); // Quantidade baseada na força
    for (let i = 0; i < amount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.8, // Nasce na base do player
        vx: (Math.random() - 0.5) * 10, // Velocidade X aleatória
        vy: -bass * 12,                // Velocidade Y (tiro para cima)
        size: partSettings.baseSize + (bass * 5),
        life: 1.0,                     // Opacidade inicial
        decay: 0.01 + Math.random() * 0.02
      });
    }
  }

  // Partículas constantes menores baseadas no ritmo geral
  if (treble > 0.2 && particles.length < partSettings.maxParticles) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.8,
      vx: (Math.random() - 0.5) * 5,
      vy: -treble * 8,
      size: partSettings.baseSize,
      life: 0.8,
      decay: 0.03
    });
  }

  // 3. ATUALIZAÇÃO E DESENHO
  ctx.save();
  ctx.shadowBlur = partSettings.glow;
  ctx.shadowColor = ctx.strokeStyle; // Usa a cor do tema
  ctx.fillStyle = ctx.strokeStyle;

  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];

    // Física
    p.vx += (Math.random() - 0.5) * partSettings.drift;
    p.vy += partSettings.gravity;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;

    // Remover partículas mortas ou fora da tela
    if (p.life <= 0 || p.y > canvas.height) {
      particles.splice(i, 1);
      continue;
    }

    // Desenhar
    ctx.globalAlpha = p.life;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};