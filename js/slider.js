document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const track = document.querySelector(".slider-track");
  const images = document.querySelectorAll(".slider-track img");

  const nextBtn = document.querySelector(".right-arrow");
  const prevBtn = document.querySelector(".left-arrow");
  const closeBtn = document.querySelector(".close");

  // segurança extra
  if (!track || images.length === 0) return;

  let index = 0;

  function updateSlide() {
    const slideWidth = images[0].clientWidth;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  document.querySelectorAll(".gallery img").forEach((thumb, i) => {
    thumb.addEventListener("click", () => {
      index = i;
      updateSlide();
      lightbox.classList.add("active");
    });
  });

  nextBtn.onclick = () => {
    if (index < images.length - 1) {
      index++;
      updateSlide();
    }
  };

  prevBtn.onclick = () => {
    if (index > 0) {
      index--;
      updateSlide();
    }
  };

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "Escape") lightbox.classList.remove("active");
  });

  closeBtn.onclick = () => {
    lightbox.classList.remove("active");
  };
});
