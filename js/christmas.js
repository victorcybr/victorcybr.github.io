// ========================================
// CHRISTMAS DECORATIONS
// ========================================

// Só executa se o tema de Natal estiver ativo
if (document.documentElement.classList.contains("christmas")) {

  // ========================================
  // 1. LUZINHAS DE NATAL
  // ========================================

  const lights = document.createElement("div");
  lights.className = "christmas-lights";

  // Criamos o fio
  const wire = document.createElement("div");
  wire.className = "christmas-wire";
  lights.appendChild(wire);

  // Cores clássicas das luzes
  const bulbColors = [
    {
      off: "#660000",
      on: "#FFDDDD",
      glow: "#FF0000"
    },
    {
      off: "#005500",
      on: "#CCFFCC",
      glow: "#00DD00"
    },
    {
      off: "#002266",
      on: "#AAFFFF",
      glow: "#0066FF"
    },
    {
      off: "#664400",
      on: "#FFEEAA",
      glow: "#FFCC00"
    }
  ];

  // Quantidade de lâmpadas
  const bulbCount = 32;

  for (let i = 0; i < bulbCount; i++) {

    const bulb = document.createElement("span");
    bulb.className = "christmas-bulb";

    // Distribui as lâmpadas pelo fio
    const position = (i / (bulbCount - 1)) * 100;

    // Pequena curva para acompanhar o fio
    const curve = 18;

    // Alterna as quatro cores
    const colors = bulbColors[i % bulbColors.length];

    bulb.style.left = position + "%";
    bulb.style.top = curve + "px";

    bulb.style.setProperty("--bulb-off", colors.off);
    bulb.style.setProperty("--bulb-on", colors.on);
    bulb.style.setProperty("--bulb-glow", colors.glow);

    // Cada lâmpada pisca em um momento diferente
    bulb.style.setProperty("--blink-delay", (i * -0.19) + "s");

    lights.appendChild(bulb);
  }

  document.body.appendChild(lights);


  // ========================================
  // 2. NEVE
  // ========================================

  const snowCanvas = document.createElement("canvas");
  snowCanvas.id = "christmas-snow";

  document.body.appendChild(snowCanvas);

  const ctx = snowCanvas.getContext("2d");

  let width;
  let height;
  let flakes = [];

  // Detecta preferência por movimento reduzido
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const snowSpeed = 2;

  // Configura o tamanho do canvas
  function resizeSnow() {

    width = window.innerWidth;
    height = window.innerHeight;

    // Limita a resolução para não desperdiçar desempenho
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    snowCanvas.width = width * dpr;
    snowCanvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Quantidade de flocos proporcional à tela
    const flakeCount = Math.min(
      90,
      Math.max(35, Math.floor((width * height) / 18000))
    );

    flakes = [];

    for (let i = 0; i < flakeCount; i++) {

      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,

        // Tamanho de cada floco
        radius: Math.random() * 2.5 + 1,

        // Velocidade de queda
        speed: Math.random() * 0.8 + 0.4,

        // Movimento lateral
        drift: Math.random() * 0.6 - 0.3,

        // Variação individual do movimento
        phase: Math.random() * Math.PI * 2,

        // Transparência
        opacity: Math.random() * 0.5 + 0.35
      });
    }
  }


  // Desenha os flocos na tela
  function drawSnow(time) {

    ctx.clearRect(0, 0, width, height);

    flakes.forEach(flake => {

      // Desenha um floco branco
      ctx.beginPath();

      ctx.arc(
        flake.x,
        flake.y,
        flake.radius,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      
      ctx.shadowBlur = 5;
      ctx.shadowColor = "rgba(255, 255, 255, 1)";
      
      ctx.fill();
      ctx.shadowBlur = 0;

      // Movimento dos flocos
      if (!reduceMotion) {

        flake.y += flake.speed * snowSpeed;

        // Movimento suave de um lado para o outro
        flake.x += flake.drift + Math.sin(
          time * 0.001 + flake.phase
        ) * 0.35;

        // Quando o floco sai da tela, ele volta para cima
        if (flake.y > height + 5) {
          flake.y = -5;
          flake.x = Math.random() * width;
        }

        // Reaparece do outro lado se sair horizontalmente
        if (flake.x < -5) flake.x = width + 5;
        if (flake.x > width + 5) flake.x = -5;
      }
    });
  }


  // Animação principal
  function animateSnow(time) {

    drawSnow(time);

    if (!reduceMotion) {
      requestAnimationFrame(animateSnow);
    }
  }

  // Inicialização
  resizeSnow();

  // Se a janela mudar de tamanho, recalcula a neve
  window.addEventListener("resize", resizeSnow);

  // Começa a animação
  requestAnimationFrame(animateSnow);

  // ========================================
  // 3. LINKS COM LUZES DE NATAL
  // ========================================

  /* const linkColors = [
    "#ff3333", // Vermelho
    "#ffdd33", // Amarelo
    "#33dd55", // Verde
    "#3388ff"  // Azul
  ];

  // Seleciona todos os links da página
  const links = document.querySelectorAll("a");

  links.forEach(link => {

    // Procura os textos dentro do link
    const walker = document.createTreeWalker(
      link,
      NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    // Guarda os textos antes de modificá-los
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim() !== "") {
        textNodes.push(walker.currentNode);
      }
    }

    let letterIndex = 0;

    // Transforma cada caractere em um pequeno elemento
    textNodes.forEach(node => {

      const fragment = document.createDocumentFragment();

      for (const character of node.textContent) {

        const letter = document.createElement("span");
        letter.className = "christmas-letter";
        letter.textContent = character;

        fragment.appendChild(letter);
      }

      node.replaceWith(fragment);
    });

    // Aplica as cores quando o mouse entra no link
    link.addEventListener("mouseenter", () => {

      const letters = link.querySelectorAll(".christmas-letter");

      letters.forEach(letter => {

        // Espaços não precisam consumir uma cor
        if (letter.textContent.trim() === "") return;

        const color = linkColors[letterIndex % linkColors.length];

        letter.style.color = color;

        // Brilho individual da letra
        letter.style.textShadow =
          `0 0 4px ${color}, 0 0 9px ${color}`;

        letterIndex++;
      });

    });

    // Remove as cores especiais quando o mouse sai
    link.addEventListener("mouseleave", () => {

      const letters = link.querySelectorAll(".christmas-letter");

      letters.forEach(letter => {
        letter.style.color = "";
        letter.style.textShadow = "";
      });

      letterIndex = 0;
    });

  }); */

}