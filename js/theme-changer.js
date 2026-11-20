// ========================================
// THEME CHANGER + CHRISTMAS MODE
// ========================================

const themeSelect = document.getElementById("site-theme");
const christmasButton = document.getElementById("christmas-toggle");

const THEME_KEY = "site-theme";
const CHRISTMAS_KEY = "christmas-mode";

// Configurações recebidas do script no HEAD
const isChristmasAvailable = window.CHRISTMAS_AVAILABLE;
const christmasMode = window.CHRISTMAS_MODE;


// ========================================
// 1. BOTÃO DE NATAL
// ========================================

// Só mostra o botão durante a edição de Natal
if (isChristmasAvailable) {

  christmasButton.hidden = false;

  // Atualiza o texto do botão
  christmasButton.textContent = christmasMode
    ? "Christmas: ON 🎄"
    : "Christmas: OFF";

  // Alterna entre ON e OFF
  christmasButton.addEventListener("click", () => {

    if (christmasMode) {
      localStorage.setItem(CHRISTMAS_KEY, "off");
    } else {
      localStorage.setItem(CHRISTMAS_KEY, "on");
    }

    // Recarrega para ativar/desativar os efeitos corretamente
    window.location.reload();

  });

}


// ========================================
// 2. THEME CHANGER
// ========================================

// Recupera o tema salvo
const currentTheme = localStorage.getItem(THEME_KEY) || "";

// Atualiza visualmente o select
themeSelect.value = christmasMode ? "christmas" : currentTheme;

// ON: bloqueia o seletor
// OFF: libera o seletor
themeSelect.disabled = christmasMode;


// ========================================
// 3. ALTERAÇÃO DE TEMA
// ========================================

themeSelect.addEventListener("change", () => {

  const selectedTheme = themeSelect.value;

  // Pega todas as classes de tema disponíveis
  const allThemes = Array.from(themeSelect.options)
    .map(opt => opt.value)
    .filter(val => val !== "");

  // Remove os temas anteriores
  document.documentElement.classList.remove(...allThemes);

  // Aplica o novo tema
  if (selectedTheme) {
    document.documentElement.classList.add(selectedTheme);
  }

  // Salva a escolha
  localStorage.setItem(THEME_KEY, selectedTheme);

});