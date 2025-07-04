// Cuenta regresiva a la fecha de la boda: 21 de marzo de 2026 a las 7:00 PM (hora local)
const targetDate = new Date("2026-03-21T19:00:00-06:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  if (distance <= 0) {
    // Opcional: mostrar 0 o un mensaje cuando llegue la fecha
    document.getElementById("days").innerText = "0";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
  document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
  document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Galería Modal
const images = [
  "assets/galeria1.jpg",
  "assets/galeria2.jpg",
  "assets/galeria3.jpg",
  "assets/galeria4.jpg",
  "assets/galeria5.jpg"
];

let currentImageIndex = 0;

function openModal(index) {
  currentImageIndex = index;
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modal.style.display = "block";
  modalImg.src = images[index];
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById("modalImage").src = images[currentImageIndex];
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("modalImage").src = images[currentImageIndex];
}


/*Toogle music*/
const musicToggle = document.getElementById('music-toggle');

musicToggle.addEventListener('click', () => {
    window.parent.postMessage('toggle-music', '*');
});

// Escuchar cambios de estado de música enviados por el padre
window.addEventListener('message', (event) => {
    if (event.data === 'music-playing') {
        musicToggle.textContent = '🎵';
    } else if (event.data === 'music-paused') {
        musicToggle.textContent = '🔇';
    }
});


function fadeAudio(audio, from, to, duration, onComplete) {
    const stepTime = 50;
    const steps = duration / stepTime;
    let currentStep = 0;
    const volumeStep = (to - from) / steps;

    audio.volume = from;

    const fadeInterval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(Math.max(audio.volume + volumeStep, 0), 1);

        if (currentStep >= steps) {
            clearInterval(fadeInterval);
            if (onComplete) onComplete();
        }
    }, stepTime);
}
