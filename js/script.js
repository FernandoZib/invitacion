// Cuenta regresiva a la fecha de la boda: 21 de marzo de 2026 a las 7:00 PM (hora local)
const targetDate = new Date("2026-03-21T19:00:00-06:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  
  // Referencias a los elementos (buscamos por ID)
  const daysElement = document.getElementById("days");
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");

  // Si por alguna razón no encuentra los elementos, salimos para evitar errores
  if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

  if (distance <= 0) {
    daysElement.innerText = "0";
    hoursElement.innerText = "00";
    minutesElement.innerText = "00";
    secondsElement.innerText = "00";
    clearInterval(countdownInterval);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysElement.innerText = days;
  hoursElement.innerText = hours.toString().padStart(2, '0');
  minutesElement.innerText = minutes.toString().padStart(2, '0');
  secondsElement.innerText = seconds.toString().padStart(2, '0');
}

// Esperamos a que el contenido del DOM (HTML) esté cargado antes de iniciar
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown(); // Ejecutar una vez al inicio para evitar retardo de 1 seg
  window.countdownInterval = setInterval(updateCountdown, 1000);
});

// Galería Modal
const images = [
  "assets/galeria1.webp",
  "assets/galeria2.webp",
  "assets/galeria3.webp",
  "assets/galeria4.webp",
  "assets/galeria7.webp",
  "assets/galeria11.webp",
  "assets/galeria5.webp",
  "assets/galeria6.webp",
  "assets/galeria8.webp",
  "assets/galeria12.webp",
  "assets/galeria10.webp",
  "assets/galeria14.webp",
  "assets/galeria9.webp",
  "assets/galeria13.webp",
  "assets/galeria15.webp",
  "assets/galeria16.webp",
  "assets/galeria17.webp",  
  "assets/galeria19.webp",
  "assets/galeria20.webp",
  "assets/galeria21.webp"
];

let currentImageIndex = 0;

function openModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    modal.style.display = "block";
    modalImg.src = images[index];

    // Agregar al historial para habilitar botón de atrás
    history.pushState({ modalOpen: true }, null);
}

window.addEventListener("popstate", function (event) {
    const modal = document.getElementById("imageModal");
    if (modal.style.display === "block") {
        closeModal();
    }
});


function closeModal() {
    document.getElementById("imageModal").style.display = "none";
    // Retroceder en el historial si el modal está abierto
    if (history.state && history.state.modalOpen) {
        history.back();
    }
}


function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  document.getElementById("modalImage").src = images[currentImageIndex];
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
  document.getElementById("modalImage").src = images[currentImageIndex];
}

// Cerrar modal al hacer clic fuera de la imagen
const modal = document.getElementById("imageModal");
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        closeModal();
    }
});


const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const indicatorsContainer = document.querySelector('.carousel-indicators');
let currentIndex = 0;

// Crear indicadores
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('indicator');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
        resetInterval();
    });
    indicatorsContainer.appendChild(dot);
});

const indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));

function updateCarousel() {
    const carousel = document.querySelector('.carousel');
    const carouselWidth = carousel.offsetWidth;
    const slide = slides[currentIndex];
    const slideWidth = slide.offsetWidth;
    const slideLeft = slide.offsetLeft;

    const offset = Math.max(slideLeft - (carouselWidth - slideWidth) / 2, 0);
    track.style.transform = `translateX(-${offset}px)`;

    indicators.forEach((indicator, idx) => {
        indicator.classList.toggle('active', idx === currentIndex);
    });
}


// Ajustar al cambiar tamaño
window.addEventListener('resize', updateCarousel);
updateCarousel();

// Avanza automáticamente cada 3 segundos
let interval = setInterval(nextSlide, 3000);

function nextSlide() {
    currentIndex = currentIndex + 1;
    if (currentIndex >= slides.length) {
        currentIndex = 0;
    }
    updateCarousel();
}


function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 3000);
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

                /* Animación */

document.addEventListener("DOMContentLoaded", function() {
  const sections = document.querySelectorAll("section");
  const nombres = document.querySelectorAll("#nombres");
  const decorativos = document.querySelectorAll(
    ".bordes, #decoracion, #decoracion2, #separadorinv, #separador, #separador2, #separador3, #anillos"
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("section-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  sections.forEach(section => {
    section.classList.add("section-hidden");
    observer.observe(section);
  });

  // NUEVO: observer para #nombres al entrar la sección .hero
  const heroSection = document.querySelector(".hero");

  const nombresObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nombres.forEach((nombre, index) => {
          setTimeout(() => {
            nombre.classList.add("visible");
          }, 500 + index * 300);
        });
        nombresObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  if (heroSection) {
    nombresObserver.observe(heroSection);
  }

  decorativos.forEach(element => {
    const observerDecorativos = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerDecorativos.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    observerDecorativos.observe(element);
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const itinerarioItems = document.querySelectorAll(".itinerario-item");

  const observerItinerario = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerItinerario.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  itinerarioItems.forEach(item => {
    observerItinerario.observe(item);
  });
});



document.addEventListener("DOMContentLoaded", function() {
  const anillos = document.querySelectorAll("#anillos");
  const nuestroMatrimonio = document.querySelector(".invitacion-linea h3");
  const separador = document.querySelector("#separador");

  // Aplica la clase de latido con un ligero retraso tras cargar para mayor elegancia
  setTimeout(() => {
    anillos.forEach(anillo => anillo.classList.add("latido"));
    if (nuestroMatrimonio) {
      nuestroMatrimonio.classList.add("latido");
    }
    if (separador) {
      separador.classList.add("latido");
    }
  }, 1000);
});



document.addEventListener("DOMContentLoaded", function() {
  const fraseElemento = document.getElementById('frase-final-texto');
  const textoOriginal = fraseElemento.innerHTML;
  const textoPlano = textoOriginal.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');

  // Crear un clon para medir altura y mantener espacio
  const clon = fraseElemento.cloneNode(true);
  clon.style.visibility = 'hidden';
  clon.style.position = 'absolute';
  clon.style.pointerEvents = 'none';
  document.body.appendChild(clon);
  const altura = clon.offsetHeight;
  document.body.removeChild(clon);

  fraseElemento.style.minHeight = altura + 'px';
  fraseElemento.innerHTML = ''; // Vaciar el texto inicialmente

  let index = 0;

  function escribirFrase() {
    if (index < textoPlano.length) {
      let caracter = textoPlano.charAt(index);
      if (caracter === '\n') {
        fraseElemento.innerHTML += '<br>';
      } else {
        fraseElemento.innerHTML += caracter;
      }
      index++;
      setTimeout(escribirFrase, 40);
    } else {
      fraseElemento.innerHTML = fraseElemento.innerHTML.replace(/\|/, '');
    }
  }

  // IntersectionObserver para activar la animación al hacer scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        escribirFrase();
        observer.unobserve(entry.target); // Para que solo se ejecute una vez
      }
    });
  }, {
    threshold: 0.3 // Se activa cuando al menos el 30% del elemento es visible
  });

  observer.observe(fraseElemento);
});




document.addEventListener("DOMContentLoaded", function() {
  const fraseHero = document.getElementById('hero-frase');
  const textoOriginal = fraseHero.innerHTML;
  const textoPlano = textoOriginal.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');

  // Calcular altura
  const clon = fraseHero.cloneNode(true);
  clon.style.visibility = 'hidden';
  clon.style.position = 'absolute';
  clon.style.pointerEvents = 'none';
  document.body.appendChild(clon);
  const altura = clon.offsetHeight;
  document.body.removeChild(clon);

  fraseHero.style.minHeight = altura + 'px';
  fraseHero.innerHTML = ''; // Vaciar texto inicialmente

  let index = 0;

  function escribirFraseHero() {
    if (index < textoPlano.length) {
      let caracter = textoPlano.charAt(index);
      if (caracter === '\n') {
        fraseHero.innerHTML += '<br>';
      } else {
        fraseHero.innerHTML += caracter;
      }
      index++;
      setTimeout(escribirFraseHero, 40);
    } else {
      fraseHero.innerHTML = fraseHero.innerHTML.replace(/\|/, '');
    }
  }

  // Activar con IntersectionObserver
  const observerHero = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        escribirFraseHero();
        observerHero.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observerHero.observe(fraseHero);
});





// Bloquea solo imágenes con clase "bloquear"
document.querySelectorAll('img.bloquear').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
  //img.addEventListener('touchstart', e => e.preventDefault());
});

// Sigue bloqueando clic derecho general si deseas
document.addEventListener('contextmenu', e => e.preventDefault());
