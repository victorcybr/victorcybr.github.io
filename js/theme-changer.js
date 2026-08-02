const themeSelect = document.getElementById("site-theme");
const THEME_KEY = "site-theme";

// 1. Atualiza visualmente o <select> com o tema que já foi carregado no <head>
const currentTheme = localStorage.getItem(THEME_KEY) || "";
themeSelect.value = currentTheme;

// 2. Quando o usuário escolher outro tema na lista
themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;
  
  // Pega todos os valores possíveis no select (ignorando o Default vazio)
  const allThemes = Array.from(themeSelect.options)
    .map(opt => opt.value)
    .filter(val => val !== "");

  // Remove qualquer classe de tema que esteja no <html>
  document.documentElement.classList.remove(...allThemes);

  // Se não for o default, adiciona a nova classe
  if (selectedTheme) {
    document.documentElement.classList.add(selectedTheme);
  }

  // Salva a escolha para a próxima visita
  localStorage.setItem(THEME_KEY, selectedTheme);
});