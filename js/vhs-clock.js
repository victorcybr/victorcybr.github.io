function updateVHSClock() {
  const now = new Date();

  const pad = (n) => String(n).padStart(2, '0');

  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const isAM = hours < 12;
  const period = isAM ? "AM" : "PM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  hours = pad(hours);

  const months = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
  ];

  const month = months[now.getMonth()];
  const day = pad(now.getDate());
  const year = now.getFullYear();

  const text =
    `${period} ${hours}:${minutes}:${seconds}\n` +
    `${month} ${day} ${year}`;

  const el = document.getElementById("vhs-clock");
  if (el) {
    el.textContent = text;
    // ✨ A LINHA MÁGICA ESTÁ AQUI:
    // Ela copia o texto exatamente como ele é para o atributo que o CSS usa
    el.setAttribute("data-text", text);
  }
}

updateVHSClock();
setInterval(updateVHSClock, 1000);