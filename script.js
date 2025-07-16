document.addEventListener('DOMContentLoaded', () => {
    const sealImg = document.getElementById('seal-img');
    const wrapper = document.getElementById('wrapper');
    const seal = document.getElementById('seal');
    const invitationContent = document.getElementById('invitationContent');
    const backgroundMusic = document.getElementById('background-music');

    sealImg.addEventListener('click', () => {
        // Abrir invitación con animación
        wrapper.classList.add('open');

        // Ocultar sello
        seal.classList.add('hide-seal');

        // Mostrar invitación con animación si tu CSS requiere esta clase
        invitationContent.classList.add('show');

        // Iniciar música de fondo
        backgroundMusic.play().catch(err => {
            console.log('Error al reproducir música:', err);
        });

        // Lanzar confeti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    });

    // Control de música vía postMessage
    window.addEventListener('message', (event) => {
        if (event.data === 'toggle-music') {
            if (backgroundMusic.paused) {
                fadeAudio(backgroundMusic, 0, 1, 1000);
                backgroundMusic.play().catch(err => console.log('Error al reanudar música:', err));
                document.querySelector('iframe').contentWindow.postMessage('music-playing', '*');
            } else {
                fadeAudio(backgroundMusic, 1, 0, 1000, () => backgroundMusic.pause());
                document.querySelector('iframe').contentWindow.postMessage('music-paused', '*');
            }
        }
    });
});

// Fade de audio suave
function fadeAudio(audio, from, to, duration, callback) {
    const stepTime = 50;
    const steps = duration / stepTime;
    let currentStep = 0;

    const volumeStep = (to - from) / steps;
    audio.volume = from;

    const fade = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(Math.max(audio.volume + volumeStep, 0), 1);
        if (currentStep >= steps) {
            clearInterval(fade);
            if (callback) callback();
        }
    }, stepTime);
}


