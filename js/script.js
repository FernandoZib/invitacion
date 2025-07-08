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


const canvas = document.getElementById('petalos-canvas');
const ctx = canvas.getContext('2d');
let petalos = [];
const cantidad = 30;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

function Petalo() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = 15 + Math.random() * 20;
    this.speedY = 1 + Math.random() * 2;
    this.speedX = Math.random() * 1 - 0.5;
    this.opacity = 0.6 + Math.random() * 0.4;
    this.angle = Math.random() * 2 * Math.PI;
    this.spin = Math.random() * 0.02 - 0.01;
    this.color = 'rgba(204, 182, 130,' + this.opacity + ')'; // Rosa pastel
}

Petalo.prototype.update = function() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.angle += this.spin;
    if (this.y > canvas.height) {
        this.y = -this.size;
        this.x = Math.random() * canvas.width;
    }
};

Petalo.prototype.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-this.size / 2, -this.size / 2, this.size / 2, -this.size / 2, 0, 0);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
};

function init() {
    petalos = [];
    for (let i = 0; i < cantidad; i++) {
        petalos.push(new Petalo());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < petalos.length; i++) {
        petalos[i].update();
        petalos[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();
