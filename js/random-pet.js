const images = [
  "/assets/pet/1.png",
  
  "/assets/pet/3.png",
  "/assets/pet/4.png",
  "/assets/pet/5.png",
  "/assets/pet/6.png",
  "/assets/pet/7.png",
  "/assets/pet/8.png",
  "/assets/pet/9.png",
  "/assets/pet/10.png",
  "/assets/pet/11.png",
  "/assets/pet/12.png",
    
  "/assets/pet/14.png",
  "/assets/pet/15.png",
  "/assets/pet/16.png",
  "/assets/pet/17.png",
  "/assets/pet/18.png",
  "/assets/pet/19.png",
  "/assets/pet/20.png",
  "/assets/pet/21.png",
  "/assets/pet/22.png",
  "/assets/pet/23.png",
  "/assets/pet/24.png",
  "/assets/pet/25.png",
  "/assets/pet/26.png",
  "/assets/pet/27.png",
  "/assets/pet/28.png",
  "/assets/pet/29.png",
  "/assets/pet/30.png",
  "/assets/pet/31.png",
  "/assets/pet/32.png",
  "/assets/pet/33.png",
  "/assets/pet/34.png",
  "/assets/pet/35.png",
  "/assets/pet/36.png",
  "/assets/pet/37.png",
  "/assets/pet/38.png",
  "/assets/pet/39.png",
  "/assets/pet/40.png",
  "/assets/pet/41.png",
  "/assets/pet/42.png",
  "/assets/pet/43.png",
  "/assets/pet/44.png",
  "/assets/pet/45.png",
  "/assets/pet/46.png",
  "/assets/pet/47.png"
];

const imgElement = document.getElementById("pet-image");

const randomIndex = Math.floor(Math.random() * images.length);
imgElement.src = images[randomIndex];
