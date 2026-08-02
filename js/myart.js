const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");

document.querySelectorAll(".art img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.dataset.full;
    lightbox.classList.add("active");
  });
});

closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("active");
  lightboxImg.src = "";
});

// clicar fora fecha também
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("active");
    lightboxImg.src = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const lightbox = document.getElementById("lightbox");

    if (lightbox.classList.contains("active")) {
      lightbox.classList.remove("active");
    }
  }
});
