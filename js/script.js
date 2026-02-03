/**
 * CONFIGURACIÓN GLOBAL
 */
const targetDate = new Date("2026-03-21T19:00:00-06:00").getTime();
const images = [
    "assets/galeria1.webp", "assets/galeria2.webp", "assets/galeria3.webp",
    "assets/galeria4.webp", "assets/galeria7.webp", "assets/galeria11.webp",
    "assets/galeria5.webp", "assets/galeria6.webp", "assets/galeria8.webp",
    "assets/galeria12.webp", "assets/galeria10.webp", "assets/galeria14.webp",
    "assets/galeria9.webp", "assets/galeria13.webp", "assets/galeria15.webp",
    "assets/galeria16.webp", "assets/galeria17.webp", "assets/galeria19.webp",
    "assets/galeria20.webp", "assets/galeria21.webp"
];
let currentImageIndex = 0;

/**
 * FUNCIONES GLOBALES (MODAL)
 */
function openModal(index) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    if (!modal || !modalImg) return;

    currentImageIndex = index;
    modal.style.display = "block";
    modalImg.src = images[index];
    history.pushState({ modalOpen: true }, null);
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    if (!modal) return;
    
    modal.style.display = "none";
    if (history.state && history.state.modalOpen) {
        history.back();
    }
}

function nextImage() {
    const modalImg = document.getElementById("modalImage");
    if (!modalImg) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.src = images[currentImageIndex];
}

function prevImage() {
    const modalImg = document.getElementById("modalImage");
    if (!modalImg) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentImageIndex];
}

/**
 * BLOQUE PRINCIPAL DE CARGA (DOMContentLoaded)
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CUENTA REGRESIVA ---
    const countdownContainer = document.getElementById("countdown");
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

        if (distance <= 0) {
            clearInterval(window.countdownInterval);
            if (countdownContainer) {
                countdownContainer.innerHTML = '<h2 class="fecha-llegada">¡Llegó el día!</h2>';
                countdownContainer.style.display = "block";
                countdownContainer.style.textAlign = "center";
            }
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
    
    if (countdownContainer) {
        updateCountdown();
        window.countdownInterval = setInterval(updateCountdown, 1000);
    }

    // --- 2. MODAL CLIC FUERA ---
    const modal = document.getElementById("imageModal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // --- 3. CARRUSEL ---
    const track = document.querySelector('.carousel-track');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    if (track && indicatorsContainer) {
        const slides = Array.from(track.children);
        let carouselIndex = 0;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                carouselIndex = index;
                updateCarousel();
                resetInterval();
            });
            indicatorsContainer.appendChild(dot);
        });

        const indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));

        function updateCarousel() {
            const carousel = document.querySelector('.carousel');
            if (!carousel) return;
            const offset = Math.max(slides[carouselIndex].offsetLeft - (carousel.offsetWidth - slides[carouselIndex].offsetWidth) / 2, 0);
            track.style.transform = `translateX(-${offset}px)`;
            indicators.forEach((ind, idx) => ind.classList.toggle('active', idx === carouselIndex));
        }

        function nextSlide() {
            carouselIndex = (carouselIndex + 1) % slides.length;
            updateCarousel();
        }

        let slideInterval = setInterval(nextSlide, 3000);
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        }

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // --- 4. MÚSICA ---
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            window.parent.postMessage('toggle-music', '*');
        });
    }

    // --- 5. CANVAS PÉTALOS ---
    const canvas = document.getElementById('petalos-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let petalos = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
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
            this.color = `rgba(204, 182, 130, ${this.opacity})`;
        }

        Petalo.prototype.update = function() {
            this.y += this.speedY; this.x += this.speedX; this.angle += this.spin;
            if (this.y > canvas.height) { this.y = -this.size; this.x = Math.random() * canvas.width; }
        };

        Petalo.prototype.draw = function() {
            ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle);
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size/2, -this.size/2, this.size/2, -this.size/2, 0, 0);
            ctx.fillStyle = this.color; ctx.fill(); ctx.restore();
        };

        for (let i = 0; i < 30; i++) petalos.push(new Petalo());
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petalos.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };
        animate();
    }

// --- 6. ANIMACIONES INTERSECTION OBSERVER ---
    const observerOptions = { threshold: 0.1 };
    
    const generalObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activamos la visibilidad de la sección o elemento
                entry.target.classList.add("section-visible", "visible");

                // Lógica específica para los nombres (Daniela & Fernando)
                // Buscamos si dentro de la sección que acaba de aparecer están los nombres
                const nombres = entry.target.querySelectorAll("#nombres");
                if (nombres.length > 0) {
                    nombres.forEach((nombre, index) => {
                        setTimeout(() => {
                            nombre.classList.add("visible");
                        }, 500 + index * 300); // Mantiene el retraso original
                    });
                }

                generalObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleccionamos elementos, excluyendo los nombres del flujo general para manejarlos con delay
    const elementosAObservar = document.querySelectorAll("section, .itinerario-item, .bordes, #decoracion, #decoracion2, #separadorinv, #separador, #separador2, #separador3, #anillos");
    
    elementosAObservar.forEach(el => {
        el.classList.add("section-hidden");
        generalObserver.observe(el);
    });

    // --- EFECTO DE ESCRITURA (TYPEWRITER) ---
    // Se mantiene intacto como lo tenías, funcionando con su propio observer
    function setupTypewriter(id) {
        const el = document.getElementById(id);
        if (!el) return;
        
        // Guardamos el contenido original antes de limpiar
        const textoOriginal = el.innerHTML;
        const textoPlano = textoOriginal.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
        
        // Reservamos el espacio para que no haya saltos visuales
        el.style.minHeight = el.offsetHeight + 'px';
        el.innerHTML = '';
        
        let i = 0;
        const escribir = () => {
            if (i < textoPlano.length) {
                el.innerHTML += textoPlano.charAt(i) === '\n' ? '<br>' : textoPlano.charAt(i);
                i++; 
                setTimeout(escribir, 40);
            }
        };

        const typewriterObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { 
                escribir(); 
                typewriterObserver.unobserve(el); // Solo escribe una vez
            }
        }, { threshold: 0.3 });
        
        typewriterObserver.observe(el);
    }

    setupTypewriter('frase-final-texto');
    setupTypewriter('hero-frase');
    // Corazones / Anillos latido
    setTimeout(() => {
        document.querySelectorAll("#anillos, .invitacion-linea h3, #separador").forEach(el => el && el.classList.add("latido"));
    }, 1000);
});

/**
 * EVENTOS DE VENTANA (HISTORIAL Y BLOQUEO)
 */
window.addEventListener("popstate", () => {
    const modal = document.getElementById("imageModal");
    if (modal && modal.style.display === "block") closeModal();
});

document.addEventListener('contextmenu', e => e.preventDefault());
document.querySelectorAll('img.bloquear').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
});

window.addEventListener('message', (event) => {
    const musicToggle = document.getElementById('music-toggle');
    if (!musicToggle) return;
    if (event.data === 'music-playing') musicToggle.textContent = '🎵';
    else if (event.data === 'music-paused') musicToggle.textContent = '🔇';
});
